"use client";

import { authClient } from "@/lib/auth/client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
      title="Keluar"
    >
      <LogOutIcon className="h-5 w-5" />
    </button>
  );
}
