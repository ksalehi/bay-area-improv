import Papa from "papaparse";

export interface ImprovClass {
  theater: string;
  name: string;
  link: string;
  price: string;
  description: string;
  format: string;
  isDropIn: boolean;
  isWorkshop: boolean;
}

export interface TheaterClasses {
  theater: string;
  classes: ImprovClass[];
}

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1fe0PrduAOEQAP6vi-FD6ieodZE_cJsglEhe58PoHJo0/export?format=csv&gid=1749929072";

async function fetchCsv(url: string, retries = 2): Promise<string> {
  for (let attempt = 0; ; attempt++) {
    try {
      // no-store: a failed/rate-limited response must never be cached as if it
      // were good data — that's what left production stuck showing zero classes
      // until a redeploy. Retries below ride out transient blips instead.
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return res.text();
      if (attempt >= retries) {
        throw new Error(`Classes sheet fetch failed: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      if (attempt >= retries) throw err;
    }
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
  }
}

export async function fetchClasses(): Promise<TheaterClasses[]> {
  const csv = await fetchCsv(SHEET_CSV_URL);
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
      isWorkshop: /workshop/i.test(name),
    };

    if (!byTheater.has(currentTheater)) byTheater.set(currentTheater, []);
    byTheater.get(currentTheater)!.push(entry);
  }

  return Array.from(byTheater.entries())
    .filter(([, classes]) => classes.length > 0)
    .map(([theater, classes]) => ({ theater, classes }));
}
