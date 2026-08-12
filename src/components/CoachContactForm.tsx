"use client";

import { useState } from "react";

type Status = "idle" | "open" | "submitting" | "success" | "error";

export default function CoachContactForm({ coachName }: { coachName: string }) {
  const [status, setStatus] = useState<Status>("idle");

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
    return <p className="text-xs text-[#3d7a57] mt-2">Message sent — we&apos;ll pass it along!</p>;
  }

  if (status === "idle") {
    return (
      <button
        type="button"
        onClick={() => setStatus("open")}
        className="text-sm font-medium px-4 py-2 rounded-full bg-[#c05050] text-white hover:bg-[#a83e3e] transition-colors mt-2"
      >
        Contact
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 mt-2 max-w-[440px] bg-[#faf8f6] border border-[#e8e3de] rounded-lg p-3"
    >
      <input type="hidden" name="_subject" value={`Coaching inquiry: ${coachName}`} />
      <input type="hidden" name="coach" value={coachName} />

      <input
        name="fromEmail"
        type="email"
        required
        placeholder="Your email"
        className="px-3 py-2 rounded-md border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
      />
      <textarea
        name="message"
        required
        rows={3}
        placeholder={`Say hello to ${coachName}...`}
        className="px-3 py-2 rounded-md border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors resize-none"
      />

      {status === "error" && (
        <p className="text-xs text-[#c05050]">Something went wrong — try again?</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#c05050] text-white hover:bg-[#a83e3e] transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-xs font-medium px-3.5 py-1.5 rounded-full text-[#9c948e] hover:text-[#6b6560] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
