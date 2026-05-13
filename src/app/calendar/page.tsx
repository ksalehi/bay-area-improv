import { fetchEvents } from "@/lib/calendar";
import CalendarGrid from "@/components/CalendarGrid";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;

  const now = new Date();
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
      <CalendarGrid year={year} month={month} events={events} />
    </main>
  );
}
