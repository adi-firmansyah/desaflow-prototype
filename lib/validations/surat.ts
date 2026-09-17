import { z } from "zod";

const FieldSchema = z.object({
  key: z.string().trim().min(1, "Key field wajib diisi."),
  label: z.string().trim().min(1, "Label field wajib diisi."),
  type: z.enum(["text", "date", "select", "textarea"], {
    error: "Tipe field tidak valid.",
  }),
  required: z.boolean(),
  placeholder: z.string().trim().optional(),
  options: z.array(z.string().trim().min(1)).optional(),
});

export const JenisSuratSchema = z.object({
  nama: z.string().trim().min(1, "Nama jenis surat wajib diisi."),
  deskripsi: z.string().trim().min(1, "Deskripsi wajib diisi."),
  icon: z.string().trim().min(1, "Ikon wajib dipilih."),
  kodeFormat: z.string().trim().min(1, "Kode format wajib diisi."),
  fields: z.array(FieldSchema),
});

export const SuratSchema = z.object({
  wargaId: z.string().trim().min(1, "Warga wajib dipilih."),
  jenisSuratId: z.string().trim().min(1, "Jenis surat wajib dipilih."),
  dataForm: z.record(z.string(), z.string()),
  status: z.enum(["DRAFT", "FINAL"], {
    error: "Status surat tidak valid.",
  }),
});

export type CreateSuratInput = z.infer<typeof SuratSchema>;
export type JenisSuratInput = z.infer<typeof JenisSuratSchema>;
