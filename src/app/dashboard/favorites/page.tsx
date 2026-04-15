import { requireUser } from "@/lib/user-auth";
import { db } from "@/db";
import { favorites, tours } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Heart } from "lucide-react";

export default async function FavoritesPage() {
  const session = await requireUser();

  // IDOR: always scope by userId
  const favs = await db
    .select({ tour: tours })
    .from(favorites)
    .innerJoin(tours, eq(favorites.tourId, tours.id))
    .where(eq(favorites.userId, session.user.id));

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Saved Tours</h2>

      {favs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Heart className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">
            No saved tours yet
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Tap the heart on any tour to save it here.
          </p>
          <Link
            href="/tours"
            className="mt-4 inline-block rounded-full bg-[#1C1209] px-6 py-2.5 text-sm font-semibold text-[#C9A84C]"
          >
            Browse Tours
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {favs.map(({ tour }) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.slug}`}
              className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              {tour.heroImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tour.heroImage}
                  alt={tour.title}
                  className="h-36 w-full object-cover transition group-hover:opacity-90"
                />
              )}
              <div className="p-4">
                <p className="font-semibold text-gray-900">{tour.title}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {tour.duration} days · From ${tour.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
