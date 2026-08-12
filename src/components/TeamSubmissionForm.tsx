"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function TeamSubmissionForm() {
  const [status, setStatus] = useState<Status>("idle");

  function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
      e.preventDefault();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    try {
      const res = await fetch("https://formspree.io/f/mnjezyrz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-[#3d7a57] bg-[#eef4f0] border border-[#c2dece] rounded-xl px-5 py-4">
        Thanks! We&apos;ll take a look and add your team soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col gap-4">
      <input type="hidden" name="_subject" value="New team submission" />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="teamName" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
          Team name (required)
        </label>
        <input
          id="teamName"
          name="teamName"
          type="text"
          required
          className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
          placeholder="The Improvised Shakespeare Company"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="website" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
          Website
        </label>
        <input
          id="website"
          name="website"
          type="text"
          className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
          placeholder="www.improvisedshakespeare.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="socials" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
          Socials
        </label>
        <input
          id="socials"
          name="socials"
          type="text"
          className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
          placeholder="Instagram, TikTok, Facebook (links or handles)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors resize-none"
          placeholder="1-2 sentences about yourselves"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tags" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
          placeholder="Narrative, All Women, Musical Improv, etc."
        />
      </div>

      <div className="pt-2 border-t border-[#e8e3de]">
        <p className="text-xs text-[#9c948e] mb-3">
          Just for us to follow up — never published on the site.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label htmlFor="contactName" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
              Your name
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
              placeholder="William Shakespeare"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label htmlFor="contactEmail" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
              Your email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
              placeholder="willieshakes@example.com"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-4">
          <label htmlFor="other" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
            Anything else we should know?
          </label>
          <input
            id="other"
            name="other"
            type="text"
            className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-[#c05050]">
          Something went wrong — please try again or email us directly.
        </p>
      )}

      <div className="flex justify-center mt-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="text-sm font-medium px-5 py-2.5 rounded-full bg-[#c05050] text-white hover:bg-[#a83e3e] transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
