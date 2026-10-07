import { z } from "zod";

export const WargaSchema = z.object({
  nik: z.string().regex(/^\d{16}$/, "NIK harus terdiri dari 16 digit angka."),
  noKk: z.string().regex(/^\d{16}$/, "No KK harus terdiri dari 16 digit angka."),
  namaLengkap: z.string().trim().min(1, "Nama lengkap wajib diisi."),
  tempatLahir: z.string().trim().min(1, "Tempat lahir wajib diisi."),
  tanggalLahir: z.coerce.date({
    error: "Tanggal lahir tidak valid.",
  }),
  jenisKelamin: z.enum(["LAKI_LAKI", "PEREMPUAN"], {
    error: "Jenis kelamin wajib dipilih.",
  }),
  golonganDarah: z.enum(["A", "B", "AB", "O", "TIDAK_TAHU"], {
    error: "Golongan darah wajib dipilih.",
  }),
  agama: z.enum([
    "ISLAM",
    "KRISTEN_PROTESTAN",
    "KATOLIK",
    "HINDU",
    "BUDDHA",
    "KHONGHUCU",
    "PENGHAYAT_KEPERCAYAAN",
  ], {
    error: "Agama wajib dipilih.",
  }),
  statusPerkawinan: z.enum(
    ["BELUM_KAWIN", "KAWIN", "CERAI_HIDUP", "CERAI_MATI"],
    {
      error: "Status perkawinan wajib dipilih.",
    },
  ),
  statusHubunganKeluarga: z.enum([
    "KEPALA_KELUARGA",
    "SUAMI",
    "ISTRI",
    "ANAK",
    "MENANTU",
    "CUCU",
    "ORANG_TUA",
    "MERTUA",
    "FAMILI_LAIN",
    "PEMBANTU",
    "LAINNYA"
  ], {
    error: "Status hubungan keluarga wajib dipilih.",
  }),
  pendidikanTerakhir: z.enum([
    "TIDAK_BELUM_SEKOLAH",
    "BELUM_TAMAT_SD",
    "TAMAT_SD",
    "SLTP",
    "SLTA",
    "DIPLOMA_I_II",
    "DIPLOMA_III",
    "DIPLOMA_IV_STRATA_I",
    "STRATA_II",
    "STRATA_III"
  ], {
    error: "Pendidikan terakhir wajib dipilih.",
  }),
  jenisPekerjaan: z.enum([
    "BELUM_TIDAK_BEKERJA",
    "MENGURUS_RUMAH_TANGGA",
    "PELAJAR_MAHASISWA",
    "PENSIUNAN",
    "PEGAWAI_NEGERI_SIPIL",
    "TNI",
    "POLRI",
    "KARYAWAN_SWASTA",
    "WIRASWASTA",
    "BURUH_HARIAN_LEPAS",
    "LAINNYA"
  ], {
    error: "Jenis pekerjaan wajib dipilih.",
  }),
  kewarganegaraan: z.enum(["WNI", "WNA"], {
    error: "Kewarganegaraan wajib dipilih.",
  }),
  namaAyah: z.string().trim().min(1, "Nama Ayah wajib diisi."),
  namaIbu: z.string().trim().min(1, "Nama Ibu wajib diisi."),
  anakKe: z.coerce.number().min(1, "Anak ke- wajib diisi."),
  alamatKtp: z.string().trim().min(1, "Alamat KTP wajib diisi."),
  alamatDomisili: z.string().trim().min(1, "Alamat domisili wajib diisi."),
  noRt: z.string().trim().min(1, "RT wajib diisi."),
  noRw: z.string().trim().min(1, "RW wajib diisi."),
});

export type WargaInput = z.infer<typeof WargaSchema>;
