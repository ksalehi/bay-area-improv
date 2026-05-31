"use client";

import { useEffect } from "react";
import { CalendarEvent, localDate, eventStartTime, extractUrl, stripHtml } from "@/lib/calendar";

export default function EventModal({
  event,
  onClose,
}: {
  event: CalendarEvent | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!event) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [event, onClose]);

  if (!event) return null;

  const date = localDate(event);
  const time = eventStartTime(event);
  const url = extractUrl(event.description);
  const description = stripHtml(event.description, url);

  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-[#6b6560] hover:text-[#1c1917] transition-colors text-lg leading-none"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#1c1917] pr-8 mb-3 leading-snug">
          {event.summary}
        </h2>

        {/* Date & time */}
        <p className="text-sm text-[#6b6560] mb-1">
          {dateStr}{time && ` · ${time}`}
        </p>

        {/* Location */}
        {event.location && (
          <p className="text-sm text-[#6b6560] mb-4">{event.location}</p>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-[#44403c] whitespace-pre-line leading-relaxed mb-5">
            {description}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-1">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#c05050] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#a83e3e] transition-colors"
            >
              More info →
            </a>
          )}
          <a
            href={event.htmlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-sm font-medium border border-[#e8e3de] text-[#6b6560] hover:border-[#c05050] hover:text-[#c05050] transition-colors"
          >
            View in Google Calendar
          </a>
        </div>
      </div>
    </div>
  );
}
