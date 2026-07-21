"use client";

import { useEffect } from "react";

export default function PwaInstaller() {
  useEffect(() => {
    if (
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // The app still works online if service-worker registration is unavailable.
    });
  }, []);

  return null;
}
