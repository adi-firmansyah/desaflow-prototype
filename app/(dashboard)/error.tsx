"use client";

import { useEffect } from "react";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6">
        <AlertTriangleIcon className="h-8 w-8 text-red-500" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h2>
      <p className="text-neutral-500 max-w-md mb-8">
        Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi atau
        hubungi administrator jika masalah berlanjut.
      </p>

      {error.digest && (
        <p className="text-xs text-neutral-400 mb-4 font-mono">
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
