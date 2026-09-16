"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type FieldSchema = {
  key: string;
  label: string;
  type: "text" | "date" | "select" | "textarea";
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export async function createJenisSurat(data: {
  nama: string;
  deskripsi: string;
  icon: string;
  kodeFormat: string;
  fields: FieldSchema[];
}) {
  try {
    await prisma.jenisSurat.create({
      data: {
        nama: data.nama,
        deskripsi: data.deskripsi,
        icon: data.icon,
        kodeFormat: data.kodeFormat,
        templateFields: JSON.stringify(data.fields),
      },
    });
    revalidatePath("/jenis-surat");
    revalidatePath("/buat-surat");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Nama jenis surat sudah digunakan." };
    }
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function updateJenisSurat(
  id: string,
  data: {
    nama: string;
    deskripsi: string;
    icon: string;
    kodeFormat: string;
    fields: FieldSchema[];
  },
) {
  try {
    await prisma.jenisSurat.update({
      where: { id },
      data: {
        nama: data.nama,
        deskripsi: data.deskripsi,
        icon: data.icon,
        kodeFormat: data.kodeFormat,
        templateFields: JSON.stringify(data.fields),
      },
    });
    revalidatePath("/jenis-surat");
    revalidatePath("/buat-surat");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Nama jenis surat sudah digunakan." };
    }
    return { success: false, message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function deleteJenisSurat(id: string) {
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
