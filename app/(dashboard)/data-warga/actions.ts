"use server";

import { prisma, Prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";
import { WargaSchema } from "@/lib/validations/warga";
import { revalidatePath } from "next/cache";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseWargaInput(formData: FormData) {
  return {
    nik: getText(formData, "nik"),
    noKk: getText(formData, "noKk"),
    namaLengkap: getText(formData, "namaLengkap"),
    tempatLahir: getText(formData, "tempatLahir"),
    tanggalLahir: getText(formData, "tanggalLahir"),
    jenisKelamin: getText(formData, "jenisKelamin"),
    golonganDarah: getText(formData, "golonganDarah"),
    agama: getText(formData, "agama"),
    statusPerkawinan: getText(formData, "statusPerkawinan"),
    statusHubunganKeluarga: getText(formData, "statusHubunganKeluarga"),
    pendidikanTerakhir: getText(formData, "pendidikanTerakhir"),
    jenisPekerjaan: getText(formData, "jenisPekerjaan"),
    kewarganegaraan: getText(formData, "kewarganegaraan"),
    namaAyah: getText(formData, "namaAyah"),
    namaIbu: getText(formData, "namaIbu"),
    anakKe: getText(formData, "anakKe"),
    alamatKtp: getText(formData, "alamatKtp"),
    alamatDomisili: getText(formData, "alamatDomisili"),
    noRt: getText(formData, "noRt"),
    noRw: getText(formData, "noRw"),
  };
}

export async function createWarga(formData: FormData) {
  await requireSession();
  const result = WargaSchema.safeParse(parseWargaInput(formData));

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Validasi gagal",
    };
  }

  try {
    await prisma.warga.create({
      data: result.data,
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
  const result = WargaSchema.safeParse(parseWargaInput(formData));

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Validasi gagal",
    };
  }

  try {
    await prisma.warga.update({
      where: { id },
      data: result.data,
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
