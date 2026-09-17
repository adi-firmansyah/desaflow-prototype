import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { GlobalSearch } from "./global-search";
import { LogoutButton } from "./logout-button";

export async function Topbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const name = session?.user?.name ?? "Admin Desa";

  return (
    <header className="h-18.25 border-b flex items-center justify-between px-6 gap-4">
      <GlobalSearch />

      <div className="flex items-center gap-4 shrink-0">
        <span className="text-sm font-medium">{name}</span>
        <div className="h-6 w-px bg-neutral-200" />
        <LogoutButton />
      </div>
    </header>
  );
}
