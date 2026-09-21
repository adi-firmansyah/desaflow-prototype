"use client";

import { globalSearch } from "@/app/actions/global-search";
import type { SuratSearchResult, WargaSearchResult } from "@/types";
import {
  FileTextIcon,
  Loader2Icon,
  SearchIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    warga: WargaSearchResult[];
    surat: SuratSearchResult[];
  }>({
    warga: [],
    surat: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults({ warga: [], surat: [] });
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const data = await globalSearch(query);
        setResults(data);
        setIsOpen(true);
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goTo(path: string) {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  }

  function handleClear() {
    setQuery("");
    setResults({ warga: [], surat: [] });
    setIsOpen(false);
  }

  const hasResults = results.warga.length > 0 || results.surat.length > 0;
  const showEmpty = query.trim().length >= 2 && !isPending && !hasResults;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none z-10" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
        placeholder="Cari surat atau warga..."
        className="pl-9 pr-14 bg-white"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
        {isPending && (
          <Loader2Icon className="h-4 w-4 text-neutral-400 animate-spin" />
        )}
        {query && (
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

      {isOpen && (hasResults || showEmpty) && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {showEmpty && (
            <p className="text-sm text-neutral-500 text-center py-6">
              Tidak ditemukan hasil untuk &quot;{query}&quot;.
            </p>
          )}

          {results.warga.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-neutral-400 px-3 pt-3 pb-1">
                Warga
              </p>
              {results.warga.map((w) => (
                <button
                  key={w.id}
                  onClick={() => goTo(`/data-warga/${w.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 text-left"
                >
                  <UserIcon className="h-4 w-4 text-neutral-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {w.namaLengkap}
                    </p>
                    <p className="text-xs text-neutral-500">{w.nik}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.surat.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-neutral-400 px-3 pt-3 pb-1">
                Surat
              </p>
              {results.surat.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goTo(`/riwayat-surat/${s.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 text-left"
                >
                  <FileTextIcon className="h-4 w-4 text-neutral-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {s.nomorSurat}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {s.warga.namaLengkap} · {s.jenisSurat.nama}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
