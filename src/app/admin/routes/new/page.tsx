import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { RouteForm } from "../_components/RouteForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewRoutePage() {
  await requireAdmin();

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/routes"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to routes
        </Link>
      </div>
      <AdminPageHeader
        title="Add New Route"
        description="Build a named stop sequence for the Customize Your Tour map."
      />
      <RouteForm />
    </div>
  );
}
