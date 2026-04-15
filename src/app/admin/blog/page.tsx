import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { sql } from "drizzle-orm";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import Link from "next/link";
import { BookOpen, Plus, Pencil } from "lucide-react";

export default async function BlogPage() {
  await requireAdmin();

  const rows = await db
    .select()
    .from(blogPosts)
    .orderBy(sql`${blogPosts.createdAt} desc`);

  return (
    <div>
      <AdminPageHeader
        title="Blog Posts"
        description="Create and manage SEO-optimised blog articles."
        action={
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C] hover:bg-[#2E1E0A]"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">No blog posts yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Blog posts help rank for long-tail SEO keywords.
          </p>
          <Link
            href="/admin/blog/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1C1209] px-4 py-2 text-sm font-semibold text-[#C9A84C]"
          >
            <Plus className="h-4 w-4" /> Write First Post
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Title", "Status", "Focus Keyword", "Published", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.title}</div>
                    <div className="text-xs text-gray-400">/blog/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.published
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.focusKeyword ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/blog/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
