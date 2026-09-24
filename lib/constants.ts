import {
  BabyIcon,
  BriefcaseIcon,
  CarIcon,
  ChurchIcon,
  CoinsIcon,
  EllipsisIcon,
  FileTextIcon,
  GraduationCapIcon,
  HeartHandshakeIcon,
  HeartIcon,
  HomeIcon,
  IdCardIcon,
  LandPlotIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { ElementType } from "react";

export const statusSuratLabel: Record<string, string> = {
  DRAFT: "Draft",
  FINAL: "Final",
};

export const statusPerkawinanLabel: Record<string, string> = {
  BELUM_KAWIN: "Belum Kawin",
  KAWIN: "Kawin",
  CERAI_HIDUP: "Cerai Hidup",
  CERAI_MATI: "Cerai Mati",
};

export const jenisKelaminLabel: Record<string, string> = {
  LAKI_LAKI: "Laki-laki",
  PEREMPUAN: "Perempuan",
};

export const golonganDarahLabel: Record<string, string> = {
  A: "A",
  B: "B",
  AB: "AB",
  O: "O",
  TIDAK_TAHU: "Tidak Tahu",
};

export const agamaLabel: Record<string, string> = {
  ISLAM: "Islam",
  KRISTEN_PROTESTAN: "Kristen Protestan",
  KATOLIK: "Katolik",
  HINDU: "Hindu",
  BUDDHA: "Buddha",
  KHONGHUCU: "Khonghucu",
  PENGHAYAT_KEPERCAYAAN: "Penghayat Kepercayaan",
};

export const statusHubunganKeluargaLabel: Record<string, string> = {
  KEPALA_KELUARGA: "Kepala Keluarga",
  SUAMI: "Suami",
  ISTRI: "Istri",
  ANAK: "Anak",
  MENANTU: "Menantu",
  CUCU: "Cucu",
  ORANG_TUA: "Orang Tua",
  MERTUA: "Mertua",
  FAMILI_LAIN: "Famili Lain",
  PEMBANTU: "Pembantu",
  LAINNYA: "Lainnya",
};

export const pendidikanTerakhirLabel: Record<string, string> = {
  TIDAK_BELUM_SEKOLAH: "Tidak/Belum Sekolah",
  BELUM_TAMAT_SD: "Belum Tamat SD",
  TAMAT_SD: "Tamat SD",
  SLTP: "SLTP/Sederajat",
  SLTA: "SLTA/Sederajat",
  DIPLOMA_I_II: "Diploma I/II",
  DIPLOMA_III: "Diploma III",
  DIPLOMA_IV_STRATA_I: "Diploma IV/Strata I",
  STRATA_II: "Strata II",
  STRATA_III: "Strata III",
};

export const jenisPekerjaanLabel: Record<string, string> = {
  BELUM_TIDAK_BEKERJA: "Belum/Tidak Bekerja",
  MENGURUS_RUMAH_TANGGA: "Mengurus Rumah Tangga",
  PELAJAR_MAHASISWA: "Pelajar/Mahasiswa",
  PENSIUNAN: "Pensiunan",
  PEGAWAI_NEGERI_SIPIL: "PNS",
  TNI: "TNI",
  POLRI: "POLRI",
  KARYAWAN_SWASTA: "Karyawan Swasta",
  WIRASWASTA: "Wiraswasta",
  BURUH_HARIAN_LEPAS: "Buruh Harian Lepas",
  LAINNYA: "Lainnya",
};

export const kewarganegaraanLabel: Record<string, string> = {
  WNI: "WNI",
  WNA: "WNA",
};

export const suratStatusColor: Record<string, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  FINAL: "bg-green-100 text-green-700",
};

export const statusColor = suratStatusColor;

export const iconMap: Record<string, ElementType> = {
  church: ChurchIcon,
  users: UsersIcon,
  user: UserIcon,
  "user-check": UserCheckIcon,
  briefcase: BriefcaseIcon,
  "map-pin": MapPinIcon,
  home: HomeIcon,
  "heart-handshake": HeartHandshakeIcon,
  baby: BabyIcon,
  heart: HeartIcon,
  "shield-check": ShieldCheckIcon,
  "graduation-cap": GraduationCapIcon,
  car: CarIcon,
  "land-plot": LandPlotIcon,
  coins: CoinsIcon,
  "id-card": IdCardIcon,
  "file-text": FileTextIcon,
  ellipsis: EllipsisIcon,
};

export const iconOptions = [
  { value: "church", label: "Gereja (Kematian)" },
  { value: "users", label: "Orang Banyak (Status Kawin)" },
  { value: "user", label: "Orang (Individu)" },
  { value: "user-check", label: "Orang Tercentang (Verifikasi)" },
  { value: "briefcase", label: "Koper (Usaha)" },
  { value: "map-pin", label: "Pin Lokasi (Domisili)" },
  { value: "home", label: "Rumah (Tempat Tinggal)" },
  { value: "heart-handshake", label: "Bantuan (Tidak Mampu)" },
  { value: "baby", label: "Bayi (Kelahiran)" },
  { value: "heart", label: "Hati (Pernikahan)" },
  { value: "shield-check", label: "Perisai (Catatan Kepolisian)" },
  { value: "graduation-cap", label: "Topi Wisuda (Pendidikan)" },
  { value: "car", label: "Mobil (Kendaraan)" },
  { value: "land-plot", label: "Bidang Tanah (Kepemilikan Lahan)" },
  { value: "coins", label: "Koin (Keuangan/Pajak)" },
  { value: "id-card", label: "Kartu Identitas" },
  { value: "file-text", label: "Dokumen Umum" },
  { value: "ellipsis", label: "Titik Tiga (Lainnya)" },
];
