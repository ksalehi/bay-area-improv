import Papa from "papaparse";

export interface Theater {
  name: string;
  mapsQuery: string;
  yelpUrl: string;
  websiteUrl: string;
  blurb: string;
  imageUrl: string | null;
}

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1fe0PrduAOEQAP6vi-FD6ieodZE_cJsglEhe58PoHJo0/export?format=csv&gid=1792041898";

function normalizeUrl(url: string): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}

function firstImageUrl(cell: string): string | null {
  const first = cell.split("\n").map((s) => s.trim()).find(Boolean) ?? null;
  return first || null;
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?q=${encodeURIComponent(query)}`;
}

export async function fetchTheaters(): Promise<Theater[]> {
  const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const csv = await res.text();
  const { data } = Papa.parse<string[]>(csv, { skipEmptyLines: true });

  // First row is headers — skip it
  return data.slice(1).map((row) => ({
    name: row[0] ?? "",
    mapsQuery: row[1] ?? "",
    yelpUrl: row[2] ?? "",
    websiteUrl: normalizeUrl(row[3] ?? ""),
    blurb: row[4] ?? "",
    imageUrl: firstImageUrl(row[5] ?? ""),
  })).filter((t) => t.name);
}
