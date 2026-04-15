import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "../../_components/AdminPageHeader";
import { BlogForm } from "../_components/BlogForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewBlogPostPage() {
  await requireAdmin();
  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </Link>
      </div>
      <AdminPageHeader title="New Blog Post" description="Write an SEO article to attract organic search traffic." />
      <BlogForm />
    </div>
  );
}
