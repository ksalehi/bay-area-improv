import { fetchFestivals } from "@/lib/festivals";

export const metadata = { title: "Festivals — Bay Area Improv" };
export const revalidate = 3600;

export default async function FestivalsPage() {
  const festivals = await fetchFestivals();

  return (
    <main className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="max-w-[700px] mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Festivals</h1>
        <p className="text-[#6b6560] mb-12">
          Improv festivals happening around the Bay Area.
        </p>
      </div>

      <div className="max-w-[700px] mx-auto divide-y divide-[#e8e3de]">
        {festivals.map((festival) => (
          <div key={festival.name} className="py-6 first:pt-0 last:pb-0">
            <h2 className="text-base font-medium text-[#1c1917]">{festival.name}</h2>

            {(festival.date || festival.location) && (
              <p className="text-sm text-[#9c948e] mt-0.5">
                {[festival.date, festival.location].filter(Boolean).join(" · ")}
              </p>
            )}

            {festival.description && (
              <p className="text-sm text-[#44403c] leading-relaxed mt-2.5">
                {festival.description}
              </p>
            )}

            {(festival.websiteUrl || festival.instagramUrl) && (
              <div className="flex gap-4 mt-2.5">
                {festival.websiteUrl && (
                  <a
                    href={festival.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#4a7ec2] hover:opacity-75 transition-opacity"
                  >
                    Website
                  </a>
                )}
                {festival.instagramUrl && (
                  <a
                    href={festival.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#4a7ec2] hover:opacity-75 transition-opacity"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
