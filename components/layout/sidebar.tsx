"use client";

import { cn } from "@/lib/utils";
import {
  FileStackIcon,
  FileTextIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { label: "Buat Surat", href: "/buat-surat", icon: FileTextIcon },
  { label: "Register Surat", href: "/register-surat", icon: ListChecksIcon },
  { label: "Riwayat Surat", href: "/riwayat-surat", icon: HistoryIcon },
  { label: "Data Warga", href: "/data-warga", icon: UsersIcon },
  { label: "Jenis Surat", href: "/jenis-surat", icon: FileStackIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-neutral-50 min-h-screen flex flex-col">
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold">DesaFlow</h1>
        <p className="text-sm text-neutral-500 mt-1">Admin Sistem Desa</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors border-l-2",
                isActive
                  ? "bg-neutral-200/70 border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-600 hover:bg-neutral-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
