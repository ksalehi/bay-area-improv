import { fetchClasses } from "@/lib/classes";
import { Fragment } from "react";

export const metadata = { title: "Classes — Bay Area Improv" };

export default async function ClassesPage() {
  const groups = await fetchClasses();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-1">Classes</h1>
      <p className="text-[#6b6560] mb-12">
        Improv programs across the Bay Area, from drop-in sessions to full curriculum tracks.
      </p>

      <div className="divide-y divide-[#e8e3de]">
        {groups.map(({ theater, classes }) => (
          <section key={theater} className="py-10 first:pt-0 last:pb-0">
            <h2 className="text-lg font-semibold text-[#1c1917] tracking-tight mb-4">
              {theater}
            </h2>

            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-8">
              {classes.map((c, i) => {
                const borderClass = i < classes.length - 1 ? "border-b border-[#e8e3de]" : "";
                return (
                  <Fragment key={c.name}>
                    {/* Name + drop-in tag */}
                    <div className={`flex items-center gap-2 min-w-0 py-2.5 ${borderClass}`}>
                      <span className="text-[0.9375rem] font-medium text-[#1c1917] truncate">
                        {c.name}
                      </span>
                      {c.isDropIn && (
                        <span className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#eef4f0] text-[#3d7a57] border border-[#c2dece]">
                          Drop-in
                        </span>
                      )}
                    </div>

                    {/* Format */}
                    <div className={`flex items-center py-2.5 tabular-nums ${borderClass}`}>
                      {c.format && (
                        <span className="text-[0.8125rem] text-[#6b6560] whitespace-nowrap">
                          {c.format}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className={`flex items-center py-2.5 tabular-nums ${borderClass}`}>
                      {c.price && (
                        <span className="text-[0.8125rem] font-medium text-[#44403c] whitespace-nowrap">
                          {c.price}
                        </span>
                      )}
                    </div>

                    {/* Register link */}
                    <div className={`flex items-center py-2.5 ${borderClass}`}>
                      {c.link ? (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-[#e8e3de] text-[#6b6560] hover:border-[#c05050] hover:text-[#c05050] transition-colors whitespace-nowrap"
                        >
                          Register
                        </a>
                      ) : (
                        <span className="w-[72px]" />
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
