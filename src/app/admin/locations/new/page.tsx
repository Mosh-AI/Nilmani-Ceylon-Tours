import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { LocationForm } from "../_components/LocationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewLocationPage() {
  await requireAdmin();

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/locations"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to locations
        </Link>
      </div>
      <AdminPageHeader
        title="Add Location"
        description="Add a new stop location to the Sri Lanka map."
      />
      <LocationForm />
    </div>
  );
}
