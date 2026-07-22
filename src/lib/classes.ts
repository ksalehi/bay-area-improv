import Papa from "papaparse";

export interface ImprovClass {
  theater: string;
  name: string;
  link: string;
  price: string;
  description: string;
  format: string;
  isDropIn: boolean;
}

export interface TheaterClasses {
  theater: string;
  classes: ImprovClass[];
}

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1fe0PrduAOEQAP6vi-FD6ieodZE_cJsglEhe58PoHJo0/export?format=csv&gid=1749929072";

export async function fetchClasses(): Promise<TheaterClasses[]> {
  const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const csv = await res.text();
  const { data } = Papa.parse<string[]>(csv, { skipEmptyLines: true });

  // First row is headers — skip it
  const rows = data.slice(1);
  const byTheater = new Map<string, ImprovClass[]>();
  let currentTheater = "";

  for (const row of rows) {
    if (row[0]?.trim()) currentTheater = row[0].trim();
    const name = row[1]?.trim() ?? "";
    if (!name || !currentTheater) continue;

    const entry: ImprovClass = {
      theater: currentTheater,
      name,
      link: row[2]?.trim() ?? "",
      price: row[3]?.trim() ?? "",
      description: row[4]?.trim() ?? "",
      format: row[5]?.trim() ?? "",
      isDropIn: /drop.?in|sampler/i.test(name),
    };

    if (!byTheater.has(currentTheater)) byTheater.set(currentTheater, []);
    byTheater.get(currentTheater)!.push(entry);
  }

  return Array.from(byTheater.entries())
    .filter(([, classes]) => classes.length > 0)
    .map(([theater, classes]) => ({ theater, classes }));
}
