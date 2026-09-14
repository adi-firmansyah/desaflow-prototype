"use client";

import { finalisasiSurat } from "@/app/(dashboard)/buat-surat/actions";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useTransition } from "react";

export function FinalisasiButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await finalisasiSurat(id);
    });
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-center"
      onClick={handleClick}
      disabled={isPending}
    >
      <CheckCircle2 className="h-4 w-4 mr-2" />
      {isPending ? "Memproses..." : "Jadikan Final"}
    </Button>
  );
}
