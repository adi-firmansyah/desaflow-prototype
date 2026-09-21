"use client";

import { Button } from "@/components/ui/button";
import {
  agamaLabel,
  golonganDarahLabel,
  jenisKelaminLabel,
  jenisPekerjaanLabel,
  kewarganegaraanLabel,
  pendidikanTerakhirLabel,
  statusHubunganKeluargaLabel,
  statusPerkawinanLabel,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type FilterConfig = {
  key: string;
  label: string;
  options: [string, string][];
};

const FILTER_CONFIGS: FilterConfig[] = [
  {
    key: "jenisKelamin",
    label: "Jenis Kelamin",
    options: Object.entries(jenisKelaminLabel),
  },
  {
    key: "agama",
    label: "Agama",
    options: Object.entries(agamaLabel),
  },
  {
    key: "golonganDarah",
    label: "Golongan Darah",
    options: Object.entries(golonganDarahLabel),
  },
  {
    key: "statusPerkawinan",
    label: "Status Perkawinan",
    options: Object.entries(statusPerkawinanLabel),
  },
  {
    key: "statusHubunganKeluarga",
    label: "Status Hub. Keluarga",
    options: Object.entries(statusHubunganKeluargaLabel),
  },
  {
    key: "pendidikanTerakhir",
    label: "Pendidikan Terakhir",
    options: Object.entries(pendidikanTerakhirLabel),
  },
  {
    key: "jenisPekerjaan",
    label: "Pekerjaan",
    options: Object.entries(jenisPekerjaanLabel),
  },
  {
    key: "kewarganegaraan",
    label: "Kewarganegaraan",
    options: Object.entries(kewarganegaraanLabel),
  },
];

export function WargaFilterBar({
  children,
  exportButtons,
}: {
  children?: React.ReactNode;
  exportButtons?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);

  // Hitung filter yang sedang aktif
  const activeFilters = useMemo(() => {
    const list: {
      key: string;
      label: string;
      value: string;
      displayValue: string;
    }[] = [];
    FILTER_CONFIGS.forEach(({ key, label, options }) => {
      const val = searchParams.get(key);
      if (val) {
        const found = options.find(([v]) => v === val);
        list.push({
          key,
          label,
          value: val,
          displayValue: found ? found[1] : val,
        });
      }
    });
    return list;
  }, [searchParams]);

  const activeCount = activeFilters.length;

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }

  function removeFilter(key: string) {
    updateFilter(key, "");
  }

  function resetAllFilters() {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_CONFIGS.forEach(({ key }) => {
      params.delete(key);
    });
    params.delete("page");

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }

  return (
    <div className="w-full space-y-3">
      {/* Row: Search Input + Filter Button di sebelah kanan + Export Buttons */}
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2 w-full">
          {children}

          {/* Tombol Filter di sebelah kanan search */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "gap-2 text-sm font-medium transition-colors shrink-0",
              activeCount > 0 && "border-primary text-primary bg-primary/5",
            )}
          >
            <SlidersHorizontalIcon className="h-4 w-4" />
            <span>Filter</span>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {activeCount}
              </span>
            )}
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4 text-muted-foreground ml-0.5" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground ml-0.5" />
            )}
          </Button>

          {activeCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-9 shrink-0"
              title="Reset semua filter"
            >
              <RotateCcwIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>

        {exportButtons}
      </div>

      {/* Expandable Filter Panel */}
      {isOpen && (
        <div className="rounded-xl border bg-card p-4 shadow-xs transition-all animate-in fade-in-50">
          <div className="flex items-center justify-between pb-3 mb-3 border-b">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Filter Data Warga</span>
              {activeCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({activeCount} filter aktif)
                </span>
              )}
            </div>
            {activeCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1 h-7"
              >
                <RotateCcwIcon className="h-3 w-3" />
                <span>Hapus Semua</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {FILTER_CONFIGS.map(({ key, label, options }) => {
              const currentValue = searchParams.get(key) ?? "";
              return (
                <div key={key} className="space-y-1.5">
                  <label
                    htmlFor={`filter-${key}`}
                    className="text-xs font-medium text-neutral-600 dark:text-neutral-300 block truncate"
                  >
                    {label}
                  </label>
                  <select
                    id={`filter-${key}`}
                    value={currentValue}
                    onChange={(e) => updateFilter(key, e.target.value)}
                    className={cn(
                      "w-full h-8.5 px-2.5 text-xs rounded-md border bg-background shadow-xs outline-none transition-colors",
                      "focus:ring-1 focus:ring-primary focus:border-primary",
                      currentValue
                        ? "border-primary font-medium text-foreground bg-primary/5"
                        : "border-input text-muted-foreground",
                    )}
                  >
                    <option value="">Semua {label}</option>
                    {options.map(([val, optLabel]) => (
                      <option key={val} value={val} className="text-foreground">
                        {optLabel}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Chips / Badges */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-muted-foreground mr-1">
            Filter aktif:
          </span>
          {activeFilters.map(({ key, label, displayValue }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
            >
              <span className="font-medium text-muted-foreground">
                {label}:
              </span>
              <span>{displayValue}</span>
              <button
                type="button"
                onClick={() => removeFilter(key)}
                className="hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
                title={`Hapus filter ${label}`}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
