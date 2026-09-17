import { z } from "zod";

export const WargaSchema = z.object({
  nik: z.string().regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka."),
  namaLengkap: z.string().trim().min(1, "Nama lengkap wajib diisi."),
  tempatLahir: z.string().trim().min(1, "Tempat lahir wajib diisi."),
  tanggalLahir: z.coerce.date({
    error: "Tanggal lahir tidak valid.",
  }),
  jenisKelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"], {
    error: "Jenis kelamin wajib dipilih.",
  }),
  agama: z.string().trim().min(1, "Agama wajib diisi."),
  alamat: z.string().trim().min(1, "Alamat wajib diisi."),
  rt: z.string().trim().min(1, "RT wajib diisi."),
  rw: z.string().trim().min(1, "RW wajib diisi."),
  statusKawin: z.enum(
    ["BELUM_KAWIN", "KAWIN", "CERAI_HIDUP", "CERAI_MATI"],
    {
      error: "Status kawin wajib dipilih.",
    },
  ),
  pekerjaan: z.string().trim().nullable(),
});

export type WargaInput = z.infer<typeof WargaSchema>;
