"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SITE_EMAIL } from "@/data/site";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 bg-surface text-ink">
      <span className="eyebrow mb-6">Something broke</span>
      <h1 className="text-fluid-h2 font-bold uppercase leading-none tracking-tight max-w-4xl">
        That didn&apos;t load as planned.
      </h1>
      <p className="mt-8 max-w-xl text-fluid-body text-muted">
        Try again, or reach us directly at{" "}
        <a href={`mailto:${SITE_EMAIL}`} className="text-ink underline underline-offset-4 hover:text-accent">
          {SITE_EMAIL}
        </a>
        .
      </p>
      <div className="mt-12 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wider text-surface transition-colors hover:bg-accent"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-line/30 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors hover:border-ink"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
