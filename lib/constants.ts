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

export const statusLabel: Record<string, string> = {
  BELUM_KAWIN: "Belum Kawin",
  KAWIN: "Kawin",
  CERAI_HIDUP: "Cerai Hidup",
  CERAI_MATI: "Cerai Mati",
  DRAFT: "Draft",
  FINAL: "Final",
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
