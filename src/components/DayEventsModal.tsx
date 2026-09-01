"use client";

import { useEffect } from "react";
import { CalendarEvent, eventStartTime } from "@/lib/calendar";

export default function DayEventsModal({
  date,
  events,
  onClose,
  onSelectEvent,
}: {
  date: Date | null;
  events: CalendarEvent[];
  onClose: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
}) {
  useEffect(() => {
    if (!date) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [date, onClose]);

  if (!date) return null;

  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
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
        <h2 className="text-xl font-semibold text-[#1c1917] pr-8 mb-4 leading-snug">
          {dateStr}
        </h2>

        {/* Events */}
        <div className="divide-y divide-[#e8e3de] rounded-xl border border-[#e8e3de] overflow-hidden">
          {events.map((event) => {
            const time = eventStartTime(event);
            return (
              <button
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="w-full px-4 py-3 hover:bg-[#fdf5f5] transition-colors text-left"
              >
                <p className="font-medium text-[#1c1917] leading-snug">{event.summary}</p>
                <p className="text-sm text-[#6b6560] mt-0.5">
                  {[time, event.location].filter(Boolean).join(" · ")}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
