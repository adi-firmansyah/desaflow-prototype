"use client";

import type { FieldSchema } from "@/app/(dashboard)/jenis-surat/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Trash2Icon } from "lucide-react";

export function FieldBuilder({
  fields,
  onChange,
}: {
  fields: FieldSchema[];
  onChange: (fields: FieldSchema[]) => void;
}) {
  function addField() {
    onChange([
      ...fields,
      { key: `field_${Date.now()}`, label: "", type: "text", required: true },
    ]);
  }

  function updateField(index: number, updated: Partial<FieldSchema>) {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updated };
    onChange(newFields);
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index));
  }

  function updateOptions(index: number, optionsText: string) {
    const options = optionsText
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    updateField(index, { options });
  }

  return (
    <div className="space-y-3">
      {fields.length === 0 && (
        <p className="text-sm text-neutral-500 text-center py-6 border rounded-md border-dashed">
          Belum ada field. Klik &quot;Tambah Field&quot; untuk mulai.
        </p>
      )}

      {fields.map((field, index) => (
        <div key={field.key} className="border rounded-md p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Label Field
                </label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    updateField(index, { label: e.target.value })
                  }
                  placeholder="Contoh: Tanggal Kematian"
                  className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block">
                    Tipe Input
                  </label>
                  <Select
                    value={field.type}
                    onValueChange={(val) =>
                      updateField(index, { type: val as FieldSchema["type"] })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Teks Pendek</SelectItem>
                      <SelectItem value="textarea">Teks Panjang</SelectItem>
                      <SelectItem value="date">Tanggal</SelectItem>
                      <SelectItem value="select">Pilihan (Dropdown)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end pb-1.5">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        updateField(index, { required: e.target.checked })
                      }
                    />
                    Wajib diisi
                  </label>
                </div>
              </div>

              {field.type === "select" && (
                <div>
                  <label className="text-xs font-medium mb-1 block">
                    Pilihan (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={field.options?.join(", ") ?? ""}
                    onChange={(e) => updateOptions(index, e.target.value)}
                    placeholder="Contoh: Sakit, Kecelakaan, Usia Lanjut"
                    className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </div>
              )}

              {(field.type === "text" || field.type === "textarea") && (
                <div>
                  <label className="text-xs font-medium mb-1 block">
                    Placeholder (Opsional)
                  </label>
                  <input
                    type="text"
                    value={field.placeholder ?? ""}
                    onChange={(e) =>
                      updateField(index, { placeholder: e.target.value })
                    }
                    placeholder="Contoh: Masukkan detail..."
                    className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeField(index)}
              className="text-neutral-400 hover:text-red-500 transition-colors mt-1"
            >
              <Trash2Icon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addField}
        className="w-full"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Tambah Field
      </Button>
    </div>
  );
}
