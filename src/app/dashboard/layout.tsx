import { requireUser } from "@/lib/user-auth";
import Link from "next/link";
import { LayoutDashboard, CalendarCheck, Heart, Settings } from "lucide-react";
import { SignOutButton } from "./_components/SignOutButton";

export const metadata = { title: "My Dashboard — Nilmani Ceylon Tours" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  const name = session.user.name ?? "Traveller";

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Top nav */}
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-lg font-light tracking-widest text-[#1C1209]">
            Nilmani Ceylon Tours
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 sm:block">
              Welcome, {name}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Tab nav */}
        <nav className="mb-8 flex gap-1 overflow-x-auto">
          {[
            { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
            { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarCheck },
            { href: "/dashboard/favorites", label: "Saved Tours", icon: Heart },
            { href: "/dashboard/settings", label: "Settings", icon: Settings },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
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
