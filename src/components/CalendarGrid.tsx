"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarEvent, localDate, eventStartTime, toDayKey, getCalendarDays, buildEventMap } from "@/lib/calendar";
import EventModal from "./EventModal";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toMonthParam(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(year, month - 1 + delta, 1);
  return toMonthParam(d.getFullYear(), d.getMonth() + 1);
}


export default function CalendarGrid({
  year,
  month,
  events,
}: {
  year: number;
  month: number;
  events: CalendarEvent[];
}) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const days = getCalendarDays(year, month);
  const eventMap = buildEventMap(events);
  const todayKey = toDayKey(new Date());

  return (
    <>
      <div>
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <Link
            href={`/calendar?month=${shiftMonth(year, month, -1)}`}
            className="text-sm text-[#6b6560] hover:text-[#c05050] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#fdf5f5]"
          >
            ←
          </Link>
          <h2 className="text-xl font-semibold tracking-tight text-[#1c1917]">
            {MONTH_NAMES[month - 1]} {year}
          </h2>
          <Link
            href={`/calendar?month=${shiftMonth(year, month, 1)}`}
            className="text-sm text-[#6b6560] hover:text-[#c05050] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#fdf5f5]"
          >
            →
          </Link>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-px">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium text-[#6b6560] uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 border-l border-t border-[#e8e3de] rounded-xl overflow-hidden shadow-sm">
          {days.map((day, i) => {
            const isCurrentMonth = day.getMonth() === month - 1;
            const key = toDayKey(day);
            const isToday = key === todayKey;
            const dayEvents = eventMap.get(key) ?? [];

            return (
              <div
                key={i}
                className={`border-r border-b border-[#e8e3de] min-h-28 p-1.5 ${
                  isCurrentMonth ? "bg-white" : "bg-[#f8f5f2]"
                }`}
              >
                {/* Day number */}
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 ${
                    isToday
                      ? "bg-[#c05050] text-white"
                      : isCurrentMonth
                      ? "text-[#1c1917]"
                      : "text-[#cac6c2]"
                  }`}
                >
                  {day.getDate()}
                </div>

                {/* Events */}
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map((event) => {
                    const time = eventStartTime(event);
                    return (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        title={event.summary}
                        className="w-full flex items-baseline gap-1 text-xs leading-tight bg-[#fdf0f0] text-[#c05050] rounded px-1.5 py-0.5 hover:bg-[#f5d8d8] transition-colors overflow-hidden text-left"
                      >
                        {time && (
                          <span className="shrink-0 font-medium opacity-75">{time}</span>
                        )}
                        <span className="truncate font-medium">{event.summary}</span>
                      </button>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <p className="text-xs text-[#6b6560] px-1.5">+{dayEvents.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}
