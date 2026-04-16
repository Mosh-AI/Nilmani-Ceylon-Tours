"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
      }}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
