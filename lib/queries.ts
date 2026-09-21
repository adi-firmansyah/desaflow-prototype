import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/types";

export type WargaFilterOptions = {
  page?: number;
  limit?: number;
  query?: string;
  jenisKelamin?: string;
  agama?: string;
  golonganDarah?: string;
  statusPerkawinan?: string;
  statusHubunganKeluarga?: string;
  pendidikanTerakhir?: string;
  jenisPekerjaan?: string;
  kewarganegaraan?: string;
};

export async function getWargaList({
  page = 1,
  limit = 10,
  query,
  jenisKelamin,
  agama,
  golonganDarah,
  statusPerkawinan,
  statusHubunganKeluarga,
  pendidikanTerakhir,
  jenisPekerjaan,
  kewarganegaraan,
}: WargaFilterOptions) {
  const where: Prisma.WargaWhereInput = {
    ...(query
      ? {
          OR: [
            { nik: { contains: query, mode: "insensitive" as const } },
            { namaLengkap: { contains: query, mode: "insensitive" as const } },
          ],
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

  const [data, total] = await Promise.all([
    prisma.warga.findMany({
      where,
      orderBy: { namaLengkap: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.warga.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data,
    totalPages,
    currentPage: Math.min(page, totalPages),
  };
}

export async function getSuratList({
  page = 1,
  limit = 10,
  query,
}: {
  page?: number;
  limit?: number;
  query?: string;
}) {
  const where = query
    ? {
        OR: [
          { nomorSurat: { contains: query, mode: "insensitive" as const } },
          {
            warga: {
              namaLengkap: { contains: query, mode: "insensitive" as const },
            },
          },
        ],
      }
    : undefined;

  const [data, total] = await Promise.all([
    prisma.surat.findMany({
      where,
      include: { warga: true, jenisSurat: true },
      orderBy: { tanggalDibuat: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.surat.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data,
    totalPages,
    currentPage: Math.min(page, totalPages),
  };
}

export async function getJenisSuratList({
  page = 1,
  limit = 10,
  query,
}: {
  page?: number;
  limit?: number;
  query?: string;
}) {
  const where = query
    ? {
        OR: [
          { nama: { contains: query, mode: "insensitive" as const } },
          { kodeFormat: { contains: query, mode: "insensitive" as const } },
          { deskripsi: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [data, total] = await Promise.all([
    prisma.jenisSurat.findMany({
      where,
      orderBy: { nama: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.jenisSurat.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data,
    totalPages,
    currentPage: Math.min(page, totalPages),
  };
}

