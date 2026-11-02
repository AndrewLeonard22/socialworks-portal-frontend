export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-app-band-2 ${className}`}
    />
  );
}

export function SkeletonRows({
  count = 4,
  className = "h-14",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </div>
  );
}

export function SkeletonCards({
  count = 4,
  className = "h-40",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </div>
  );
}
