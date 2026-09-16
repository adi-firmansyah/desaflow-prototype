"use client";

import { deleteWarga } from "@/app/(dashboard)/data-warga/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteWargaButton({ id, nama }: { id: string; nama: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteWarga(id);
    setOpen(false);
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="text-neutral-400 hover:text-red-600 transition-colors"
        title="Hapus warga"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Data Warga?</DialogTitle>
          <DialogDescription>
            Data <strong>{nama}</strong> akan dihapus permanen. Tindakan ini
            tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
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
