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
    <header className="flex h-18.25 items-center justify-between gap-4 border-b bg-white px-6">
      <GlobalSearch />

      <div className="flex shrink-0 items-center gap-4">
        <span className="text-sm font-medium">{name}</span>
        <div className="bg-border h-6 w-px" />
        <LogoutButton />
      </div>
    </header>
  );
}
