import Image from "next/image";
import { fetchEvents, localDate, eventStartTime } from "@/lib/calendar";

const SECTIONS = [
  {
    title: "Theaters",
    description: "Venue options where you can host shows and see performances.",
    href: "/theaters",
    image: "/bai_theaters.jpg",
  },
  {
    title: "Classes",
    description: "A database of classes available at different organizations.",
    href: "/classes",
    image: "/bai_classes.jpg",
  },
  {
    title: "Shows",
    description: "A calendar of upcoming indie and house shows.",
    href: "/calendar",
    image: "/bai_shows.jpg",
  },
  {
    title: "Jams",
    description: "Events where improvisers of all skill levels play together on stage.",
    href: "/jams",
    image: "/bai_jams.jpg",
  },
  {
    title: "Teams",
    description: "A list of improv teams in the Bay Area.",
    href: "/teams",
    image: "/bai_teams.jpg",
  },
  {
    title: "Teachers & Coaches",
    description: "Browse availability and background of improv coaches and teachers.",
    href: "/coaches",
    image: "/bai_coaches.jpg",
  },
];

export default async function HomePage() {
  const now = new Date();
  const thirtyDaysOut = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcoming = (await fetchEvents(now, thirtyDaysOut)).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[68vh] min-h-[440px] w-full overflow-hidden">
        <Image
          src="/bai_hero.png"
          alt="Bay Area improv performers on stage"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-3 drop-shadow">
            Bay Area Improv
          </h1>
          <p className="text-base sm:text-lg text-white/75 mb-8 max-w-md">
            A community hub for everything from taking your first class to producing a show.
          </p>
          <a
            href="/calendar"
            className="bg-[#c05050] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#a83e3e] transition-colors"
          >
            View calendar →
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6">
        {/* Section cards */}
        <section className="py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTIONS.map((section) => (
              <a
                key={section.title}
                href={section.href}
                className="group rounded-xl border border-[#e8e3de] bg-white overflow-hidden hover:border-[#c05050] hover:shadow-sm transition-all"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="px-4 py-3">
                  <h2 className="font-semibold text-[#1c1917] group-hover:text-[#c05050] transition-colors mb-1">
                    {section.title}
                  </h2>
                  <p className="text-sm text-[#6b6560] leading-snug">{section.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Upcoming shows */}
        {upcoming.length > 0 && (
          <section className="pb-14">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#1c1917]">Upcoming shows</h2>
              <a href="/calendar" className="text-sm text-[#c05050] hover:underline">
                Full calendar →
              </a>
            </div>
            <div className="divide-y divide-[#e8e3de] rounded-xl border border-[#e8e3de] bg-white overflow-hidden">
              {upcoming.map((event) => {
                const date = localDate(event);
                const time = eventStartTime(event);
                return (
                  <a
                    key={event.id}
                    href={event.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-5 px-5 py-4 hover:bg-[#fdf5f5] transition-colors group"
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
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
