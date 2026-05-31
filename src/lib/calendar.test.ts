import { describe, it, expect } from "vitest";
import {
  extractUrl,
  stripHtml,
  localDate,
  eventStartTime,
  toDayKey,
  getCalendarDays,
  buildEventMap,
} from "./calendar";
import type { CalendarEvent } from "./calendar";

// ─── helpers ────────────────────────────────────────────────────────────────

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: "test-id",
    summary: "Test Event",
    htmlLink: "https://calendar.google.com/event",
    start: { dateTime: "2026-06-15T19:00:00-07:00" },
    end: { dateTime: "2026-06-15T21:00:00-07:00" },
    ...overrides,
  };
}

// ─── extractUrl ─────────────────────────────────────────────────────────────

describe("extractUrl", () => {
  it("returns null for undefined", () => {
    expect(extractUrl(undefined)).toBeNull();
  });

  it("returns null when no URL present", () => {
    expect(extractUrl("No link here")).toBeNull();
  });

  it("extracts a plain URL", () => {
    expect(extractUrl("More info at https://example.com")).toBe("https://example.com");
  });

  it("extracts a URL embedded in an HTML anchor", () => {
    expect(extractUrl('<a href="https://example.com">https://example.com</a>')).toBe(
      "https://example.com"
    );
  });

  it("strips trailing period", () => {
    expect(extractUrl("See https://example.com.")).toBe("https://example.com");
  });

  it("strips trailing comma and closing paren", () => {
    expect(extractUrl("(https://example.com),")).toBe("https://example.com");
  });

  it("preserves URL query params", () => {
    expect(extractUrl("https://example.com/page?foo=bar&baz=1")).toBe(
      "https://example.com/page?foo=bar&baz=1"
    );
  });

  it("returns the first URL when multiple are present", () => {
    expect(extractUrl("https://first.com and https://second.com")).toBe("https://first.com");
  });

  it("works with http URLs", () => {
    expect(extractUrl("http://instagram.com/theboatjam")).toBe(
      "http://instagram.com/theboatjam"
    );
  });
});

// ─── stripHtml ──────────────────────────────────────────────────────────────

describe("stripHtml", () => {
  it("returns empty string for undefined", () => {
    expect(stripHtml(undefined)).toBe("");
  });

  it("strips basic HTML tags", () => {
    expect(stripHtml("<b>hello</b>")).toBe("hello");
  });

  it("converts <br> to newline", () => {
    expect(stripHtml("line one<br>line two")).toBe("line one\nline two");
  });

  it("converts </p> to newline", () => {
    expect(stripHtml("<p>first</p><p>second</p>")).toBe("first\nsecond");
  });

  it("decodes common HTML entities", () => {
    expect(stripHtml("&amp;")).toBe("&");
    expect(stripHtml("&lt;&gt;")).toBe("<>");
    expect(stripHtml("&quot;")).toBe('"');
    expect(stripHtml("&#39;")).toBe("'");
    expect(stripHtml("hello&nbsp;world")).toBe("hello world");
  });

  it("collapses more than two consecutive newlines", () => {
    expect(stripHtml("a<br><br><br><br>b")).toBe("a\n\nb");
  });

  it("removes the provided URL from the text", () => {
    const url = "https://example.com";
    expect(stripHtml("Join us at https://example.com for the show.", url)).toBe(
      "Join us at  for the show."
    );
  });

  it("handles a realistic Google Calendar description", () => {
    const html =
      '<a href="http://instagram.com/theboatjam">http://instagram.com/theboatjam</a>' +
      "<br><br>Improv jam for new and seasoned improvisers alike.";
    const url = "http://instagram.com/theboatjam";
    expect(stripHtml(html, url)).toBe("Improv jam for new and seasoned improvisers alike.");
  });
});

// ─── localDate ──────────────────────────────────────────────────────────────

