"use client";

import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/constants";
import type { JenisSurat } from "@/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  EllipsisIcon,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";
export function StepPilihJenisSurat({
  jenisSuratList,
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  jenisSuratList: JenisSurat[];
  selected: JenisSurat | null;
  onSelect: (jenis: JenisSurat) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = jenisSuratList.filter((j) =>
    j.nama.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <div className="border rounded-lg p-6 mb-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Pilih Jenis Surat</h2>
          <div className="relative w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari jenis surat..."
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">
            Tidak ada jenis surat yang cocok.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((jenis) => {
              const Icon = iconMap[jenis.icon] ?? EllipsisIcon;
              const isSelected = selected?.id === jenis.id;

              return (
                <button
                  key={jenis.id}
                  onClick={() => onSelect(jenis)}
                  className={`text-left border rounded-lg p-5 flex flex-col transition-colors ${
                    isSelected
                      ? "border-neutral-900 ring-1 ring-neutral-900"
                      : "hover:border-neutral-400"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-11 w-11 rounded-md bg-neutral-100 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && (
                      <div className="h-6 w-6 rounded-full bg-neutral-900 flex items-center justify-center">
                        <CheckIcon className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold mb-2">{jenis.nama}</h3>
                  <p className="text-sm text-neutral-500 flex-1 mb-4">
                    {jenis.deskripsi}
                  </p>

                  <div className="pt-3 border-t flex items-center justify-between text-sm font-medium">
                    {isSelected ? "Terpilih" : "Pilih"}
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Data Pemohon</span>
        </Button>
        <Button onClick={onNext} disabled={!selected}>
          <span>Lengkapi Form</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
