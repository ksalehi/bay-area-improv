import { fetchTheaters, mapsUrl } from "@/lib/theaters";
import TheaterImage from "@/components/TheaterImage";

export const metadata = { title: "Theaters — Bay Area Improv" };

export default async function TheatersPage() {
  const theaters = await fetchTheaters();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-1">Theaters</h1>
      <p className="text-[#6b6560] mb-12">
        Venues where you can take classes, host shows, and see performances across the Bay Area.
      </p>

      <div className="divide-y divide-[#e8e3de]">
        {theaters.map((theater) => (
            <div
              key={theater.name}
              className="flex flex-col sm:flex-row gap-8 py-12 first:pt-0 last:pb-0"
            >
              {/* Image */}
              {theater.imageUrl && (
                <TheaterImage
                  src={theater.imageUrl}
                  alt={theater.name}
                  className="shrink-0"
                />
              )}

              {/* Text */}
              <div className="flex flex-col justify-center flex-1">
                <h2 className="text-xl font-semibold text-[#1c1917] mb-3 leading-snug">
                  {theater.name}
                </h2>
                {theater.blurb && (
                  <p className="text-sm text-[#44403c] leading-relaxed mb-5">
                    {theater.blurb}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {theater.websiteUrl && (
                    <a
                      href={theater.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full bg-[#c05050] text-white hover:bg-[#a83e3e] transition-colors font-medium"
                    >
                      Website
                    </a>
                  )}
                  {theater.yelpUrl && (
                    <a
                      href={theater.yelpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full border border-[#e8e3de] text-[#6b6560] hover:border-[#c05050] hover:text-[#c05050] transition-colors font-medium"
                    >
                      Yelp
                    </a>
                  )}
                  {theater.mapsQuery && (
                    <a
                      href={mapsUrl(theater.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full border border-[#e8e3de] text-[#6b6560] hover:border-[#c05050] hover:text-[#c05050] transition-colors font-medium"
                    >
                      Map
                    </a>
                  )}
                </div>
              </div>
            </div>
        ))}
      </div>
    </main>
  );
}
