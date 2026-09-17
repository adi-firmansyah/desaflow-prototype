"use server";

import { prisma, Prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";
import { revalidatePath } from "next/cache";

export async function createWarga(formData: FormData) {
  await requireSession();
  const nik = formData.get("nik") as string;
  const namaLengkap = formData.get("namaLengkap") as string;
  const tempatLahir = formData.get("tempatLahir") as string;
  const tanggalLahir = formData.get("tanggalLahir") as string;
  const jenisKelamin = formData.get("jenisKelamin") as
    | "LAKI_LAKI"
    | "PEREMPUAN";
  const agama = formData.get("agama") as string;
  const alamat = formData.get("alamat") as string;
  const rt = formData.get("rt") as string;
  const rw = formData.get("rw") as string;
  const statusKawin = formData.get("statusKawin") as
    | "BELUM_KAWIN"
    | "KAWIN"
    | "CERAI_HIDUP"
    | "CERAI_MATI";
  const pekerjaan = formData.get("pekerjaan") as string;

  try {
    await prisma.warga.create({
      data: {
        nik,
        namaLengkap,
        tempatLahir,
        tanggalLahir: new Date(tanggalLahir),
        jenisKelamin,
        agama,
        alamat,
        rt,
        rw,
        statusKawin,
        pekerjaan: pekerjaan || null,
      },
    });
    revalidatePath("/data-warga");
    return { success: true };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "NIK sudah terdaftar. Gunakan NIK yang berbeda.",
      };
    }
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function updateWarga(id: string, formData: FormData) {
  await requireSession();
  const nik = formData.get("nik") as string;
  const namaLengkap = formData.get("namaLengkap") as string;
  const tempatLahir = formData.get("tempatLahir") as string;
  const tanggalLahir = formData.get("tanggalLahir") as string;
  const jenisKelamin = formData.get("jenisKelamin") as
    | "LAKI_LAKI"
    | "PEREMPUAN";
  const agama = formData.get("agama") as string;
  const alamat = formData.get("alamat") as string;
  const rt = formData.get("rt") as string;
  const rw = formData.get("rw") as string;
  const statusKawin = formData.get("statusKawin") as
    | "BELUM_KAWIN"
    | "KAWIN"
    | "CERAI_HIDUP"
    | "CERAI_MATI";
  const pekerjaan = formData.get("pekerjaan") as string;

  try {
    await prisma.warga.update({
      where: { id },
      data: {
        nik,
        namaLengkap,
        tempatLahir,
        tanggalLahir: new Date(tanggalLahir),
        jenisKelamin,
        agama,
        alamat,
        rt,
        rw,
        statusKawin,
        pekerjaan: pekerjaan || null,
      },
    });
    revalidatePath("/data-warga");
    return { success: true };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "NIK sudah terdaftar. Gunakan NIK yang berbeda.",
      };
    }
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function deleteWarga(id: string) {
  await requireSession();
  await prisma.warga.delete({ where: { id } });
  revalidatePath("/data-warga");
}
