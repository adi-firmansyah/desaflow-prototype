"use client";

import { deleteJenisSurat } from "@/app/(dashboard)/jenis-surat/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export function DeleteJenisSuratButton({
  id,
  nama,
}: {
  id: string;
  nama: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const result = await deleteJenisSurat(id);
    if (!result.success) {
      setError(result.message ?? "Gagal menghapus.");
      setLoading(false);
      return;
    }
    setOpen(false);
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="text-neutral-400 hover:text-red-500 transition-colors"
      >
        <Trash2Icon className="h-4 w-4" />
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Jenis Surat?</DialogTitle>
          <DialogDescription>
            Jenis surat <strong>{nama}</strong> akan dihapus permanen.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
