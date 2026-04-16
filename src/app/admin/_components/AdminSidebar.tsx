"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  Images,
  MessageSquare,
  Settings,
  BookOpen,
  Star,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[#C9A84C]/15 text-[#C9A84C]"
          : "text-[#BDB5A6] hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      {label}
    </Link>
  );
}

export function AdminSidebar({ adminName }: { adminName: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      {/* Logo */}
      <div className="mb-8 px-3">
        <p className="font-serif text-base font-light tracking-widest text-[#C9A84C]">
          NILMANI
        </p>
        <p className="text-[10px] tracking-[0.2em] text-[#6B5E4E] uppercase">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {nav.map((item) => (
          <NavItem key={item.href} {...item} onClick={onNav} />
        ))}
      </nav>

      {/* User + logout */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A84C]/20 text-xs font-semibold text-[#C9A84C]">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">{adminName}</p>
            <p className="text-[10px] text-[#6B5E4E]">Administrator</p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col bg-[#0F0A05] px-3 py-6 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-[#0F0A05] p-2 text-[#C9A84C] shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[#0F0A05] px-4 py-6 shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 p-1 text-[#BDB5A6] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNav={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
      }}
      className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#BDB5A6] transition hover:bg-white/5 hover:text-white"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      Sign out
    </button>
  );
}
