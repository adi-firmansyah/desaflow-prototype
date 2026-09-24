"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { iconMap } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { JenisSurat } from "@/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  EllipsisIcon,
  FileTextIcon,
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
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Pilih Jenis Surat</CardTitle>
            <CardDescription>
              Pilih salah satu template surat administrasi desa yang akan
              diterbitkan.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari jenis surat..."
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <FileTextIcon className="mb-2 h-10 w-10 opacity-50" />
              <p className="text-sm font-medium">
                Tidak ada jenis surat yang cocok
              </p>
              <p className="text-xs">
                Coba gunakan kata kunci pencarian yang lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((jenis) => {
                const Icon = iconMap[jenis.icon] ?? EllipsisIcon;
                const isSelected = selected?.id === jenis.id;

                return (
                  <button
                    key={jenis.id}
                    type="button"
                    onClick={() => onSelect(jenis)}
                    className={cn(
                      "group focus-visible:ring-ring bg-card text-card-foreground hover:border-primary/50 flex cursor-pointer flex-col justify-between rounded-xl border p-5 text-left shadow-xs transition-all outline-none hover:shadow-sm focus-visible:ring-2",
                      isSelected
                        ? "border-primary ring-primary bg-primary/[0.03] ring-2"
                        : "border-border hover:bg-muted/40",
                    )}
                  >
                    <div>
                      <div className="mb-3.5 flex items-start justify-between">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {isSelected && (
                          <Badge className="gap-1 shadow-none">
                            <CheckIcon className="h-3 w-3" />
                            Terpilih
                          </Badge>
                        )}
                      </div>

                      <h3 className="group-hover:text-primary mb-1.5 line-clamp-2 text-base font-semibold transition-colors">
                        {jenis.nama}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-xs leading-relaxed">
                        {jenis.deskripsi}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-between border-t pt-3 text-xs font-medium transition-colors",
                        isSelected
                          ? "text-primary border-primary/20"
                          : "text-muted-foreground group-hover:text-foreground border-border",
                      )}
                    >
                      <span>{isSelected ? "Dipilih" : "Pilih template"}</span>
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
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
