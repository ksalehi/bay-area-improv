import fs from "fs";
import path from "path";
import Papa from "papaparse";

export interface Team {
  name: string;
  instagramHandle: string | null;
  instagramUrl: string | null;
  tiktokHandle: string | null;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  websiteUrl: string | null;
  ticketsUrl: string | null;
  photoUrl?: string;
  contactPerson?: string;
}

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1fe0PrduAOEQAP6vi-FD6ieodZE_cJsglEhe58PoHJo0/export?format=csv&gid=0";

function normalizeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function photoUrlsByHandle(): Map<string, string> {
  const dir = path.join(process.cwd(), "public", "teams");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return new Map();
  }
  return new Map(files.map((file) => [path.parse(file).name, `/teams/${file}`]));
}

function columnIndex(header: string[], name: string): number {
  return header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
}

export async function fetchTeams(): Promise<Team[]> {
  const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const csv = await res.text();
  const { data } = Papa.parse<string[]>(csv, { skipEmptyLines: true });
  const photos = photoUrlsByHandle();

  const [header, ...rows] = data;
  const nameCol = columnIndex(header, "Name");
  const instagramCol = columnIndex(header, "Instagram");
  const tiktokCol = columnIndex(header, "TikTok");
  const facebookCol = columnIndex(header, "Facebook");
  const websiteCol = columnIndex(header, "Website");
  const ticketsCol = columnIndex(header, "Tickets");
  const activeCol = columnIndex(header, "Active");

  return rows
    .map((row) => {
      const handle = row[instagramCol]?.trim().replace(/^@/, "") ?? "";
      const tiktokHandle = row[tiktokCol]?.trim().replace(/^@/, "") ?? "";
      return {
        name: row[nameCol]?.trim() ?? "",
        active: ["y", "yes"].includes(row[activeCol]?.trim().toLowerCase() ?? ""),
        instagramHandle: handle || null,
        instagramUrl: handle ? `https://instagram.com/${handle}` : null,
        tiktokHandle: tiktokHandle || null,
        tiktokUrl: tiktokHandle ? `https://tiktok.com/@${tiktokHandle}` : null,
        facebookUrl: normalizeUrl(row[facebookCol] ?? ""),
        websiteUrl: normalizeUrl(row[websiteCol] ?? ""),
        ticketsUrl: normalizeUrl(row[ticketsCol] ?? ""),
        photoUrl: handle ? photos.get(handle) : undefined,
      };
    })
    .filter((t) => t.name && t.active)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      ({
        name,
        instagramHandle,
        instagramUrl,
        tiktokHandle,
        tiktokUrl,
        facebookUrl,
        websiteUrl,
        ticketsUrl,
        photoUrl,
      }) => ({
        name,
        instagramHandle,
        instagramUrl,
        tiktokHandle,
        tiktokUrl,
        facebookUrl,
        websiteUrl,
        ticketsUrl,
        photoUrl,
      })
    );
}
