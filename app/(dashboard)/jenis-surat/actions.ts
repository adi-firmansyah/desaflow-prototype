"use server";

import { prisma, Prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";
import {
  JenisSuratSchema,
  type JenisSuratInput,
} from "@/lib/validations/surat";
import { revalidatePath } from "next/cache";

export async function createJenisSurat(data: JenisSuratInput) {
  await requireSession();
  const result = JenisSuratSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Validasi gagal",
    };
  }

  try {
    await prisma.jenisSurat.create({
      data: {
        nama: result.data.nama,
        deskripsi: result.data.deskripsi,
        icon: result.data.icon,
        kodeFormat: result.data.kodeFormat,
        templateFields: JSON.stringify(result.data.fields),
      },
    });
    revalidatePath("/jenis-surat");
    revalidatePath("/buat-surat");
    return { success: true };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, message: "Nama jenis surat sudah digunakan." };
    }
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function updateJenisSurat(
  id: string,
  data: JenisSuratInput,
) {
  await requireSession();
  const result = JenisSuratSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Validasi gagal",
    };
  }

  try {
    await prisma.jenisSurat.update({
      where: { id },
      data: {
        nama: result.data.nama,
        deskripsi: result.data.deskripsi,
        icon: result.data.icon,
        kodeFormat: result.data.kodeFormat,
        templateFields: JSON.stringify(result.data.fields),
      },
    });
    revalidatePath("/jenis-surat");
    revalidatePath("/buat-surat");
    return { success: true };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, message: "Nama jenis surat sudah digunakan." };
    }
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function deleteJenisSurat(id: string) {
  await requireSession();
  const jumlahSurat = await prisma.surat.count({ where: { jenisSuratId: id } });

  if (jumlahSurat > 0) {
    return {
      success: false,
      message: `Tidak dapat dihapus. Ada ${jumlahSurat} surat yang menggunakan jenis surat ini.`,
    };
  }

  await prisma.jenisSurat.delete({ where: { id } });
  revalidatePath("/jenis-surat");
  revalidatePath("/buat-surat");
  return { success: true };
}
