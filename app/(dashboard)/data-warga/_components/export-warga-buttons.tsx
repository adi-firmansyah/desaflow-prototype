"use client";

import { FileSpreadsheetIcon, FileTextIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

export function ExportWargaButtons({ query }: { query?: string }) {
  const [loadingFormat, setLoadingFormat] = useState<"xlsx" | "csv" | null>(
    null,
  );

  async function handleExport(format: "xlsx" | "csv") {
    setLoadingFormat(format);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      params.set("format", format);

      const response = await fetch(
        `/api/data-warga/export?${params.toString()}`,
      );
      if (!response.ok) throw new Error("Gagal export");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `data-warga.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengekspor data. Silakan coba lagi.");
    } finally {
      setLoadingFormat(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("xlsx")}
        disabled={loadingFormat !== null}
        className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium bg-white hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingFormat === "xlsx" ? (
          <Loader2Icon className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheetIcon className="h-4 w-4" />
        )}
        Excel
      </button>
      <button
        onClick={() => handleExport("csv")}
        disabled={loadingFormat !== null}
        className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium bg-white hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingFormat === "csv" ? (
          <Loader2Icon className="h-4 w-4 animate-spin" />
        ) : (
          <FileTextIcon className="h-4 w-4" />
        )}
        CSV
      </button>
    </div>
  );
}
