"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";

export async function globalSearch(query: string) {
  await requireSession();
  if (!query.trim() || query.trim().length < 2) {
    return { warga: [], surat: [] };
  }

  const [warga, surat] = await Promise.all([
    prisma.warga.findMany({
      where: {
        OR: [
          { nik: { contains: query, mode: "insensitive" } },
          { namaLengkap: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
    prisma.surat.findMany({
      where: {
        OR: [
          { nomorSurat: { contains: query, mode: "insensitive" } },
          { warga: { namaLengkap: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: { warga: true, jenisSurat: true },
      take: 5,
    }),
  ]);

  return { warga, surat };
}
