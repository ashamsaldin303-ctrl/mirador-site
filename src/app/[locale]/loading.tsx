// MIRADOR — route-level loading surface (brand skeleton rows, §6.6 state matrix).
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-32 sm:px-6" aria-busy="true" aria-live="polite">
      <div className="h-3 w-24 animate-pulse rounded-sm bg-surface" />
      <div className="h-10 w-3/4 animate-pulse rounded-sm bg-surface" />
      <div className="mt-8 flex flex-col gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-baseline justify-between border-b border-line pb-4">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-40 animate-pulse rounded-sm bg-surface" />
              <div className="h-3 w-64 animate-pulse rounded-sm bg-surface" />
            </div>
            <div className="h-3 w-24 animate-pulse rounded-sm bg-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
