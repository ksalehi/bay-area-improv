"use client";

import { useState } from "react";

export default function TheaterImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="rounded-xl max-w-full max-h-32"
      onError={() => setFailed(true)}
    />
  );
}
