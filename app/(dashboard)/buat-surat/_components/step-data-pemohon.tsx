"use client";

import { searchWarga } from "@/app/(dashboard)/buat-surat/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Warga } from "@/types";
import {
  ArrowRightIcon,
  CheckIcon,
  Loader2Icon,
  SearchIcon,
  UserXIcon,
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
    let isSubscribed = true;

    const timer = setTimeout(() => {
      if (!trimmed) {
        if (isSubscribed) {
          setResults([]);
          setHasSearched(false);
        }
        return;
      }

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Pencarian Data Warga</CardTitle>
            <CardDescription>
              Ketik NIK atau nama warga untuk mencari data pemohon secara
              otomatis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="search-warga">
              Nomor Induk Kependudukan (NIK) atau Nama
            </Label>
            <div className="relative">
              <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
              <Input
                id="search-warga"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Masukkan NIK atau Nama warga..."
                className="pr-14 pl-9"
              />
              <div className="absolute top-1/2 right-3 z-10 flex -translate-y-1/2 items-center gap-1.5">
                {isPending && (
                  <Loader2Icon className="text-muted-foreground h-4 w-4 animate-spin" />
                )}
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setQuery("")}
                    className="text-muted-foreground hover:text-foreground"
                    title="Hapus pencarian"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {hasSearched && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Hasil Pencarian</CardTitle>
                <Badge variant="secondary">
                  {results.length} warga ditemukan
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {results.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
                  <UserXIcon className="mb-2 h-10 w-10 opacity-50" />
                  <p className="text-sm font-medium">Warga tidak ditemukan</p>
                  <p className="text-xs">
                    Periksa kembali NIK atau nama yang Anda masukkan.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-44 whitespace-nowrap">
                        NIK
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Nama Lengkap
                      </TableHead>
                      <TableHead className="min-w-48">Alamat</TableHead>
                      <TableHead className="w-28 text-right whitespace-nowrap">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((warga) => {
                      const isSelected = selectedWarga?.id === warga.id;
                      return (
                        <TableRow
                          key={warga.id}
                          className={cn(
                            isSelected && "bg-primary/5 dark:bg-primary/10",
                          )}
                        >
                          <TableCell className="text-foreground text-xs whitespace-nowrap">
                            {warga.nik}
                          </TableCell>
                          <TableCell className="font-medium whitespace-nowrap">
                            {warga.namaLengkap}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs leading-relaxed">
                            {warga.alamatKtp}, RT {warga.noRt}/RW {warga.noRw}
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
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
                                <span className="flex items-center gap-1.5">
                                  <CheckIcon className="h-3.5 w-3.5" />
                                  Terpilih
                                </span>
                              ) : (
                                "Pilih"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Card
        className={cn(
          "h-fit transition-all",
          selectedWarga && "ring-primary border-primary ring-2",
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                  selectedWarga
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <CheckIcon className="h-3.5 w-3.5" />
              </div>
              <CardTitle className="text-base">Warga Terpilih</CardTitle>
            </div>
            {selectedWarga && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => onSelect(null)}
                className="text-muted-foreground hover:text-destructive text-xs"
                title="Batalkan pilihan warga"
              >
                Batal
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {selectedWarga ? (
            <div className="space-y-3 text-sm">
              <div>
                <Label className="text-muted-foreground text-xs">NIK</Label>
                <p className="mt-0.5 font-medium">{selectedWarga.nik}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground text-xs">
                  Nama Lengkap
                </Label>
                <p className="mt-0.5 font-medium">
                  {selectedWarga.namaLengkap}
                </p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground text-xs">
                  Jenis Kelamin
                </Label>
                <p className="mt-0.5 font-medium">
                  {selectedWarga.jenisKelamin === "LAKI_LAKI"
                    ? "Laki-laki"
                    : "Perempuan"}
                </p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground text-xs">Alamat</Label>
                <p className="mt-0.5 font-medium">
                  {selectedWarga.alamatKtp}, RT {selectedWarga.noRt}/RW{" "}
                  {selectedWarga.noRw}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Belum ada warga yang dipilih. Cari dan pilih data warga terlebih
              dahulu.
            </p>
          )}
        </CardContent>

        {selectedWarga && (
          <CardFooter className="pt-2">
            <Button className="w-full gap-2" onClick={onNext}>
              <span>Pilih Jenis Surat</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
