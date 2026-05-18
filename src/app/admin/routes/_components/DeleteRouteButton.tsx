"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

export function DeleteRouteButton({
  routeId,
  routeName,
}: {
  routeId: string;
  routeName: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin/routes/${routeId}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="flex items-center gap-1 text-xs text-red-600">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          Delete &ldquo;{routeName}&rdquo;?
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {deleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Yes, delete"
          )}
        </button>
        {!deleting && (
          <button
            onClick={() => setConfirming(false)}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-700"
    >
      <Trash2 className="h-3 w-3" />
      Delete
    </button>
  );
}
