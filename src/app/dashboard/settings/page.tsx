"use client";

import { useState } from "react";
import { Download, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardSettingsPage() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/user/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "data-export.json";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Deletion failed");
      }
      // Account deleted — redirect to home
      router.push("/?deleted=1");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "An error occurred.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-light text-[#1C1209]">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account data and privacy preferences.
        </p>
      </div>

      {/* Data export */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-gray-900">Download Your Data</h2>
        <p className="mb-4 text-sm text-gray-500">
          Export a copy of all your personal data, bookings, and saved tours as a JSON
          file (GDPR Article 20 — Right to Data Portability).
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-full bg-[#1C1209] px-5 py-2.5 text-sm font-semibold text-[#C9A84C] transition hover:bg-[#2E1E0A] disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Preparing…" : "Export My Data"}
        </button>
      </section>

      {/* Account deletion */}
      <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-red-700">Delete Account</h2>
        <p className="mb-4 text-sm text-gray-500">
          Permanently delete your account and all personal data. Your bookings will be
          anonymised for our legal records. This cannot be undone (GDPR Article 17 —
          Right to Erasure).
        </p>

        {deleteError && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {deleteError}
          </p>
        )}

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete My Account
          </button>
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Are you absolutely sure?
                </p>
                <p className="mt-1 text-sm text-red-700">
                  This will immediately delete your account and sign you out.
                  Your bookings will be anonymised but not removed.
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? "Deleting…" : "Yes, delete everything"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                    className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
