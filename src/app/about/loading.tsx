import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <main>
      {/* Hero skeleton */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-brand-surface md:min-h-[70vh]">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-20 lg:px-12 lg:pt-40 lg:pb-28">
          <Skeleton className="mb-4 h-4 w-32" />
          <Skeleton className="mb-3 h-5 w-40" />
          <Skeleton className="mb-4 h-14 w-96 max-w-full" />
          <Skeleton className="mb-3 h-14 w-72 max-w-full" />
          <Skeleton className="h-6 w-80 max-w-full" />
        </div>
      </section>

      {/* Story skeleton */}
      <section className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="space-y-4">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-10 w-72 max-w-full" />
              <Skeleton className="h-10 w-56 max-w-full" />
              <Skeleton className="mt-6 h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="mt-4 h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-4 h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="bg-brand-surface px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col items-center gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-80 max-w-full" />
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-2xl border border-brand-border bg-white p-6 md:p-8"
              >
                <Skeleton className="mb-4 h-12 w-12 rounded-full" />
                <Skeleton className="mb-2 h-9 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values skeleton */}
      <section className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col items-center gap-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-10 w-48 max-w-full" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-brand-border bg-brand-surface p-6 md:p-8"
              >
                <Skeleton className="mb-5 h-12 w-12 rounded-xl" />
                <Skeleton className="mb-3 h-6 w-36" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide skeleton */}
      <section className="bg-brand-surface px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <Skeleton className="aspect-[5/6] w-full rounded-2xl" />
            </div>
            <div className="space-y-4 lg:col-span-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-10 w-64 max-w-full" />
              <Skeleton className="h-5 w-44" />
              <Skeleton className="mt-4 h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <div className="mt-6 flex gap-4">
                <Skeleton className="h-12 w-44 rounded-full" />
                <Skeleton className="h-12 w-40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA skeleton */}
      <section className="bg-brand-bg px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="min-h-[380px] w-full rounded-3xl md:min-h-[440px]" />
        </div>
      </section>
    </main>
  );
}
