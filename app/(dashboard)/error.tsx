"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangleIcon className="h-8 w-8 text-red-500" />
      </div>

      <h2 className="mb-2 text-2xl font-bold">Terjadi Kesalahan</h2>
      <p className="mb-8 max-w-md text-neutral-500">
        Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi atau
        hubungi administrator jika masalah berlanjut.
      </p>

      {error.digest && (
        <p className="mb-4 text-xs text-neutral-400">
          Kode Error: {error.digest}
        </p>
      )}

      <Button onClick={reset} variant="outline" className="gap-2">
        <RefreshCwIcon className="h-4 w-4" />
        Coba Lagi
      </Button>
    </div>
  );
}
