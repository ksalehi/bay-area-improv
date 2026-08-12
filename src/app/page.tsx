import Image from "next/image";
import Link from "next/link";
import { fetchEvents } from "@/lib/calendar";
import UpcomingEvents from "@/components/UpcomingEvents";

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
    imagePosition: "object-top",
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
    imagePosition: "object-top",
  },
  {
    title: "Teams",
    description: "A list of improv teams in the Bay Area.",
    href: "/teams",
    image: "/bai_teams.jpg",
    imagePosition: "object-[center_25%]",
  },
  {
    title: "Coaches",
    description: "Browse availability and background of improv coaches.",
    href: "/coaches",
    image: "/bai_coaches.jpg",
    imagePosition: "object-top",
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
            See a show. Take a class. Find your stage.
          </h1>
          <p className="text-base sm:text-lg text-white/75 mb-8 max-w-md">
            Your guide to the Bay Area&apos;s improv scene, from finding tonight&apos;s show to producing your own.
          </p>
          <a
            href="/calendar"
            className="bg-[#c05050] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#a83e3e] transition-colors"
          >
            View shows →
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        {/* Section cards */}
        <section className="py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTIONS.map((section) => (
              <a
                key={section.title}
                href={section.href}
                className="group rounded-xl border border-[#e8e3de] bg-white overflow-hidden hover:border-[#c05050] hover:shadow-sm transition-all"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${section.imagePosition ?? "object-center"}`}
                  />
                </div>
                <div className="px-4 py-3">
                  <h2 className="text-lg font-semibold text-[#1c1917] group-hover:text-[#c05050] transition-colors mb-1">
                    {section.title}
                  </h2>
                  <p className="text-sm text-[#6b6560] leading-snug">{section.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <UpcomingEvents events={upcoming} />

        <section className="py-14 text-center">
          <p className="text-[#6b6560]">
            Stay tuned for more features as we build out this site! Please{" "}
            <Link href="/about" className="text-[#c05050] font-medium hover:text-[#a83e3e] transition-colors">
              reach out
            </Link>{" "}
            if you want to get involved.
          </p>
        </section>
      </div>
    </div>
  );
}
