import { fetchClasses } from "@/lib/classes";
import Link from "next/link";

export const metadata = { title: "Classes — Bay Area Improv" };
export const revalidate = 3600;

export default async function ClassesPage() {
  const groups = await fetchClasses(); // get data from spreadsheet

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-1">Classes</h1>
      <p className="text-[#6b6560] mb-12">
        A list of classes at a few theaters known for their teaching -- check out the{" "}
        <Link href="/theaters" className="text-[#c05050] font-medium hover:text-[#a83e3e] transition-colors">
          theaters page
        </Link>{" "}
        for more options!
      </p>

      <div className="divide-y divide-[#e8e3de]">
        {groups.map(({ theater, classes }) => (
          <section key={theater} className="py-10 first:pt-0 last:pb-0">
            <h2 className="text-lg font-semibold text-[#1c1917] tracking-tight mb-4">
              {theater}
            </h2>

            <div className="divide-y divide-[#e8e3de]">
              {classes.map((c) => (
                <div
                  key={c.name}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 py-2.5"
                >
                  {/* Name + drop-in tag */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[0.9375rem] font-medium text-[#1c1917] truncate">
                      {c.name}
                    </span>
                    {c.isDropIn && (
                      <span className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#eef4f0] text-[#3d7a57] border border-[#c2dece]">
                        Drop-in
                      </span>
                    )}
                    {c.isWorkshop && (
                      <span className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f1eefc] text-[#6b4fa3] border border-[#d9d0f0]">
                        Workshop
                      </span>
                    )}
                  </div>

                  {/* Format, price, register */}
                  <div className="flex items-center gap-4 shrink-0">
                    {c.format && (
                      <span className="text-[0.8125rem] text-[#6b6560] whitespace-nowrap tabular-nums">
                        {c.format}
                      </span>
                    )}
                    {c.price && (
                      <span className="text-[0.8125rem] font-medium text-[#44403c] whitespace-nowrap tabular-nums">
                        {c.price}
                      </span>
                    )}
                    {c.link && (
                      <a
                        href={c.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-[#e8e3de] text-[#6b6560] hover:border-[#c05050] hover:text-[#c05050] transition-colors whitespace-nowrap"
                      >
                        Register
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
