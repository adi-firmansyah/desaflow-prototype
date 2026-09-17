"use server";

import { Prisma, prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";
import { SuratSchema, type CreateSuratInput } from "@/lib/validations/surat";
import { parseFieldSchemas } from "@/types";
import { revalidatePath } from "next/cache";

export async function searchWarga(query: string) {
  await requireSession();
  if (!query.trim()) return [];

  return prisma.warga.findMany({
    where: {
      OR: [
        { nik: { contains: query, mode: "insensitive" } },
        { namaLengkap: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 5,
  });
}

export async function getJenisSuratList() {
  await requireSession();
  const jenisSuratList = await prisma.jenisSurat.findMany({
    orderBy: { nama: "asc" },
  });

  return jenisSuratList.map((jenisSurat) => ({
    ...jenisSurat,
    templateFields: parseFieldSchemas(jenisSurat.templateFields),
  }));
}

async function generateNomorSurat(
  tx: Prisma.TransactionClient,
  kodeFormat: string,
) {
  const year = new Date().getFullYear();
  const sequenceId = `surat-sequence-${year}-${kodeFormat}`;
  // Upsert atomic ini mencegah dua request mendapatkan nomor urut yang sama.
  const [sequence] = await tx.$queryRaw<Array<{ lastNumber: number }>>`
    INSERT INTO "surat_sequence" ("id", "year", "kodeFormat", "lastNumber")
    VALUES (${sequenceId}, ${year}, ${kodeFormat}, 1)
    ON CONFLICT ("year", "kodeFormat")
    DO UPDATE SET "lastNumber" = "surat_sequence"."lastNumber" + 1
    RETURNING "lastNumber"
  `;

  if (!sequence) {
    throw new Error("Nomor surat gagal dibuat.");
  }

  const nomorUrut = String(sequence.lastNumber).padStart(3, "0");
  return `${nomorUrut}/${kodeFormat}/${year}`;
}

export async function createSurat(params: CreateSuratInput) {
  await requireSession();
  const result = SuratSchema.safeParse(params);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Validasi gagal",
    };
  }

  const surat = await prisma.$transaction(async (tx) => {
    const jenisSurat = await tx.jenisSurat.findUniqueOrThrow({
      where: { id: result.data.jenisSuratId },
    });

    const nomorSurat = await generateNomorSurat(tx, jenisSurat.kodeFormat);

    return tx.surat.create({
      data: {
        nomorSurat,
        wargaId: result.data.wargaId,
        jenisSuratId: result.data.jenisSuratId,
        dataForm: JSON.stringify(result.data.dataForm),
        status: result.data.status,
      },
      include: { warga: true, jenisSurat: true },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/riwayat-surat");

  return surat;
}

export async function getSuratById(id: string) {
  await requireSession();
  return prisma.surat.findUnique({
    where: { id },
    include: { warga: true, jenisSurat: true },
  });
}

export async function finalisasiSurat(id: string) {
  await requireSession();
  await prisma.surat.update({
    where: { id },
    data: { status: "FINAL" },
  });
  revalidatePath(`/riwayat-surat/${id}`);
  revalidatePath("/riwayat-surat");
  revalidatePath("/dashboard");
}
