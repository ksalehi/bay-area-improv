"use client";

import { useEffect } from "react";

export default function CoachesError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-1">Coaches</h1>
      <p className="text-[#6b6560]">
        Couldn&apos;t load coaches right now — please check back in a bit.
      </p>
    </main>
  );
}
