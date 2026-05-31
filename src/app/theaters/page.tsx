import { fetchTheaters, mapsUrl } from "@/lib/theaters";

export const metadata = { title: "Theaters — Bay Area Improv" };

export default async function TheatersPage() {
  const theaters = await fetchTheaters();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-1">Theaters</h1>
      <p className="text-[#6b6560] mb-10">
        Venues where you can take classes, host shows, and see performances across the Bay Area.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {theaters.map((theater) => (
          <div
            key={theater.name}
            className="rounded-xl border border-[#e8e3de] bg-white overflow-hidden flex flex-col"
          >
            {/* Image */}
            {theater.imageUrl ? (
              <div className="h-44 overflow-hidden bg-[#f0ebe4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={theater.imageUrl}
                  alt={theater.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-44 bg-[#f0ebe4] flex items-center justify-center">
                <span className="text-4xl font-semibold text-[#c8bfb8]">
                  {theater.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
              <h2 className="font-semibold text-[#1c1917] text-lg mb-2 leading-snug">
                {theater.name}
              </h2>
              {theater.blurb && (
                <p className="text-sm text-[#44403c] leading-relaxed mb-4 line-clamp-4">
                  {theater.blurb}
                </p>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-2 mt-auto">
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
