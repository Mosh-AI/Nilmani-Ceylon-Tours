import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-brand-bg pt-20">
      {/* Hero skeleton */}
      <section className="bg-brand-surface px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-72 sm:h-14 sm:w-96" />
          <Skeleton className="h-5 w-80 sm:w-[28rem]" />
          <Skeleton className="mt-2 h-5 w-60" />
          <Skeleton className="mt-2 h-1 w-24" />
        </div>
      </section>

      {/* Filter skeleton */}
      <section className="border-b border-brand-border px-6 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-hidden py-4">
          <Skeleton className="h-10 w-16 shrink-0 rounded-full" />
          <Skeleton className="h-10 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-10 w-20 shrink-0 rounded-full" />
          <Skeleton className="h-10 w-20 shrink-0 rounded-full" />
          <Skeleton className="h-10 w-28 shrink-0 rounded-full" />
          <Skeleton className="h-10 w-32 shrink-0 rounded-full" />
        </div>
      </section>

      {/* Gallery grid skeleton */}
      <section className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-6">
            <Skeleton className="mb-4 h-60 rounded-xl lg:mb-6" />
            <Skeleton className="mb-4 h-80 rounded-xl lg:mb-6" />
            <Skeleton className="mb-4 h-70 rounded-xl lg:mb-6" />
            <Skeleton className="mb-4 h-90 rounded-xl lg:mb-6" />
            <Skeleton className="mb-4 h-60 rounded-xl lg:mb-6" />
            <Skeleton className="mb-4 h-75 rounded-xl lg:mb-6" />
            <Skeleton className="mb-4 h-70 rounded-xl lg:mb-6" />
            <Skeleton className="mb-4 h-85 rounded-xl lg:mb-6" />
            <Skeleton className="mb-4 h-65 rounded-xl lg:mb-6" />
          </div>
        </div>
      </section>
    </div>
  );
}
