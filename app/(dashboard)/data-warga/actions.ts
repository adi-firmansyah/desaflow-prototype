"use server";

import { prisma, Prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/require-session";
import type { JenisKelamin, StatusKawin } from "@/types";
import { revalidatePath } from "next/cache";

type WargaInput = {
  nik: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: Date;
  jenisKelamin: JenisKelamin;
  agama: string;
  alamat: string;
  rt: string;
  rw: string;
  statusKawin: StatusKawin;
  pekerjaan: string | null;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getJenisKelamin(value: string): JenisKelamin | null {
  return value === "LAKI_LAKI" || value === "PEREMPUAN" ? value : null;
}

function getStatusKawin(value: string): StatusKawin | null {
  return value === "BELUM_KAWIN" ||
    value === "KAWIN" ||
    value === "CERAI_HIDUP" ||
    value === "CERAI_MATI"
    ? value
    : null;
}

function parseWargaInput(formData: FormData): WargaInput | null {
  const tanggalLahir = new Date(getText(formData, "tanggalLahir"));
  const jenisKelamin = getJenisKelamin(getText(formData, "jenisKelamin"));
  const statusKawin = getStatusKawin(getText(formData, "statusKawin"));
  const requiredText = [
    "nik",
    "namaLengkap",
    "tempatLahir",
    "agama",
    "alamat",
    "rt",
    "rw",
  ];

  if (
    requiredText.some((key) => !getText(formData, key)) ||
    Number.isNaN(tanggalLahir.getTime()) ||
    !jenisKelamin ||
    !statusKawin
  ) {
    return null;
  }

  return {
    nik: getText(formData, "nik"),
    namaLengkap: getText(formData, "namaLengkap"),
    tempatLahir: getText(formData, "tempatLahir"),
    tanggalLahir,
    jenisKelamin,
    agama: getText(formData, "agama"),
    alamat: getText(formData, "alamat"),
    rt: getText(formData, "rt"),
    rw: getText(formData, "rw"),
    statusKawin,
    pekerjaan: getText(formData, "pekerjaan") || null,
  };
}

export async function createWarga(formData: FormData) {
  await requireSession();
  const data = parseWargaInput(formData);

  if (!data) {
    return { success: false, message: "Data warga tidak valid." };
  }

  try {
    await prisma.warga.create({
      data,
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
  const data = parseWargaInput(formData);

  if (!data) {
    return { success: false, message: "Data warga tidak valid." };
  }

  try {
    await prisma.warga.update({
      where: { id },
      data,
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
