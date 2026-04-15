"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, EyeOff } from "lucide-react";

export function TestimonialToggle({ id, approved }: { id: string; approved: boolean }) {
  const [value, setValue] = useState(approved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    await fetch("/api/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: !value }),
    });
    setValue(!value);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        value
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      {value ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" /> Approved
        </>
      ) : (
        <>
          <EyeOff className="h-3.5 w-3.5" /> Hidden
        </>
      )}
    </button>
  );
}
