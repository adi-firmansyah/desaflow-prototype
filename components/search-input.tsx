"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, Loader2Icon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  defaultValue?: string;
  delay?: number;
  className?: string;
}

export function SearchInput({
  placeholder = "Cari...",
  defaultValue,
  delay = 350,
  className,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(defaultValue ?? urlQuery);
  const isInitialMount = useRef(true);

  // Sync state if URL changes externally (e.g. browser navigation)
  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed === urlQuery) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      params.delete("page");

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, pathname, router, searchParams, urlQuery]);

  const handleClear = () => {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  return (
    <div className={cn("relative w-full bg-white", className)}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none z-10" />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        placeholder={placeholder}
        className="pl-9 pr-14 bg-white"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
        {isPending && (
          <Loader2Icon className="h-4 w-4 text-neutral-400 animate-spin" />
        )}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-neutral-400 hover:text-neutral-600 rounded p-0.5"
            title="Hapus pencarian"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
