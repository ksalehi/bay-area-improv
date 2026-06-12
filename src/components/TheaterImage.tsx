"use client";

import { useState, useEffect, useRef } from "react";

export default function TheaterImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Catch images that already failed before React hydrated
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) return null;
  return (
    <div className={`w-32 ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="rounded-xl w-full h-auto"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
