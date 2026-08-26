"use client";

import { useEffect } from "react";

// Theater photos load without a reserved aspect ratio, so the page's layout
// shifts as they finish loading, and the browser's native jump-to-#hash
// (plus Next's own router scroll handling) can land or reset to the wrong
// spot before that settles. Re-asserting the scroll a few times over the
// first second reliably wins that race without waiting an arbitrary amount
// up front.
export default function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const scrollToTarget = () => {
      document.getElementById(hash)?.scrollIntoView({ block: "start", behavior: "instant" });
    };

    const timeouts = [100, 300, 600, 1000].map((delay) => setTimeout(scrollToTarget, delay));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return null;
}
