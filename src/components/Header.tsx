const NAV_LINKS = [
  { label: "Theaters", href: "/theaters" },
  { label: "Classes", href: "/classes" },
  { label: "Calendar", href: "/calendar" },
  { label: "Jams", href: "/jams" },
  { label: "Teams", href: "/teams" },
  { label: "About", href: "/about" },
];

export default function Header() {
  return (
    <header className="border-b border-[#e8e3de] bg-white">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between gap-6">
        <a href="/" className="text-[#1c1917] font-semibold tracking-tight hover:text-[#c05050] transition-colors shrink-0">
          Bay Area Improv
        </a>
        <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#6b6560] justify-end">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="hover:text-[#c05050] transition-colors">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
