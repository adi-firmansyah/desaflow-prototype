"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { JenisSurat, Warga } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMemo } from "react";
import { z } from "zod";

export function StepLengkapiForm({
  warga,
  jenisSurat,
  formData,
  onChange,
  onBack,
  onNext,
}: {
  warga: Warga;
  jenisSurat: JenisSurat;
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const fields = jenisSurat.templateFields;
  const formSchema = useMemo(
    () =>
      z.record(z.string(), z.string()).superRefine((values, ctx) => {
        fields.forEach((field) => {
          if (field.required && !values[field.key]?.trim()) {
            ctx.addIssue({
              code: "custom",
              path: [field.key],
              message: `${field.label} wajib diisi.`,
            });
          }
        });
      }),
    [fields],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  function onSubmit(values: Record<string, string>) {
    onChange(values);
    onNext();
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Data Pemohon</h2>
          <div className="space-y-4 text-sm">
            <ReadOnlyField label="Nama Lengkap" value={warga.namaLengkap} />
            <ReadOnlyField label="NIK" value={warga.nik} />
            <ReadOnlyField
              label="Tempat, Tanggal Lahir"
              value={`${warga.tempatLahir}, ${new Date(
                warga.tanggalLahir,
              ).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`}
            />
            <div className="grid grid-cols-2 gap-4">
              <ReadOnlyField
                label="Jenis Kelamin"
                value={
                  warga.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"
                }
              />
              <ReadOnlyField label="Agama" value={warga.agama} />
            </div>
            <ReadOnlyField
              label="Alamat"
              value={`${warga.alamat}, RT ${warga.rt}/RW ${warga.rw}`}
            />
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">
            Detail {jenisSurat.nama}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-sm font-medium mb-1.5 block">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>

                {field.type === "textarea" ? (
                  <Textarea
                    {...register(field.key)}
                    aria-invalid={!!errors[field.key]}
                    placeholder={
                      field.placeholder ??
                      "Masukkan detail tambahan jika diperlukan..."
                    }
                    rows={4}
                  />
                ) : field.type === "select" ? (
                  <Controller
                    name={field.key}
                    control={control}
                    render={({ field: controllerField }) => (
                  <Select
                    value={controllerField.value ?? ""}
                    onValueChange={(val) => controllerField.onChange(val ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={`Pilih ${field.label.toLowerCase()}...`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    )}
                  />
                ) : (
                  <input
                    type={field.type}
                    {...register(field.key)}
                    aria-invalid={!!errors[field.key]}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                )}
                {errors[field.key]?.message && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[field.key]?.message}
                  </p>
                )}
              </div>
            ))}
          </form>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Pilih Jenis Surat
        </Button>
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          👁 Preview Surat
        </Button>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-500 mb-1">{label}</p>
      <div className="px-3 py-2 bg-neutral-50 border rounded-md text-neutral-700">
        {value}
      </div>
    </div>
  );
}
