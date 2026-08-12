"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Theaters", href: "/theaters" },
  { label: "Classes", href: "/classes" },
  { label: "Teams", href: "/teams" },
  { label: "Coaches", href: "/coaches" },
  { label: "Calendar", href: "/calendar" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-[#e8e3de] bg-white">
      <div className="mx-auto max-w-4xl px-6 py-2 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 text-lg text-[#1c1917] font-semibold tracking-tight hover:text-[#c05050] transition-colors shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bai_logo.png" alt="" className="w-20 h-20 rounded-full" />
          Bay Area Improv
        </Link>

        <nav className="hidden sm:flex flex-wrap gap-x-5 gap-y-1 text-base text-[#6b6560] justify-end">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className="hover:text-[#c05050] transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          className="sm:hidden text-[#1c1917] p-2 -mr-2"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="sm:hidden border-t border-[#e8e3de] px-6 py-4 flex flex-col gap-3 text-base text-[#6b6560]">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="hover:text-[#c05050] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
