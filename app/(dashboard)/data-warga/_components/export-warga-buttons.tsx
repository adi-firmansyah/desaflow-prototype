"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  InfoIcon,
  Loader2Icon,
} from "lucide-react";
import { useState } from "react";

type ExportFileFormat = "xlsx" | "csv";
type ExportDataMode = "formatted" | "backup";

export function ExportWargaButtons({
  query,
  filters,
}: {
  query?: string;
  filters?: Record<string, string | undefined>;
}) {
  const [open, setOpen] = useState(false);
  const [fileFormat, setFileFormat] = useState<ExportFileFormat>("xlsx");
  const [dataMode, setDataMode] = useState<ExportDataMode>("formatted");
  const [isExporting, setIsExporting] = useState(false);

  function handleOpen(format: ExportFileFormat) {
    setFileFormat(format);
    setOpen(true);
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (filters) {
        Object.entries(filters).forEach(([key, val]) => {
          if (val) params.set(key, val);
        });
      }
      params.set("format", fileFormat);
      params.set("mode", dataMode);

      const response = await fetch(
        `/api/data-warga/export?${params.toString()}`,
      );
      if (!response.ok) throw new Error("Gagal export");

      const disposition = response.headers.get("Content-Disposition");
      let filename = `${dataMode === "backup" ? "backup" : "laporan"}-data-warga.${fileFormat}`;
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setOpen(false);
    } catch {
      alert("Gagal mengekspor data warga. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => handleOpen("xlsx")}
          className="inline-flex items-center gap-2"
        >
          <FileSpreadsheetIcon className="h-4 w-4" />
          Excel
        </Button>
        <Button
          variant="outline"
          onClick={() => handleOpen("csv")}
          className="inline-flex items-center gap-2"
        >
          <FileTextIcon className="h-4 w-4" />
          CSV
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(val) => !isExporting && setOpen(val)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Export Data Warga</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <div className="grid grid-cols-2 gap-3">
              {/* Tombol Arsip */}
              <div className="relative group">
                <Button
                  type="button"
                  variant={dataMode === "formatted" ? "default" : "outline"}
                  onClick={() => setDataMode("formatted")}
                  className="w-full gap-1.5"
                >
                  <FileSpreadsheetIcon className="h-4 w-4 shrink-0" />
                  <span>Arsip</span>
                  <InfoIcon className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                </Button>
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 text-center leading-relaxed">
                  Format rapi untuk cetak, laporan dinas, dan arsip fisik.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                </div>
              </div>

              {/* Tombol Cadangan */}
              <div className="relative group">
                <Button
                  type="button"
                  variant={dataMode === "backup" ? "default" : "outline"}
                  onClick={() => setDataMode("backup")}
                  className="w-full gap-1.5"
                >
                  <ArchiveIcon className="h-4 w-4 shrink-0" />
                  <span>Cadangan</span>
                  <InfoIcon className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                </Button>
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 text-center leading-relaxed">
                  Format mentah database, siap untuk diimpor kembali ke sistem.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isExporting}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="disabled:cursor-not-allowed"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin mr-1" />
                  Mengunduh...
                </>
              ) : (
                "Unduh"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
