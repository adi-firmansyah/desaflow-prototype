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
import type { JenisSurat, Warga } from "./buat-surat-wizard";

type FieldSchema = {
  key: string;
  label: string;
  type: "text" | "date" | "select" | "textarea";
  required: boolean;
  placeholder?: string;
  options?: string[];
};

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
  const fields: FieldSchema[] = JSON.parse(jenisSurat.templateFields);

  const requiredFieldsFilled = fields
    .filter((f) => f.required)
    .every((f) => formData[f.key]?.trim());

  function setField(key: string, value: string) {
    onChange({ ...formData, [key]: value });
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
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-sm font-medium mb-1.5 block">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>

                {field.type === "textarea" ? (
                  <Textarea
                    value={formData[field.key] ?? ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={
                      field.placeholder ??
                      "Masukkan detail tambahan jika diperlukan..."
                    }
                    rows={4}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={formData[field.key] ?? ""}
                    onValueChange={(val) => setField(field.key, val ?? "")}
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
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.key] ?? ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Pilih Jenis Surat
        </Button>
        <Button onClick={onNext} disabled={!requiredFieldsFilled}>
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
