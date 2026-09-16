import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { HelpCircle, Search } from "lucide-react";
import { headers } from "next/headers";
import { LogoutButton } from "./logout-button";

export async function Topbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const name = session?.user?.name ?? "Admin Desa";
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-[73px] border-b flex items-center justify-between px-6 gap-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Cari surat atau warga..."
          className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <HelpCircle className="h-5 w-5 text-neutral-500" />
        <div className="h-6 w-px bg-neutral-200" />
        <span className="text-sm font-medium">{name}</span>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-neutral-200 text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="h-6 w-px bg-neutral-200" />
        <LogoutButton />
      </div>
    </header>
  );
}
