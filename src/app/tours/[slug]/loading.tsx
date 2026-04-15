import { Skeleton } from "@/components/ui/skeleton";

function ItineraryDaySkeleton() {
  return (
    <div className="flex gap-4 border-b border-brand-border py-6 last:border-b-0">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1">
        <Skeleton className="mb-2 h-5 w-40" />
        <Skeleton className="mb-1.5 h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
    </div>
  );
}

export default function TourDetailLoading() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero image placeholder */}
      <Skeleton className="h-[50vh] w-full rounded-none sm:h-[60vh]" />

      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-12">
        {/* Breadcrumb */}
        <Skeleton className="mb-6 h-3.5 w-48" />

        {/* Title */}
        <Skeleton className="mb-3 h-10 w-3/4 sm:w-1/2" />

        {/* Subtitle / tagline */}
        <Skeleton className="mb-8 h-5 w-full sm:w-2/3" />

        {/* Meta row (duration, price, etc.) */}
        <div className="mb-10 flex flex-wrap gap-6">
          <Skeleton className="h-12 w-28 rounded-lg" />
          <Skeleton className="h-12 w-28 rounded-lg" />
          <Skeleton className="h-12 w-28 rounded-lg" />
        </div>

        {/* Description paragraphs */}
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-5/6" />
        <Skeleton className="mb-10 h-4 w-3/4" />

        {/* Itinerary section heading */}
        <Skeleton className="mb-6 h-7 w-40" />

        {/* Itinerary days */}
        {Array.from({ length: 4 }, (_, i) => (
          <ItineraryDaySkeleton key={i} />
        ))}

        {/* CTA button */}
        <div className="mt-10 text-center">
          <Skeleton className="mx-auto h-12 w-48 rounded-full" />
        </div>
      </div>
    </div>
  );
}