describe("localDate", () => {
  it("returns a Date from a dateTime event", () => {
    const event = makeEvent({ start: { dateTime: "2026-06-15T19:00:00-07:00" } });
    const d = localDate(event);
    expect(d).toBeInstanceOf(Date);
    expect(d.getTime()).toBe(new Date("2026-06-15T19:00:00-07:00").getTime());
  });

  it("returns a local-midnight Date from an all-day event without timezone shift", () => {
    const event = makeEvent({ start: { date: "2026-06-15" } });
    const d = localDate(event);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5); // June = 5
    expect(d.getDate()).toBe(15);
  });
});

// ─── eventStartTime ─────────────────────────────────────────────────────────

describe("eventStartTime", () => {
  it("returns null for an all-day event", () => {
    expect(eventStartTime(makeEvent({ start: { date: "2026-06-15" } }))).toBeNull();
  });

  it("formats an on-the-hour time without :00", () => {
    const result = eventStartTime(
      makeEvent({ start: { dateTime: "2026-06-15T20:00:00-07:00" } })
    );
    expect(result).toBe("8pm");
  });

  it("formats a half-hour time with minutes", () => {
    const result = eventStartTime(
      makeEvent({ start: { dateTime: "2026-06-15T19:30:00-07:00" } })
    );
    expect(result).toBe("7:30pm");
  });
});

// ─── toDayKey ───────────────────────────────────────────────────────────────

describe("toDayKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(toDayKey(new Date(2026, 5, 15))).toBe("2026-06-15");
  });

  it("zero-pads single-digit month and day", () => {
    expect(toDayKey(new Date(2026, 0, 4))).toBe("2026-01-04");
  });
});

// ─── getCalendarDays ────────────────────────────────────────────────────────

describe("getCalendarDays", () => {
  it("always returns a multiple of 7", () => {
    for (let month = 1; month <= 12; month++) {
      const days = getCalendarDays(2026, month);
      expect(days.length % 7).toBe(0);
    }
  });

  it("includes all days of the target month", () => {
    const days = getCalendarDays(2026, 6); // June 2026
    const juneDays = days.filter((d) => d.getMonth() === 5);
    expect(juneDays.length).toBe(30);
  });

  it("starts on Sunday", () => {
    const days = getCalendarDays(2026, 6);
    expect(days[0].getDay()).toBe(0);
  });

  it("ends on Saturday", () => {
    const days = getCalendarDays(2026, 6);
    expect(days[days.length - 1].getDay()).toBe(6);
  });

  it("has no leading padding when month starts on Sunday", () => {
    // March 2026 starts on a Sunday
    const days = getCalendarDays(2026, 3);
    expect(days[0]).toEqual(new Date(2026, 2, 1));
  });

  it("handles February in a leap year", () => {
    const days = getCalendarDays(2028, 2);
    const febDays = days.filter((d) => d.getMonth() === 1);
    expect(febDays.length).toBe(29);
  });
});

// ─── buildEventMap ──────────────────────────────────────────────────────────

describe("buildEventMap", () => {
  it("maps a timed event to its start day", () => {
    const event = makeEvent({ start: { dateTime: "2026-06-15T19:00:00-07:00" } });
    const map = buildEventMap([event]);
    expect(map.get("2026-06-15")).toContain(event);
  });

  it("maps an all-day event to its day", () => {
    const event = makeEvent({
      start: { date: "2026-06-15" },
      end: { date: "2026-06-16" },
    });
    const map = buildEventMap([event]);
    expect(map.get("2026-06-15")).toContain(event);
  });

  it("spreads a multi-day all-day event across each day", () => {
    const event = makeEvent({
      start: { date: "2026-06-10" },
      end: { date: "2026-06-13" }, // exclusive — covers 10, 11, 12
    });
    const map = buildEventMap([event]);
    expect(map.get("2026-06-10")).toContain(event);
    expect(map.get("2026-06-11")).toContain(event);
    expect(map.get("2026-06-12")).toContain(event);
    expect(map.get("2026-06-13")).toBeUndefined();
  });

  it("groups multiple events on the same day", () => {
    const a = makeEvent({ id: "a", start: { dateTime: "2026-06-15T18:00:00-07:00" } });
    const b = makeEvent({ id: "b", start: { dateTime: "2026-06-15T20:00:00-07:00" } });
    const map = buildEventMap([a, b]);
    expect(map.get("2026-06-15")).toHaveLength(2);
  });
});
