import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { HelpCircleIcon } from "lucide-react";
import { headers } from "next/headers";
import { GlobalSearch } from "./global-search";
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
      <GlobalSearch />

      <div className="flex items-center gap-4 shrink-0">
        <HelpCircleIcon className="h-5 w-5 text-neutral-500" />
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
