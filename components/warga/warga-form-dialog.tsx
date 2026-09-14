"use client";

import { createWarga, updateWarga } from "@/app/(dashboard)/data-warga/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";

type Warga = {
  id: string;
  nik: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: Date;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN";
  agama: string;
  alamat: string;
  rt: string;
  rw: string;
  statusKawin: "BELUM_KAWIN" | "KAWIN" | "CERAI_HIDUP" | "CERAI_MATI";
  pekerjaan: string | null;
};

export function WargaFormDialog({
  warga,
  trigger,
}: {
  warga?: Warga;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!warga;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = isEdit
        ? await updateWarga(warga.id, formData)
        : await createWarga(formData);

      if (!result.success) {
        setError(result.message ?? "Terjadi kesalahan.");
        return;
      }

      setOpen(false);
      formRef.current?.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        {trigger}
      </div>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Data Warga" : "Tambah Warga Baru"}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  name="nik"
                  defaultValue={warga?.nik}
                  required
                  maxLength={16}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="namaLengkap">Nama Lengkap</Label>
                <Input
                  id="namaLengkap"
                  name="namaLengkap"
                  defaultValue={warga?.namaLengkap}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                <Input
                  id="tempatLahir"
                  name="tempatLahir"
                  defaultValue={warga?.tempatLahir}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahir"
                  name="tanggalLahir"
                  type="date"
                  defaultValue={
                    warga?.tanggalLahir
                      ? new Date(warga.tanggalLahir).toISOString().split("T")[0]
                      : undefined
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Jenis Kelamin</Label>
                <Select
                  name="jenisKelamin"
                  defaultValue={warga?.jenisKelamin ?? "LAKI_LAKI"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
                    <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="agama">Agama</Label>
                <Input
                  id="agama"
                  name="agama"
                  defaultValue={warga?.agama ?? "Islam"}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                name="alamat"
                defaultValue={warga?.alamat}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rt">RT</Label>
                <Input id="rt" name="rt" defaultValue={warga?.rt} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rw">RW</Label>
                <Input id="rw" name="rw" defaultValue={warga?.rw} required />
              </div>
              <div className="space-y-1.5">
                <Label>Status Kawin</Label>
                <Select
                  name="statusKawin"
                  defaultValue={warga?.statusKawin ?? "BELUM_KAWIN"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BELUM_KAWIN">Belum Kawin</SelectItem>
                    <SelectItem value="KAWIN">Kawin</SelectItem>
                    <SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem>
                    <SelectItem value="CERAI_MATI">Cerai Mati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pekerjaan">Pekerjaan (Opsional)</Label>
              <Input
                id="pekerjaan"
                name="pekerjaan"
                defaultValue={warga?.pekerjaan ?? ""}
              />
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
                    : "Tambah Warga"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
