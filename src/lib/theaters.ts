import Papa from "papaparse";

export interface Theater {
  name: string;
  city: string;
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

const TWO_WORD_CITIES = [
  "san-francisco", "walnut-creek", "san-jose", "san-mateo",
  "santa-clara", "santa-cruz", "daly-city", "los-altos",
];

function cityFromYelpUrl(yelpUrl: string): string {
  if (!yelpUrl) return "";
  try {
    const slug = new URL(yelpUrl).pathname.split("/").filter(Boolean).pop() ?? "";
    const clean = slug.replace(/-\d+$/, "");
    for (const city of TWO_WORD_CITIES) {
      if (clean.endsWith(`-${city}`) || clean === city) {
        return city.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
      }
    }
    const last = clean.split("-").pop() ?? "";
    return last ? last[0].toUpperCase() + last.slice(1) : "";
  } catch {
    return "";
  }
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
  return data.slice(1).map((row) => {
    const yelpUrl = row[2] ?? "";
    return {
      name: row[0] ?? "",
      city: cityFromYelpUrl(yelpUrl),
      mapsQuery: row[1] ?? "",
      yelpUrl,
      websiteUrl: normalizeUrl(row[3] ?? ""),
      blurb: row[4] ?? "",
      imageUrl: firstImageUrl(row[5] ?? ""),
    };
  }).filter((t) => t.name);
}
