"use client";

import {
  createJenisSurat,
  updateJenisSurat,
} from "@/app/(dashboard)/jenis-surat/actions";
import { Button } from "@/components/ui/button";
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
import { iconOptions } from "@/lib/constants";
import {
  JenisSuratSchema,
  type JenisSuratInput,
} from "@/lib/validations/surat";
import type { FieldSchema, JenisSurat } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { FieldBuilder } from "./field-builder";

export function JenisSuratFormDialog({
  jenisSurat,
  trigger,
}: {
  jenisSurat?: JenisSurat;
  trigger: React.ReactNode;
}) {
  const isEdit = !!jenisSurat;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldSchema[]>(
    jenisSurat?.templateFields ?? [],
  );
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<JenisSuratInput>({
    resolver: zodResolver(JenisSuratSchema),
    defaultValues: {
      nama: jenisSurat?.nama ?? "",
      deskripsi: jenisSurat?.deskripsi ?? "",
      icon: jenisSurat?.icon ?? "church",
      kodeFormat: jenisSurat?.kodeFormat ?? "",
      fields: jenisSurat?.templateFields ?? [],
    },
  });

  function resetForm() {
    const defaultValues = {
      nama: jenisSurat?.nama ?? "",
      deskripsi: jenisSurat?.deskripsi ?? "",
      icon: jenisSurat?.icon ?? "church",
      kodeFormat: jenisSurat?.kodeFormat ?? "",
      fields: jenisSurat?.templateFields ?? [],
    };
    reset(defaultValues);
    setFields(defaultValues.fields);
    setError(null);
  }

  async function onSubmit(values: JenisSuratInput) {
    setError(null);
    setValue("fields", fields, { shouldValidate: true });
    const payload = {
      ...values,
      kodeFormat: values.kodeFormat.toUpperCase(),
      fields,
    };

    const result = isEdit
      ? await updateJenisSurat(jenisSurat.id, payload)
      : await createJenisSurat(payload);

    if (!result.success) {
      setError(result.message ?? "Terjadi kesalahan.");
      if (result.errors) {
        const fieldMessage = result.errors.fields?.[0];
        if (fieldMessage) {
          setFieldError("fields", {
            type: "server",
            message: fieldMessage,
          });
        }
      }
      return;
    }

    setOpen(false);
    if (!isEdit) resetForm();
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) resetForm();
      }}
    >
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <SheetContent className="data-[side=right]:sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Edit Jenis Surat" : "Tambah Jenis Surat Baru"}
          </SheetTitle>
        </SheetHeader>

        {open && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-4 pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 justify-between">
                <Label>Nama Jenis Surat</Label>
                <input
                  type="text"
                  {...register("nama")}
                  placeholder="Contoh: Surat Keterangan Pindah"
                  aria-invalid={!!errors.nama}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
                <FieldError message={errors.nama?.message} />
              </div>
              <div className="flex flex-col gap-1.5 justify-between">
                <Label>Kode Format (untuk nomor surat)</Label>
                <input
                  type="text"
                  {...register("kodeFormat")}
                  placeholder="Contoh: SKP"
                  maxLength={6}
                  aria-invalid={!!errors.kodeFormat}
                  className="w-full px-3 py-2 border rounded-md text-sm uppercase focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
                <FieldError message={errors.kodeFormat?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Deskripsi</Label>
              <textarea
                {...register("deskripsi")}
                placeholder="Jelaskan singkat kegunaan surat ini..."
                aria-invalid={!!errors.deskripsi}
                rows={2}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
              <FieldError message={errors.deskripsi?.message} />
            </div>

            <div className="space-y-1.5">
              <Label>Ikon</Label>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
              <FieldError message={errors.icon?.message} />
            </div>

            <div className="space-y-1.5">
              <Label>Field Detail Surat</Label>
              <p className="text-xs text-neutral-500 mb-2">
                Field ini akan muncul di form saat petugas mengisi detail surat.
              </p>
              <FieldBuilder
                fields={fields}
                onChange={(nextFields) => {
                  setFields(nextFields);
                  setValue("fields", nextFields, { shouldValidate: true });
                }}
              />
              <FieldError
                message={
                  errors.fields?.message ??
                  errors.fields?.root?.message
                }
              />
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
                    : "Tambah Jenis Surat"}
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
