import fs from "fs";
import path from "path";
import Papa from "papaparse";

export interface Festival {
  name: string;
  websiteUrl: string | null;
  instagramHandle: string | null;
  instagramUrl: string | null;
  description: string | null;
  imageUrl: string | null;
  location: string | null;
  date: string | null;
}

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1fe0PrduAOEQAP6vi-FD6ieodZE_cJsglEhe58PoHJo0/gviz/tq?tqx=out:csv&sheet=Festivals&headers=1";

function columnIndex(header: string[], name: string): number {
  return header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
}

function snakeCase(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function photoUrlsByName(): Map<string, string> {
  const dir = path.join(process.cwd(), "public", "festivals");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return new Map();
  }
  return new Map(files.map((file) => [path.parse(file).name, `/festivals/${file}`]));
}

function normalizeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Dates come in as free text like "Aug 12-18, 2026" or "Aug 28" (no year) —
// this pulls out the start/end days and infers a year when one isn't given,
// rolling over to next year if the (last) day has already passed.
function parseFestivalDateRange(
  raw: string | null,
  reference: Date
): { start: Date; end: Date } | null {
  if (!raw) return null;
  const match = raw.match(/^([A-Za-z]+)\.?\s+(\d{1,2})(?:\s*-\s*(\d{1,2}))?(?:,?\s*(\d{4}))?/);
  if (!match) return null;

  const monthIndex = MONTHS.indexOf(match[1].slice(0, 3).toLowerCase());
  if (monthIndex === -1) return null;

  const startDay = Number(match[2]);
  const endDay = match[3] ? Number(match[3]) : startDay;
  const year = match[4] ? Number(match[4]) : reference.getFullYear();

  let start = new Date(year, monthIndex, startDay);
  let end = new Date(year, monthIndex, endDay);

  if (!match[4] && end < reference) {
    start = new Date(year + 1, monthIndex, startDay);
    end = new Date(year + 1, monthIndex, endDay);
  }
  return { start, end };
}

async function fetchCsv(url: string, retries = 2): Promise<string> {
  for (let attempt = 0; ; attempt++) {
    try {
      // no-store: a failed/rate-limited response must never be cached as if it
      // were good data — see coaches.ts for the incident this guards against.
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return res.text();
      if (attempt >= retries) {
        throw new Error(`Festivals sheet fetch failed: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      if (attempt >= retries) throw err;
    }
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
  }
}

export async function fetchFestivals(): Promise<Festival[]> {
  const csv = await fetchCsv(SHEET_CSV_URL);
  const { data } = Papa.parse<string[]>(csv, { skipEmptyLines: true });

  const [header, ...rows] = data;
  const nameCol = columnIndex(header, "Name");
  const websiteCol = columnIndex(header, "Website");
  const instagramCol = columnIndex(header, "Instagram");
  const descriptionCol = columnIndex(header, "Description");
  const locationCol = columnIndex(header, "Location");
  const dateCol = columnIndex(header, "Date");
  const photos = photoUrlsByName();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return rows
    .map((row) => {
      const name = row[nameCol]?.trim() ?? "";
      const handle = row[instagramCol]?.trim().replace(/^@/, "") ?? "";
      return {
        name,
        websiteUrl: normalizeUrl(row[websiteCol] ?? ""),
        instagramHandle: handle || null,
        instagramUrl: handle ? `https://instagram.com/${handle}` : null,
        description: row[descriptionCol]?.trim() || null,
        imageUrl: name ? photos.get(snakeCase(name)) ?? null : null,
        location: row[locationCol]?.trim() || null,
        date: row[dateCol]?.trim() || null,
      };
    })
    .filter((f) => f.name)
    .sort((a, b) => {
      const rangeA = parseFestivalDateRange(a.date, today);
      const rangeB = parseFestivalDateRange(b.date, today);
      const rankA = rangeA && rangeA.end >= today ? rangeA.start.getTime() : Infinity;
      const rankB = rangeB && rangeB.end >= today ? rangeB.start.getTime() : Infinity;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name);
    });
}
