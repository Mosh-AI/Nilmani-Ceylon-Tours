import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "../../../_components/AdminPageHeader";
import { BlogForm } from "../../_components/BlogForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!post) notFound();

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </Link>
      </div>
      <AdminPageHeader title={`Edit: ${post.title}`} />
      <BlogForm initial={{
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content ?? "",
        excerpt: post.excerpt ?? "",
        coverImage: post.coverImage ?? "",
        published: post.published,
        metaTitle: post.metaTitle ?? "",
        metaDescription: post.metaDescription ?? "",
        focusKeyword: post.focusKeyword ?? "",
      }} />
    </div>
  );
}
