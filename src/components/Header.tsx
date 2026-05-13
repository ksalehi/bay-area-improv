export default function Header() {
  return (
    <header className="border-b border-[#e8e3de] bg-white">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-[#1c1917] font-semibold tracking-tight hover:text-[#c05050] transition-colors">
          Bay Area Improv
        </a>
        <nav className="flex gap-6 text-sm text-[#6b6560]">
          <a href="/" className="hover:text-[#c05050] transition-colors font-medium text-[#c05050]">
            Calendar
          </a>
        </nav>
      </div>
    </header>
  );
}
