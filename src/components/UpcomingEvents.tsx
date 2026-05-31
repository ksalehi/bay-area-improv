"use client";

import { useState } from "react";
import { CalendarEvent, localDate, eventStartTime } from "@/lib/calendar";
import EventModal from "./EventModal";

export default function UpcomingEvents({ events }: { events: CalendarEvent[] }) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  if (events.length === 0) return null;

  return (
    <section className="pb-14">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#1c1917]">Upcoming shows</h2>
        <a href="/calendar" className="text-sm text-[#c05050] hover:underline">
          Full calendar →
        </a>
      </div>
      <div className="divide-y divide-[#e8e3de] rounded-xl border border-[#e8e3de] bg-white overflow-hidden">
        {events.map((event) => {
          const date = localDate(event);
          const time = eventStartTime(event);
          return (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="w-full flex items-start gap-5 px-5 py-4 hover:bg-[#fdf5f5] transition-colors group text-left"
            >
              <div className="shrink-0 w-12 text-center pt-0.5">
                <div className="text-xs font-medium text-[#c05050] uppercase tracking-wide">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </div>
                <div className="text-2xl font-semibold text-[#1c1917] leading-none">
                  {date.getDate()}
                </div>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-[#1c1917] group-hover:text-[#c05050] transition-colors leading-snug">
                  {event.summary}
                </p>
                <p className="text-sm text-[#6b6560] mt-0.5">
                  {[
                    date.toLocaleDateString("en-US", { weekday: "long" }),
                    time,
                    event.location,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
}
