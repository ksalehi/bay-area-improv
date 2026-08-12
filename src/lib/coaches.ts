import fs from "fs";
import path from "path";
import Papa from "papaparse";

export interface Coach {
  name: string;
  pronouns: string | null;
  bio: string | null;
  specialties: string[];
  identifiers: string[];
  available: boolean;
  years: string | null;
  photoUrl?: string;
}

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1fe0PrduAOEQAP6vi-FD6ieodZE_cJsglEhe58PoHJo0/export?format=csv&gid=738795093";

function columnIndex(header: string[], name: string): number {
  return header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
}

function snakeCase(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function photoUrlsByName(): Map<string, string> {
  const dir = path.join(process.cwd(), "public", "coaches");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return new Map();
  }
  return new Map(files.map((file) => [path.parse(file).name, `/coaches/${file}`]));
}

function splitTags(cell: string): string[] {
  return cell
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function fetchCoaches(): Promise<Coach[]> {
  const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const csv = await res.text();
  const { data } = Papa.parse<string[]>(csv, { skipEmptyLines: true });

  const [header, ...rows] = data;
  const nameCol = columnIndex(header, "Name");
  const pronounsCol = columnIndex(header, "Pronouns");
  const bioCol = columnIndex(header, "Bio");
  const specialtiesCol = columnIndex(header, "Specialties");
  const identifiersCol = columnIndex(header, "Identifiers");
  const availableCol = columnIndex(header, "Available");
  const yearsCol = columnIndex(header, "Years");
  const photos = photoUrlsByName();

  return rows
    .map((row) => {
      const name = row[nameCol]?.trim() ?? "";
      return {
        name,
        pronouns: row[pronounsCol]?.trim() || null,
        bio: row[bioCol]?.trim() || null,
        specialties: splitTags(row[specialtiesCol] ?? ""),
        identifiers: splitTags(row[identifiersCol] ?? ""),
        available: row[availableCol]?.trim().toLowerCase() === "yes",
        years: row[yearsCol]?.trim() || null,
        photoUrl: name ? photos.get(snakeCase(name)) : undefined,
      };
    })
    .filter((c) => c.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}
