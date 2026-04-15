import { requireAdmin } from "@/lib/admin-auth";
import { AdminSidebar } from "./_components/AdminSidebar";

export const metadata = { title: "Admin — Nilmani Ceylon Tours" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const adminName = session.user.name ?? "Admin";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar adminName={adminName} />
      <main className="flex-1 overflow-auto">
        <div className="px-6 py-8 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
