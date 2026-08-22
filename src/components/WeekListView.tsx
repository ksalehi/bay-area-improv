"use client";

import { useState } from "react";
import { CalendarEvent, eventStartTime, buildEventMap } from "@/lib/calendar";
import EventModal from "./EventModal";

export default function WeekListView({ events }: { events: CalendarEvent[] }) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  if (events.length === 0) {
    return <p className="text-[#6b6560]">No shows scheduled this week.</p>;
  }

  const eventMap = buildEventMap(events);
  const dayKeys = Array.from(eventMap.keys()).sort();

  return (
    <div className="space-y-8">
      {dayKeys.map((dayKey) => {
        const dayEvents = eventMap.get(dayKey)!;
        const [y, m, d] = dayKey.split("-").map(Number);
        const date = new Date(y, m - 1, d);

        return (
          <div key={dayKey}>
            <h3 className="text-sm font-semibold text-[#1c1917] uppercase tracking-wide mb-3">
              {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h3>
            <div className="divide-y divide-[#e8e3de] rounded-xl border border-[#e8e3de] bg-white overflow-hidden">
              {dayEvents.map((event) => {
                const time = eventStartTime(event);
                return (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full px-5 py-3.5 hover:bg-[#fdf5f5] transition-colors group text-left"
                  >
                    <p className="font-medium text-[#1c1917] group-hover:text-[#c05050] transition-colors leading-snug">
                      {event.summary}
                    </p>
                    <p className="text-sm text-[#6b6560] mt-0.5">
                      {[time, event.location].filter(Boolean).join(" · ")}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
