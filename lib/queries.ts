import { prisma } from "@/lib/prisma";

export async function getWargaList({
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
          { nik: { contains: query, mode: "insensitive" as const } },
          { namaLengkap: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : undefined;

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
