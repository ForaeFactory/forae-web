// Shown briefly while a case study's payload streams in on client navigation.
export default function Loading() {
  return (
    <div role="status" aria-label="Loading case study" className="min-h-screen flex items-center justify-center bg-surface">
      <span aria-hidden className="h-1 w-24 overflow-hidden rounded-full bg-line/10">
        <span className="block h-full w-1/2 animate-pulse rounded-full bg-accent" />
      </span>
    </div>
  );
}
