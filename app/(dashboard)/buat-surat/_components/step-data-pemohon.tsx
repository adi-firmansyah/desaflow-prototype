"use client";

import { searchWarga } from "@/app/(dashboard)/buat-surat/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Warga } from "@/types";
import { cn } from "cn";
import {
  ArrowRightIcon,
  CheckIcon,
  Loader2Icon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";

export function StepDataPemohon({
  selectedWarga,
  onSelect,
  onNext,
}: {
  selectedWarga: Warga | null;
  onSelect: (warga: Warga | null) => void;
  onNext: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Warga[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    let isSubscribed = true;

    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const data = await searchWarga(trimmed);
          if (isSubscribed) {
            setResults(data);
            setHasSearched(true);
          }
        } catch (error) {
          console.error("Gagal mencari data warga:", error);
          if (isSubscribed) {
            setResults([]);
            setHasSearched(true);
          }
        }
      });
    }, 350);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-1">Pencarian Data Warga</h2>
          <p className="text-neutral-500 text-sm mb-4">
            Ketik NIK atau nama warga untuk mencari data pemohon secara
            otomatis.
          </p>
          <label className="text-sm font-medium mb-1.5 block">
            Nomor Induk Kependudukan (NIK) atau Nama
          </label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none z-10" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masukkan NIK atau Nama warga..."
              className="pl-9 pr-14 bg-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
              {isPending && (
                <Loader2Icon className="h-4 w-4 text-neutral-400 animate-spin" />
              )}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-neutral-400 hover:text-neutral-600 rounded p-0.5"
                  title="Hapus pencarian"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {hasSearched && (
          <div className="border rounded-lg p-6 bg-white">
            {results.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4 text-center">
                Tidak ditemukan warga dengan kata kunci tersebut.
              </p>
            ) : (
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-500 border-b">
                      <th className="pb-2.5 pr-4 font-medium w-44 whitespace-nowrap">
                        NIK
                      </th>
                      <th className="pb-2.5 px-4 font-medium whitespace-nowrap">
                        Nama Lengkap
                      </th>
                      <th className="pb-2.5 px-4 font-medium min-w-50">
                        Alamat
                      </th>
                      <th className="pb-2.5 pl-4 font-medium text-right w-28 whitespace-nowrap">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((warga) => {
                      const isSelected = selectedWarga?.id === warga.id;
                      return (
                        <tr
                          key={warga.id}
                          className="border-b last:border-0 hover:bg-neutral-50/60 transition-colors"
                        >
                          <td className="py-3 pr-4 font-mono text-xs text-neutral-700 whitespace-nowrap">
                            {warga.nik}
                          </td>
                          <td className="py-3 px-4 font-medium whitespace-nowrap">
                            {warga.namaLengkap}
                          </td>
                          <td className="py-3 px-4 text-neutral-500 text-xs leading-relaxed">
                            {warga.alamatKtp}, RT {warga.noRt}/RW {warga.noRw}
                          </td>
                          <td className="py-3 pl-4 text-right whitespace-nowrap">
                            <Button
                              size="sm"
                              variant={isSelected ? "default" : "outline"}
                              onClick={() =>
                                onSelect(isSelected ? null : warga)
                              }
                              title={
                                isSelected
                                  ? "Klik untuk membatalkan pilihan"
                                  : "Pilih warga ini"
                              }
                            >
                              {isSelected ? (
                                <span className="flex items-center gap-2">
                                  <CheckIcon className="h-3.5 w-3.5" />
                                  Terpilih
                                </span>
                              ) : (
                                "Pilih"
                              )}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className={cn(
          "border rounded-lg p-6 h-fit bg-white",
          selectedWarga && "border-neutral-900 ring-1 ring-neutral-900",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
              <CheckIcon className="h-3 w-3 text-white" />
            </div>
            <h3 className="font-semibold">Warga Terpilih</h3>
          </div>
          {selectedWarga && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="text-xs text-neutral-500 hover:text-red-600 transition-colors"
              title="Batalkan pilihan warga"
            >
              Batal
            </button>
          )}
        </div>

        {selectedWarga ? (
          <>
            <div className="space-y-3 text-sm">
              <div className="pb-3 border-b">
                <p className="text-neutral-500 text-xs mb-1">NIK</p>
                <p className="font-medium">{selectedWarga.nik}</p>
              </div>
              <div className="pb-3 border-b">
                <p className="text-neutral-500 text-xs mb-1">Nama Lengkap</p>
                <p className="font-medium">{selectedWarga.namaLengkap}</p>
              </div>
              <div className="pb-3 border-b">
                <p className="text-neutral-500 text-xs mb-1">Jenis Kelamin</p>
                <p className="font-medium">
                  {selectedWarga.jenisKelamin === "LAKI_LAKI"
                    ? "Laki-laki"
                    : "Perempuan"}
                </p>
              </div>
              <div>
                <p className="text-neutral-500 text-xs mb-1">Alamat</p>
                <p className="font-medium">
                  {selectedWarga.alamatKtp}, RT {selectedWarga.noRt}/RW{" "}
                  {selectedWarga.noRw}
                </p>
              </div>
            </div>

            <Button className="w-full mt-6 gap-2" onClick={onNext}>
              <span>Pilih Jenis Surat</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <p className="text-sm text-neutral-500 py-8 text-center">
            Belum ada warga yang dipilih. Cari dan pilih data warga terlebih
            dahulu.
          </p>
        )}
      </div>
    </div>
  );
}
