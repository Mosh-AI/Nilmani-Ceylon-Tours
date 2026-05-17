import { requireUser } from "@/lib/user-auth";
import Link from "next/link";
import { Header } from "@/components/Header";
import { LayoutDashboard, CalendarCheck, Heart, Settings, MapPin } from "lucide-react";

export const metadata = { title: "My Dashboard — Nilmani Ceylon Tours" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Header />

      <div className="mx-auto max-w-5xl px-6 pt-28 pb-8">
        {/* Tab nav */}
        <nav className="mb-8 flex gap-1 overflow-x-auto border-b border-gray-100 pb-px">
          {[
            { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
            { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarCheck },
            { href: "/dashboard/favorites", label: "Saved Tours", icon: Heart },
            { href: "/tours/customize", label: "Customize Tour", icon: MapPin },
            { href: "/dashboard/settings", label: "Settings", icon: Settings },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
