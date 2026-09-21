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
      noKk: warga?.noKk ?? "",
      namaLengkap: warga?.namaLengkap ?? "",
      tempatLahir: warga?.tempatLahir ?? "",
      tanggalLahir: warga?.tanggalLahir
        ? new Date(warga.tanggalLahir).toISOString().split("T")[0]
        : "",
      jenisKelamin: warga?.jenisKelamin ?? "LAKI_LAKI",
      golonganDarah: warga?.golonganDarah ?? "TIDAK_TAHU",
      agama: warga?.agama ?? "ISLAM",
      statusPerkawinan: warga?.statusPerkawinan ?? "BELUM_KAWIN",
      statusHubunganKeluarga: warga?.statusHubunganKeluarga ?? "KEPALA_KELUARGA",
      pendidikanTerakhir: warga?.pendidikanTerakhir ?? "SLTA",
      jenisPekerjaan: warga?.jenisPekerjaan ?? "LAINNYA",
      kewarganegaraan: warga?.kewarganegaraan ?? "WNI",
      namaAyah: warga?.namaAyah ?? "",
      namaIbu: warga?.namaIbu ?? "",
      anakKe: warga?.anakKe ?? 1,
      alamatKtp: warga?.alamatKtp ?? "",
      alamatDomisili: warga?.alamatDomisili ?? "",
      noRt: warga?.noRt ?? "",
      noRw: warga?.noRw ?? "",
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

      <SheetContent className="data-[side=right]:sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Edit Data Warga" : "Tambah Warga Baru"}
          </SheetTitle>
        </SheetHeader>

        {open && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 px-4 pb-4 mt-4"
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
                <Label htmlFor="noKk">No KK</Label>
                <Input
                  id="noKk"
                  {...register("noKk")}
                  aria-invalid={!!errors.noKk}
                  maxLength={16}
                />
                <FieldError message={errors.noKk?.message} />
              </div>
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

            <div className="grid grid-cols-3 gap-4">
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
                <Label>Golongan Darah</Label>
                <Controller
                  name="golonganDarah"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                        <SelectItem value="TIDAK_TAHU">Tidak Tahu</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.golonganDarah?.message} />
              </div>
              <div className="space-y-1.5">
                <Label>Agama</Label>
                <Controller
                  name="agama"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ISLAM">Islam</SelectItem>
                        <SelectItem value="KRISTEN_PROTESTAN">Kristen Protestan</SelectItem>
                        <SelectItem value="KATOLIK">Katolik</SelectItem>
                        <SelectItem value="HINDU">Hindu</SelectItem>
                        <SelectItem value="BUDDHA">Buddha</SelectItem>
                        <SelectItem value="KHONGHUCU">Khonghucu</SelectItem>
                        <SelectItem value="PENGHAYAT_KEPERCAYAAN">Penghayat Kepercayaan</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.agama?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <Label>Status Perkawinan</Label>
                <Controller
                  name="statusPerkawinan"
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
                <FieldError message={errors.statusPerkawinan?.message} />
              </div>
              <div className="space-y-1.5">
                <Label>Status Hub. Keluarga</Label>
                <Controller
                  name="statusHubunganKeluarga"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KEPALA_KELUARGA">Kepala Keluarga</SelectItem>
                        <SelectItem value="SUAMI">Suami</SelectItem>
                        <SelectItem value="ISTRI">Istri</SelectItem>
                        <SelectItem value="ANAK">Anak</SelectItem>
                        <SelectItem value="MENANTU">Menantu</SelectItem>
                        <SelectItem value="CUCU">Cucu</SelectItem>
                        <SelectItem value="ORANG_TUA">Orang Tua</SelectItem>
                        <SelectItem value="MERTUA">Mertua</SelectItem>
                        <SelectItem value="FAMILI_LAIN">Famili Lain</SelectItem>
                        <SelectItem value="PEMBANTU">Pembantu</SelectItem>
                        <SelectItem value="LAINNYA">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.statusHubunganKeluarga?.message} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Pendidikan Terakhir</Label>
                <Controller
                  name="pendidikanTerakhir"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TIDAK_BELUM_SEKOLAH">Tidak/Belum Sekolah</SelectItem>
                        <SelectItem value="BELUM_TAMAT_SD">Belum Tamat SD</SelectItem>
                        <SelectItem value="TAMAT_SD">Tamat SD</SelectItem>
                        <SelectItem value="SLTP">SLTP/Sederajat</SelectItem>
                        <SelectItem value="SLTA">SLTA/Sederajat</SelectItem>
                        <SelectItem value="DIPLOMA_I_II">Diploma I/II</SelectItem>
                        <SelectItem value="DIPLOMA_III">Diploma III</SelectItem>
                        <SelectItem value="DIPLOMA_IV_STRATA_I">Diploma IV/Strata I</SelectItem>
                        <SelectItem value="STRATA_II">Strata II</SelectItem>
                        <SelectItem value="STRATA_III">Strata III</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.pendidikanTerakhir?.message} />
              </div>
               <div className="space-y-1.5">
                <Label>Jenis Pekerjaan</Label>
                <Controller
                  name="jenisPekerjaan"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BELUM_TIDAK_BEKERJA">Belum/Tidak Bekerja</SelectItem>
                        <SelectItem value="MENGURUS_RUMAH_TANGGA">Mengurus Rumah Tangga</SelectItem>
                        <SelectItem value="PELAJAR_MAHASISWA">Pelajar/Mahasiswa</SelectItem>
                        <SelectItem value="PENSIUNAN">Pensiunan</SelectItem>
                        <SelectItem value="PEGAWAI_NEGERI_SIPIL">PNS</SelectItem>
                        <SelectItem value="TNI">TNI</SelectItem>
                        <SelectItem value="POLRI">POLRI</SelectItem>
                        <SelectItem value="KARYAWAN_SWASTA">Karyawan Swasta</SelectItem>
                        <SelectItem value="WIRASWASTA">Wiraswasta</SelectItem>
                        <SelectItem value="BURUH_HARIAN_LEPAS">Buruh Harian Lepas</SelectItem>
                        <SelectItem value="LAINNYA">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.jenisPekerjaan?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Kewarganegaraan</Label>
              <Controller
                name="kewarganegaraan"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WNI">WNI</SelectItem>
                      <SelectItem value="WNA">WNA</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.kewarganegaraan?.message} />
            </div>

            <div className="grid grid-cols-3 gap-4">
               <div className="space-y-1.5">
                <Label htmlFor="namaAyah">Nama Ayah</Label>
                <Input
                  id="namaAyah"
                  {...register("namaAyah")}
                  aria-invalid={!!errors.namaAyah}
                />
                <FieldError message={errors.namaAyah?.message} />
              </div>
               <div className="space-y-1.5">
                <Label htmlFor="namaIbu">Nama Ibu</Label>
                <Input
                  id="namaIbu"
                  {...register("namaIbu")}
                  aria-invalid={!!errors.namaIbu}
                />
                <FieldError message={errors.namaIbu?.message} />
              </div>
               <div className="space-y-1.5">
                <Label htmlFor="anakKe">Anak Ke-</Label>
                <Input
                  id="anakKe"
                  type="number"
                  {...register("anakKe")}
                  aria-invalid={!!errors.anakKe}
                />
                <FieldError message={errors.anakKe?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alamatKtp">Alamat KTP</Label>
              <Input
                id="alamatKtp"
                {...register("alamatKtp")}
                aria-invalid={!!errors.alamatKtp}
              />
              <FieldError message={errors.alamatKtp?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="alamatDomisili">Alamat Domisili</Label>
              <Input
                id="alamatDomisili"
                {...register("alamatDomisili")}
                aria-invalid={!!errors.alamatDomisili}
              />
              <FieldError message={errors.alamatDomisili?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="noRt">RT</Label>
                <Input id="noRt" {...register("noRt")} aria-invalid={!!errors.noRt} />
                <FieldError message={errors.noRt?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="noRw">RW</Label>
                <Input id="noRw" {...register("noRw")} aria-invalid={!!errors.noRw} />
                <FieldError message={errors.noRw?.message} />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <SheetFooter className="px-0 pt-4">
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
