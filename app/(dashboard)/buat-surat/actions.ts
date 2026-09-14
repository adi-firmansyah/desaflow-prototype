"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function searchWarga(query: string) {
  if (!query.trim()) return [];

  return prisma.warga.findMany({
    where: {
      OR: [{ nik: { contains: query } }, { namaLengkap: { contains: query } }],
    },
    take: 5,
  });
}

export async function getJenisSuratList() {
  return prisma.jenisSurat.findMany({ orderBy: { nama: "asc" } });
}

async function generateNomorSurat(kodeFormat: string) {
  const year = new Date().getFullYear();
  const count = await prisma.surat.count({
    where: { nomorSurat: { endsWith: `/${kodeFormat}/${year}` } },
  });
  const nomorUrut = String(count + 1).padStart(3, "0");
  return `${nomorUrut}/${kodeFormat}/${year}`;
}

export async function createSurat(params: {
  wargaId: string;
  jenisSuratId: string;
  dataForm: Record<string, string>;
  status: "DRAFT" | "FINAL";
}) {
  const jenisSurat = await prisma.jenisSurat.findUniqueOrThrow({
    where: { id: params.jenisSuratId },
  });

  const nomorSurat = await generateNomorSurat(jenisSurat.kodeFormat);

  const surat = await prisma.surat.create({
    data: {
      nomorSurat,
      wargaId: params.wargaId,
      jenisSuratId: params.jenisSuratId,
      dataForm: JSON.stringify(params.dataForm),
      status: params.status,
    },
    include: { warga: true, jenisSurat: true },
  });

  revalidatePath("/dashboard");
  revalidatePath("/riwayat-surat");

  return surat;
}

export async function getSuratById(id: string) {
  return prisma.surat.findUnique({
    where: { id },
    include: { warga: true, jenisSurat: true },
  });
}

export async function finalisasiSurat(id: string) {
  await prisma.surat.update({
    where: { id },
    data: { status: "FINAL" },
  });
  revalidatePath(`/riwayat-surat/${id}`);
  revalidatePath("/riwayat-surat");
  revalidatePath("/dashboard");
}
