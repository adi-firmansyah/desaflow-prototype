import { statusLabel } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") ?? undefined;
  const format = searchParams.get("format") ?? "xlsx";

  const wargaList = await prisma.warga.findMany({
    where: q
      ? {
          OR: [{ nik: { contains: q } }, { namaLengkap: { contains: q } }],
        }
      : undefined,
    orderBy: { namaLengkap: "asc" },
  });

  const rows = wargaList.map((warga) => ({
    NIK: warga.nik,
    "Nama Lengkap": warga.namaLengkap,
    "Tempat Lahir": warga.tempatLahir,
    "Tanggal Lahir": new Date(warga.tanggalLahir).toLocaleDateString("id-ID"),
    "Jenis Kelamin":
      warga.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan",
    Agama: warga.agama,
    Alamat: warga.alamat,
    RT: warga.rt,
    RW: warga.rw,
    "Status Kawin": statusLabel[warga.statusKawin],
    Pekerjaan: warga.pekerjaan ?? "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Warga");

  const fileExtension = format === "csv" ? "csv" : "xlsx";
  const bookType = format === "csv" ? "csv" : "xlsx";
  const contentType =
    format === "csv"
      ? "text/csv"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const buffer = XLSX.write(workbook, { bookType, type: "buffer" });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="data-warga.${fileExtension}"`,
    },
  });
}
