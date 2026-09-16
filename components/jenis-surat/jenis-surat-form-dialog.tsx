"use client";

import {
  createJenisSurat,
  updateJenisSurat,
  type FieldSchema,
} from "@/app/(dashboard)/jenis-surat/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { FieldBuilder } from "./field-builder";

const iconOptions = [
  { value: "church", label: "Gereja (Kematian)" },
  { value: "users", label: "Orang Banyak (Status Kawin)" },
  { value: "user", label: "Orang (Individu)" },
  { value: "briefcase", label: "Koper (Usaha)" },
  { value: "map-pin", label: "Pin Lokasi (Domisili)" },
  { value: "heart-handshake", label: "Bantuan (Tidak Mampu)" },
  { value: "ellipsis", label: "Titik Tiga (Lainnya)" },
];

export type JenisSurat = {
  id: string;
  nama: string;
  deskripsi: string;
  icon: string;
  kodeFormat: string;
  templateFields: string;
};

export function JenisSuratFormDialog({
  jenisSurat,
  trigger,
}: {
  jenisSurat?: JenisSurat;
  trigger: React.ReactNode;
}) {
  const isEdit = !!jenisSurat;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nama, setNama] = useState(jenisSurat?.nama ?? "");
  const [deskripsi, setDeskripsi] = useState(jenisSurat?.deskripsi ?? "");
  const [icon, setIcon] = useState(jenisSurat?.icon ?? "church");
  const [kodeFormat, setKodeFormat] = useState(jenisSurat?.kodeFormat ?? "");
  const [fields, setFields] = useState<FieldSchema[]>(
    jenisSurat ? JSON.parse(jenisSurat.templateFields) : [],
  );

  function resetForm() {
    setNama(jenisSurat?.nama ?? "");
    setDeskripsi(jenisSurat?.deskripsi ?? "");
    setIcon(jenisSurat?.icon ?? "church");
    setKodeFormat(jenisSurat?.kodeFormat ?? "");
    setFields(jenisSurat ? JSON.parse(jenisSurat.templateFields) : []);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (fields.some((f) => !f.label.trim())) {
      setError("Semua field harus memiliki label.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nama,
        deskripsi,
        icon,
        kodeFormat: kodeFormat.toUpperCase(),
        fields,
      };

      const result = isEdit
        ? await updateJenisSurat(jenisSurat.id, payload)
        : await createJenisSurat(payload);

      if (!result.success) {
        setError(result.message ?? "Terjadi kesalahan.");
        return;
      }

      setOpen(false);
      if (!isEdit) resetForm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) resetForm();
      }}
    >
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Jenis Surat" : "Tambah Jenis Surat Baru"}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-between gap-1.5">
                <Label>Nama Jenis Surat</Label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Surat Keterangan Pindah"
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
              <div className="flex flex-col justify-between gap-1.5">
                <Label>Kode Format (untuk nomor surat)</Label>
                <input
                  type="text"
                  value={kodeFormat}
                  onChange={(e) => setKodeFormat(e.target.value)}
                  placeholder="Contoh: SKP"
                  maxLength={6}
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm uppercase focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Deskripsi</Label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan singkat kegunaan surat ini..."
                required
                rows={2}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ikon</Label>
              <Select
                value={icon}
                onValueChange={(val) => setIcon(val ?? "church")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Field Detail Surat</Label>
              <p className="text-xs text-neutral-500 mb-2">
                Field ini akan muncul di form saat petugas mengisi detail surat.
              </p>
              <FieldBuilder fields={fields} onChange={setFields} />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Menyimpan..."
                  : isEdit
                    ? "Simpan Perubahan"
                    : "Tambah Jenis Surat"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
