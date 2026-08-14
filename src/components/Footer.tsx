import Link from "next/link";

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 6.5 12 13l8.5-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-[#e8e3de] bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#9c948e]">
        <p>{`© ${new Date().getFullYear()} Bay Area Improv`}</p>
        <div className="flex items-center gap-5">
          <Link href="/about" title="Get in touch" className="hover:text-[#c05050] transition-colors">
            <EnvelopeIcon className="w-5 h-5" />
          </Link>
          <a
            href="https://instagram.com/bayareaimprovcomedy"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="hover:text-[#c05050] transition-colors"
          >
            <InstagramIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
