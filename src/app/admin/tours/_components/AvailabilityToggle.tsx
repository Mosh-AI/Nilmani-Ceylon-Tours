"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AvailabilityToggle({
  tourId,
  available,
}: {
  tourId: string;
  available: boolean;
}) {
  const [value, setValue] = useState(available);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/tours/${tourId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !value }),
    });
    setValue(!value);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? "bg-green-500" : "bg-gray-300"
      } disabled:opacity-50`}
      aria-label={value ? "Disable tour" : "Enable tour"}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
