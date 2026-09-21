import {
  agamaLabel,
  golonganDarahLabel,
  jenisKelaminLabel,
  jenisPekerjaanLabel,
  pendidikanTerakhirLabel,
  statusHubunganKeluargaLabel,
  statusPerkawinanLabel,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/require-session";
import type { Prisma } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

function formatDateIndo(dateInput: Date | string) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function GET(request: NextRequest) {
  const session = await getSession(request.headers);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") ?? undefined;
  const format = searchParams.get("format") ?? "xlsx";
  const mode = searchParams.get("mode") || searchParams.get("type") || "formatted";
  const isBackup = mode === "backup";

  const jenisKelamin = searchParams.get("jenisKelamin") ?? undefined;
  const agama = searchParams.get("agama") ?? undefined;
  const golonganDarah = searchParams.get("golonganDarah") ?? undefined;
  const statusPerkawinan = searchParams.get("statusPerkawinan") ?? undefined;
  const statusHubunganKeluarga = searchParams.get("statusHubunganKeluarga") ?? undefined;
  const pendidikanTerakhir = searchParams.get("pendidikanTerakhir") ?? undefined;
  const jenisPekerjaan = searchParams.get("jenisPekerjaan") ?? undefined;
  const kewarganegaraan = searchParams.get("kewarganegaraan") ?? undefined;

  const where: Prisma.WargaWhereInput = {
    ...(q
      ? {
          OR: [{ nik: { contains: q } }, { namaLengkap: { contains: q } }],
        }
      : {}),
    ...(jenisKelamin ? { jenisKelamin: jenisKelamin as any } : {}),
    ...(agama ? { agama: agama as any } : {}),
    ...(golonganDarah ? { golonganDarah: golonganDarah as any } : {}),
    ...(statusPerkawinan ? { statusPerkawinan: statusPerkawinan as any } : {}),
    ...(statusHubunganKeluarga ? { statusHubunganKeluarga: statusHubunganKeluarga as any } : {}),
    ...(pendidikanTerakhir ? { pendidikanTerakhir: pendidikanTerakhir as any } : {}),
    ...(jenisPekerjaan ? { jenisPekerjaan: jenisPekerjaan as any } : {}),
    ...(kewarganegaraan ? { kewarganegaraan: kewarganegaraan as any } : {}),
  };

  const wargaList = await prisma.warga.findMany({
    where,
    orderBy: { namaLengkap: "asc" },
  });

  const rows = isBackup
    ? wargaList.map((warga) => ({
        nik: String(warga.nik),
        noKk: String(warga.noKk),
        namaLengkap: warga.namaLengkap,
        tempatLahir: warga.tempatLahir,
        tanggalLahir: new Date(warga.tanggalLahir).toISOString().split("T")[0],
        jenisKelamin: warga.jenisKelamin,
        golonganDarah: warga.golonganDarah,
        agama: warga.agama,
        statusPerkawinan: warga.statusPerkawinan,
        statusHubunganKeluarga: warga.statusHubunganKeluarga,
        pendidikanTerakhir: warga.pendidikanTerakhir,
        jenisPekerjaan: warga.jenisPekerjaan,
        kewarganegaraan: warga.kewarganegaraan,
        namaAyah: warga.namaAyah,
        namaIbu: warga.namaIbu,
        anakKe: warga.anakKe,
        alamatKtp: warga.alamatKtp,
        alamatDomisili: warga.alamatDomisili,
        noRt: warga.noRt,
        noRw: warga.noRw,
      }))
    : wargaList.map((warga, index) => ({
        No: index + 1,
        NIK: String(warga.nik),
        "No KK": String(warga.noKk),
        "Nama Lengkap": warga.namaLengkap,
        "Tempat Lahir": warga.tempatLahir,
        "Tanggal Lahir": formatDateIndo(warga.tanggalLahir),
        "Jenis Kelamin":
          jenisKelaminLabel[warga.jenisKelamin] ?? warga.jenisKelamin,
        "Golongan Darah":
          golonganDarahLabel[warga.golonganDarah] ?? warga.golonganDarah,
        Agama: agamaLabel[warga.agama] ?? warga.agama,
        "Status Perkawinan":
          statusPerkawinanLabel[warga.statusPerkawinan] ?? warga.statusPerkawinan,
        "Status Hubungan Keluarga":
          statusHubunganKeluargaLabel[warga.statusHubunganKeluarga] ??
          warga.statusHubunganKeluarga,
        "Pendidikan Terakhir":
          pendidikanTerakhirLabel[warga.pendidikanTerakhir] ??
          warga.pendidikanTerakhir,
        "Jenis Pekerjaan":
          jenisPekerjaanLabel[warga.jenisPekerjaan] ?? warga.jenisPekerjaan,
        Kewarganegaraan: warga.kewarganegaraan,
        "Nama Ayah": warga.namaAyah,
        "Nama Ibu": warga.namaIbu,
        "Anak Ke": warga.anakKe,
        "Alamat KTP": warga.alamatKtp,
        "Alamat Domisili": warga.alamatDomisili,
        RT: warga.noRt,
        RW: warga.noRw,
      }));

  const sheetTitle = isBackup ? "Backup Data Warga" : "Laporan Data Warga";
  const worksheet = XLSX.utils.json_to_sheet(rows);

  if (isBackup) {
    worksheet["!cols"] = [
      { wch: 20 }, // nik
      { wch: 20 }, // noKk
      { wch: 25 }, // namaLengkap
      { wch: 18 }, // tempatLahir
      { wch: 15 }, // tanggalLahir
      { wch: 16 }, // jenisKelamin
      { wch: 16 }, // golonganDarah
      { wch: 24 }, // agama
      { wch: 20 }, // statusPerkawinan
      { wch: 26 }, // statusHubunganKeluarga
      { wch: 24 }, // pendidikanTerakhir
      { wch: 24 }, // jenisPekerjaan
      { wch: 16 }, // kewarganegaraan
      { wch: 20 }, // namaAyah
      { wch: 20 }, // namaIbu
      { wch: 10 }, // anakKe
      { wch: 30 }, // alamatKtp
      { wch: 30 }, // alamatDomisili
      { wch: 8 },  // noRt
      { wch: 8 },  // noRw
    ];
  } else {
    worksheet["!cols"] = [
      { wch: 6 },  // No
      { wch: 20 }, // NIK
      { wch: 20 }, // No KK
      { wch: 25 }, // Nama Lengkap
      { wch: 18 }, // Tempat Lahir
      { wch: 15 }, // Tanggal Lahir
      { wch: 15 }, // Jenis Kelamin
      { wch: 16 }, // Golongan Darah
      { wch: 22 }, // Agama
      { wch: 20 }, // Status Perkawinan
      { wch: 26 }, // Status Hubungan Keluarga
      { wch: 24 }, // Pendidikan Terakhir
      { wch: 24 }, // Jenis Pekerjaan
      { wch: 16 }, // Kewarganegaraan
      { wch: 20 }, // Nama Ayah
      { wch: 20 }, // Nama Ibu
      { wch: 10 }, // Anak Ke
      { wch: 30 }, // Alamat KTP
      { wch: 30 }, // Alamat Domisili
      { wch: 8 },  // RT
      { wch: 8 },  // RW
    ];
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

  const fileExtension = format === "csv" ? "csv" : "xlsx";
  const bookType = format === "csv" ? "csv" : "xlsx";
  const contentType =
    format === "csv"
      ? "text/csv; charset=utf-8"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const buffer = XLSX.write(workbook, { bookType, type: "buffer" });
  const dateStr = new Date().toISOString().split("T")[0];
  const filePrefix = isBackup ? "backup-data-warga" : "laporan-data-warga";
  const filename = `${filePrefix}-${dateStr}.${fileExtension}`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
