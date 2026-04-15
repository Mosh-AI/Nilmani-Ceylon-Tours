import { Skeleton } from "@/components/ui/skeleton";

function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-brand-border bg-white">
      {/* Image placeholder — 16:9 aspect ratio */}
      <Skeleton className="aspect-video w-full rounded-none" />

      <div className="p-5">
        {/* Title */}
        <Skeleton className="mb-3 h-5 w-3/4" />

        {/* Description lines */}
        <Skeleton className="mb-2 h-3.5 w-full" />
        <Skeleton className="mb-4 h-3.5 w-5/6" />

        {/* Price + CTA row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ToursLoading() {
  return (
    <div className="min-h-screen bg-brand-bg pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Page heading skeleton */}
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-4 w-32" />
          <Skeleton className="mx-auto mb-3 h-9 w-64 sm:w-80" />
          <Skeleton className="mx-auto h-4 w-72 sm:w-96" />
        </div>

        {/* 6 card grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
