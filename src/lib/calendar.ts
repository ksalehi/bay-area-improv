export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
  htmlLink: string;
}

export async function fetchEvents(timeMin: Date, timeMax: Date): Promise<CalendarEvent[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!calendarId || !apiKey) return [];

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("timeMin", timeMin.toISOString());
  url.searchParams.set("timeMax", timeMax.toISOString());
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("maxResults", "250");

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data = await res.json();
  return data.items ?? [];
}

export function localDate(event: CalendarEvent): Date {
  if (event.start.dateTime) return new Date(event.start.dateTime);
  const [y, m, d] = (event.start.date ?? "").split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function extractUrl(html: string | undefined): string | null {
  if (!html) return null;
  const match = html.match(/https?:\/\/[^\s<>"']+/);
  if (!match) return null;
  return match[0].replace(/[.,;:!?)\]]+$/, ""); // strip trailing punctuation
}

export function stripHtml(html: string | undefined, removeUrl?: string | null): string {
  if (!html) return "";
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  if (removeUrl) text = text.replace(removeUrl, "");
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

export function eventStartTime(event: CalendarEvent): string | null {
  if (!event.start.dateTime) return null;
  return new Date(event.start.dateTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase().replace(":00", "");
}
