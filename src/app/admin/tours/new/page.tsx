import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { TourForm } from "../_components/TourForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewTourPage() {
  await requireAdmin();

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/tours" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to tours
        </Link>
      </div>
      <AdminPageHeader
        title="Add New Tour"
        description="Create a new tour listing. Fill in all details to help guests find and book it."
      />
      <TourForm />
    </div>
  );
}
