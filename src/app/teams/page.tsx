import { fetchTeams } from "@/lib/teams";
import TeamSubmissionForm from "@/components/TeamSubmissionForm";

export const metadata = { title: "Teams — Bay Area Improv" };

function InstagramIcon({ gradientId, className }: { gradientId: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill={`url(#${gradientId})`} />
      <circle cx="12" cy="12" r="5.2" stroke="white" strokeWidth="1.8" fill="none" />
      <circle cx="18" cy="6" r="1.3" fill="white" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  const notePath =
    "M15.5 3h3.2a5 5 0 0 0 4.3 4.9V11a8.2 8.2 0 0 1-4.3-1.2v7.1a6.4 6.4 0 1 1-6.4-6.4c.2 0 .5 0 .7.05v3.3a3.1 3.1 0 1 0 2.2 3V3z";
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={notePath} fill="#25F4EE" transform="translate(-0.6, 0.3)" />
      <path d={notePath} fill="#FE2C55" transform="translate(0.6, -0.3)" />
      <path d={notePath} fill="#1c1917" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="#1877F2" />
      <path
        d="M15 8.5h-1.7c-.4 0-.8.4-.8 1V11H15l-.3 2.2h-2.2V19h-2.3v-5.8H8.5V11h1.7V9.2c0-1.6 1.2-3 2.7-3H15v2.3Z"
        fill="white"
      />
    </svg>
  );
}

function WebsiteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} role="img" aria-label="Website">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TicketIcon({ maskId, className }: { maskId: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="Tickets">
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle cx="1.5" cy="12" r="2" fill="black" />
          <circle cx="22.5" cy="12" r="2" fill="black" />
        </mask>
      </defs>
      <g transform="rotate(-45 12 12)">
        <rect x="1.5" y="6.5" width="21" height="11" fill="#e62031" mask={`url(#${maskId})`} />
        <line
          x1="8.2"
          y1="6.5"
          x2="8.2"
          y2="17.5"
          stroke="white"
          strokeWidth="1.6"
          strokeDasharray="2 2"
        />
      </g>
    </svg>
  );
}

export default async function TeamsPage() {
  const teams = await fetchTeams();

  return (
    <>
      <main className="mx-auto max-w-5xl px-6 pt-12">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-semibold tracking-tight mb-1">Teams</h1>
          <p className="text-[#6b6560] mb-12">
            A non-exhaustive list of Bay Area teams — more functionality coming soon!
          </p>
        </div>

        <div className="max-w-xl mx-auto divide-y divide-[#e8e3de]">
          {teams.map((team, i) => (
            <div
              key={team.name}
              className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <h2 className="text-[0.9375rem] font-medium text-[#1c1917] truncate">
                  {team.name}
                </h2>
                {team.contactPerson && (
                  <p className="text-xs text-[#9c948e]">{team.contactPerson}</p>
                )}
              </div>

              {(team.instagramUrl ||
                team.tiktokUrl ||
                team.facebookUrl ||
                team.websiteUrl ||
                team.ticketsUrl) && (
                <div className="flex items-center gap-2.5 shrink-0">
                  {team.ticketsUrl && (
                    <a
                      href={team.ticketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Tickets"
                      className="hover:opacity-75 transition-opacity"
                    >
                      <TicketIcon maskId={`ticket-mask-${i}`} className="w-[18px] h-[18px]" />
                    </a>
                  )}
                  {team.websiteUrl && (
                    <a
                      href={team.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Website"
                      className="text-[#4a7ec2] hover:opacity-75 transition-opacity"
                    >
                      <WebsiteIcon className="w-[18px] h-[18px]" />
                    </a>
                  )}
                  {team.facebookUrl && (
                    <a href={team.facebookUrl} target="_blank" rel="noopener noreferrer">
                      <FacebookIcon className="w-[18px] h-[18px]" />
                    </a>
                  )}
                  {team.tiktokUrl && (
                    <a href={team.tiktokUrl} target="_blank" rel="noopener noreferrer">
                      <TikTokIcon className="w-[18px] h-[18px]" />
                    </a>
                  )}
                  {team.instagramUrl && (
                    <a href={team.instagramUrl} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon
                        gradientId={`ig-gradient-${team.instagramHandle}`}
                        className="w-[18px] h-[18px]"
                      />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <div className="mt-20 py-16 bg-white">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-xl font-semibold text-[#1c1917] tracking-tight mb-1">
            Want to list your team here or add more info?
          </h2>
          <p className="text-[#6b6560] mb-6">Let us know!</p>
          <TeamSubmissionForm />
        </div>
      </div>
    </>
  );
}
