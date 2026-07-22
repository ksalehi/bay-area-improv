"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
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
    return (
      <p className="text-sm text-[#3d7a57] bg-[#eef4f0] border border-[#c2dece] rounded-xl px-5 py-4">
        Thanks for reaching out — we'll get back to you soon!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="name" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
            placeholder="Your name"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="email" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium text-[#6b6560] uppercase tracking-wider">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="px-3.5 py-2.5 rounded-lg border border-[#e8e3de] bg-white text-[#1c1917] text-sm placeholder:text-[#b8b0a8] focus:outline-none focus:border-[#c05050] transition-colors resize-none"
          placeholder="Ideas, feedback, questions..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-[#c05050]">
          Something went wrong — please try again or email us directly.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="text-sm font-medium px-5 py-2.5 rounded-full bg-[#c05050] text-white hover:bg-[#a83e3e] transition-colors disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
