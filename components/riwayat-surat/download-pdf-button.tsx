"use client";

import { cn } from "cn";
import { FileDownIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

export function DownloadPdfButton({
  suratId,
  nomorSurat,
  iconOnly = false,
}: {
  suratId: string;
  nomorSurat: string;
  iconOnly?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const response = await fetch(`/api/surat/${suratId}/pdf`);

      if (!response.ok) {
        throw new Error("Gagal mengunduh PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${nomorSurat.replace(/\//g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={cn(
        "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        iconOnly
          ? "text-neutral-400 hover:text-neutral-700"
          : "w-full inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-neutral-50",
      )}
    >
      {loading ? (
        <>
          <Loader2Icon className="h-4 w-4 animate-spin" />
          {!iconOnly && "Mengunduh..."}
        </>
      ) : (
        <>
          <FileDownIcon className="h-4 w-4" />
          {!iconOnly && "Unduh PDF"}
        </>
      )}
    </button>
  );
}
