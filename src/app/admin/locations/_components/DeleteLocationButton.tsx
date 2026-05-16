"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteLocationButtonProps {
  id: string;
  name: string;
}

export function DeleteLocationButton({ id, name }: DeleteLocationButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/locations/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error ?? "Failed to delete location.");
      setDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      <Trash2 className="h-3 w-3" />
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
