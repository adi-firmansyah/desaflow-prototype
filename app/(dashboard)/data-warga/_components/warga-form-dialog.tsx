"use client";

import { createWarga, updateWarga } from "@/app/(dashboard)/data-warga/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WargaSchema } from "@/lib/validations/warga";
import type { Warga } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import type { z } from "zod";

type WargaFormValues = z.input<typeof WargaSchema>;

export function WargaFormDialog({
  warga,
  trigger,
}: {
  warga?: Warga;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!warga;
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<WargaFormValues>({
    resolver: zodResolver(WargaSchema),
    defaultValues: {
      nik: warga?.nik ?? "",
      namaLengkap: warga?.namaLengkap ?? "",
      tempatLahir: warga?.tempatLahir ?? "",
      tanggalLahir: warga?.tanggalLahir
        ? new Date(warga.tanggalLahir).toISOString().split("T")[0]
        : "",
      jenisKelamin: warga?.jenisKelamin ?? "LAKI_LAKI",
      agama: warga?.agama ?? "Islam",
      alamat: warga?.alamat ?? "",
      rt: warga?.rt ?? "",
      rw: warga?.rw ?? "",
      statusKawin: warga?.statusKawin ?? "BELUM_KAWIN",
      pekerjaan: warga?.pekerjaan ?? null,
    },
  });

  async function onSubmit(values: WargaFormValues) {
    setError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.set(key, String(value));
    });

    const result = isEdit
      ? await updateWarga(warga.id, formData)
      : await createWarga(formData);

    if (!result.success) {
      setError(result.message ?? "Terjadi kesalahan.");
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          const message = messages?.[0];
          if (message) {
            setFieldError(field as keyof WargaFormValues, {
              type: "server",
              message,
            });
          }
        });
      }
      return;
    }

    setOpen(false);
    reset();
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setError(null);
        setOpen(v);
      }}
    >
      <div
        className="inline-flex"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        {trigger}
      </div>

      <SheetContent className="data-[side=right]:sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Edit Data Warga" : "Tambah Warga Baru"}
          </SheetTitle>
        </SheetHeader>

        {open && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 px-4 pb-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  {...register("nik")}
                  aria-invalid={!!errors.nik}
                  maxLength={16}
                />
                <FieldError message={errors.nik?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="namaLengkap">Nama Lengkap</Label>
                <Input
                  id="namaLengkap"
                  {...register("namaLengkap")}
                  aria-invalid={!!errors.namaLengkap}
                />
                <FieldError message={errors.namaLengkap?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                <Input
                  id="tempatLahir"
                  {...register("tempatLahir")}
                  aria-invalid={!!errors.tempatLahir}
                />
                <FieldError message={errors.tempatLahir?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                <Input
                  id="tanggalLahir"
                  {...register("tanggalLahir")}
                  type="date"
                  aria-invalid={!!errors.tanggalLahir}
                />
                <FieldError message={errors.tanggalLahir?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Jenis Kelamin</Label>
                <Controller
                  name="jenisKelamin"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
                        <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.jenisKelamin?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="agama">Agama</Label>
                <Input
                  id="agama"
                  {...register("agama")}
                  aria-invalid={!!errors.agama}
                />
                <FieldError message={errors.agama?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                {...register("alamat")}
                aria-invalid={!!errors.alamat}
              />
              <FieldError message={errors.alamat?.message} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rt">RT</Label>
                <Input id="rt" {...register("rt")} aria-invalid={!!errors.rt} />
                <FieldError message={errors.rt?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rw">RW</Label>
                <Input id="rw" {...register("rw")} aria-invalid={!!errors.rw} />
                <FieldError message={errors.rw?.message} />
              </div>
              <div className="space-y-1.5">
                <Label>Status Kawin</Label>
                <Controller
                  name="statusKawin"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BELUM_KAWIN">Belum Kawin</SelectItem>
                        <SelectItem value="KAWIN">Kawin</SelectItem>
                        <SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem>
                        <SelectItem value="CERAI_MATI">Cerai Mati</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.statusKawin?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pekerjaan">Pekerjaan (Opsional)</Label>
              <Input
                id="pekerjaan"
                {...register("pekerjaan")}
              />
              <FieldError message={errors.pekerjaan?.message} />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <SheetFooter className="px-0">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Menyimpan..."
                  : isEdit
                    ? "Simpan Perubahan"
                    : "Tambah Warga"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}
