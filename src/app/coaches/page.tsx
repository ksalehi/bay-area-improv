import { fetchCoaches } from "@/lib/coaches";
import CoachSubmissionForm from "@/components/CoachSubmissionForm";
import CoachContactForm from "@/components/CoachContactForm";
import TheaterImage from "@/components/TheaterImage";

export const metadata = { title: "Coaches — Bay Area Improv" };

export default async function CoachesPage() {
  const coaches = await fetchCoaches();

  return (
    <main className="flex-1 flex flex-col mx-auto max-w-5xl w-full px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Coaches</h1>
        <p className="text-[#6b6560] mb-12">
          More information available soon as folks fill out the form below!
        </p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-[#e8e3de]">
        {coaches.map((coach) => (
          <div key={coach.name} className="flex gap-4 py-6 first:pt-0 last:pb-0">
            {coach.photoUrl && (
              <TheaterImage src={coach.photoUrl} alt={coach.name} width="w-[180px]" className="shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-medium text-[#1c1917]">{coach.name}</h2>
                {coach.pronouns && (
                  <span className="text-sm text-[#9c948e]">{coach.pronouns}</span>
                )}
                {coach.years && (
                  <span className="text-sm text-[#9c948e]">
                    {coach.pronouns && "· "}
                    {coach.years}
                  </span>
                )}
                {coach.available && (
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eef4f0] text-[#3d7a57] border border-[#c2dece]">
                    Available
                  </span>
                )}
              </div>

              {(coach.specialties.length > 0 || coach.identifiers.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {coach.specialties.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fdf1dc] text-[#a15c1f] border border-[#f0d9b5]"
                    >
                      {tag}
                    </span>
                  ))}
                  {coach.identifiers.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-[#f1eefc] text-[#6b4fa3] border border-[#d9d0f0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {coach.bio && (
                <p className="text-sm text-[#44403c] leading-relaxed mt-2.5 max-w-xl">{coach.bio}</p>
              )}

              <CoachContactForm coachName={coach.name} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center mt-20 py-16 w-screen ml-[50%] -translate-x-1/2 bg-white">
        <div className="max-w-xl mx-auto px-6 w-full">
          <h2 className="text-xl font-semibold text-[#1c1917] tracking-tight mb-1">
            Want to be listed as a coach?
          </h2>
          <p className="text-[#6b6560] mb-6">Let us know!</p>
          <CoachSubmissionForm />
        </div>
      </div>
    </main>
  );
}
