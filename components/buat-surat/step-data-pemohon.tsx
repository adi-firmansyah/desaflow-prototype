"use client";

import { searchWarga } from "@/app/(dashboard)/buat-surat/actions";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import type { Warga } from "./buat-surat-wizard";

export function StepDataPemohon({
  selectedWarga,
  onSelect,
  onNext,
}: {
  selectedWarga: Warga | null;
  onSelect: (warga: Warga) => void;
  onNext: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Warga[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  function handleSearch() {
    startTransition(async () => {
      const data = await searchWarga(query);
      setResults(data);
      setHasSearched(true);
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Pencarian Data Warga</h2>
          <label className="text-sm font-medium mb-1.5 block">
            Nomor Induk Kependudukan (NIK)
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Masukkan NIK atau Nama..."
              className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
            <Button
              onClick={handleSearch}
              disabled={isPending || !query.trim()}
            >
              {isPending ? "Mencari..." : "Cari Data"}
            </Button>
          </div>
        </div>

        {hasSearched && (
          <div className="border rounded-lg p-6">
            <h3 className="text-xs font-semibold tracking-wider text-neutral-500 mb-4">
              HASIL PENCARIAN ({results.length})
            </h3>

            {results.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4 text-center">
                Tidak ditemukan warga dengan kata kunci tersebut.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b">
                    <th className="pb-2 font-medium">NIK</th>
                    <th className="pb-2 font-medium">Nama Lengkap</th>
                    <th className="pb-2 font-medium">Alamat</th>
                    <th className="pb-2 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((warga) => (
                    <tr key={warga.id} className="border-b last:border-0">
                      <td className="py-3">{warga.nik}</td>
                      <td className="py-3 font-medium">{warga.namaLengkap}</td>
                      <td className="py-3 text-neutral-500">
                        {warga.alamat}, RT {warga.rt}/RW {warga.rw}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant={
                            selectedWarga?.id === warga.id
                              ? "default"
                              : "outline"
                          }
                          onClick={() => onSelect(warga)}
                        >
                          {selectedWarga?.id === warga.id
                            ? "Terpilih"
                            : "Pilih"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <div className="border-2 border-neutral-900 rounded-lg p-6 h-fit">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
            <span className="text-white text-xs">✓</span>
          </div>
          <h3 className="font-semibold">Warga Terpilih</h3>
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
                  {selectedWarga.alamat}, RT {selectedWarga.rt}/RW{" "}
                  {selectedWarga.rw}
                </p>
              </div>
            </div>

            <Button className="w-full mt-6" onClick={onNext}>
              Pilih Jenis Surat →
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
