"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from");
  const wargaId = searchParams.get("wargaId");

  let label = "Kembali ke Riwayat Surat";
  let href = "/riwayat-surat";

  if (from === "warga" && wargaId) {
    label = "Kembali ke Detail Warga";
    href = `/data-warga/${wargaId}`;
  }

  return (
    <button
      onClick={() => router.push(href)}
      className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      {label}
    </button>
  );
}
