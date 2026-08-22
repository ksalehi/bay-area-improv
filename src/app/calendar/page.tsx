import Link from "next/link";
import { fetchEvents } from "@/lib/calendar";
import CalendarGrid from "@/components/CalendarGrid";
import WeekListView from "@/components/WeekListView";

function ViewToggle({ view }: { view: "month" | "list" }) {
  return (
    <div className="inline-flex rounded-lg border border-[#e8e3de] p-0.5 bg-[#f8f5f2]">
      <Link
        href="/calendar?view=month"
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          view === "month"
            ? "bg-white text-[#1c1917] shadow-sm"
            : "text-[#6b6560] hover:text-[#1c1917]"
        }`}
      >
        Month
      </Link>
      <Link
        href="/calendar?view=list"
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          view === "list"
            ? "bg-white text-[#1c1917] shadow-sm"
            : "text-[#6b6560] hover:text-[#1c1917]"
        }`}
      >
        List
      </Link>
    </div>
  );
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; view?: string }>;
}) {
  const { month: monthParam, view: viewParam } = await searchParams;
  const view = viewParam === "list" ? "list" : "month";

  const now = new Date();

  if (view === "list") {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const events = await fetchEvents(todayStart, weekEnd);

    return (
      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-[#1c1917]">
            Upcoming this week
          </h1>
          <ViewToggle view={view} />
        </div>
        <WeekListView events={events} />
      </main>
    );
  }

  let year = now.getFullYear();
  let month = now.getMonth() + 1; // 1–12

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split("-").map(Number);
    if (m >= 1 && m <= 12) {
      year = y;
      month = m;
    }
  }

  // Fetch only this month's events (timeMax is exclusive start of next month)
  const timeMin = new Date(year, month - 1, 1);
  const timeMax = new Date(year, month, 1);
  const events = await fetchEvents(timeMin, timeMax);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex justify-end mb-4">
        <ViewToggle view={view} />
      </div>
      <CalendarGrid year={year} month={month} events={events} />
    </main>
  );
}
