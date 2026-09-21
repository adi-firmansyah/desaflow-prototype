export const dynamic = "force-dynamic";

import { DownloadPdfButton } from "@/components/riwayat-surat/download-pdf-button";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRightIcon,
  CalendarIcon,
  EyeIcon,
  FileTextIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [suratHariIni, suratBulanIni, suratTerbaru] = await Promise.all([
    prisma.surat.count({ where: { tanggalDibuat: { gte: startOfDay } } }),
    prisma.surat.count({ where: { tanggalDibuat: { gte: startOfMonth } } }),
    prisma.surat.findMany({
      take: 4,
      orderBy: { tanggalDibuat: "desc" },
      include: { warga: true, jenisSurat: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
      <p className="text-neutral-500 mb-6">
        Ringkasan aktivitas surat menyurat desa hari ini.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-5 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-neutral-500">
              SURAT HARI INI
            </span>
            <FileTextIcon className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-4xl font-bold">{suratHariIni}</p>
        </div>

        <div className="border rounded-lg p-5 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-neutral-500">
              SURAT BULAN INI
            </span>
            <CalendarIcon className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-4xl font-bold">{suratBulanIni}</p>
        </div>

        <Link
          href="/buat-surat"
          className="bg-neutral-900 text-white rounded-lg p-5 flex flex-col items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
        >
          <PlusIcon className="h-6 w-6" />
          <span className="font-semibold">Buat Surat Baru</span>
        </Link>
      </div>

      <div className="border rounded-lg bg-white">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-lg">Daftar Surat Terbaru</h2>
          <Link
            href="/riwayat-surat"
            className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            <span>Lihat Semua</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {suratTerbaru.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-12 text-center">
            <p className="text-sm text-neutral-500">
              Belum ada surat yang dibuat.
            </p>
            <Link href="/buat-surat" className={buttonVariants()}>
              <PlusIcon className="h-4 w-4" />
              Buat Surat Baru
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left text-neutral-500">
                <th className="px-5 py-3 font-medium">No. Surat</th>
                <th className="px-5 py-3 font-medium">Nama Pemohon</th>
                <th className="px-5 py-3 font-medium">Jenis Surat</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suratTerbaru.map((surat) => (
                <tr key={surat.id} className="border-t">
                  <td className="px-5 py-4 font-medium">{surat.nomorSurat}</td>
                  <td className="px-5 py-4">{surat.warga.namaLengkap}</td>
                  <td className="px-5 py-4">{surat.jenisSurat.nama}</td>
                  <td className="px-5 py-4 text-right flex items-center justify-end gap-3">
                    <Link
                      href={`/riwayat-surat/${surat.id}?from=dashboard`}
                      className="text-neutral-400 hover:text-neutral-700"
                      title="Detail surat"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>

                    <DownloadPdfButton
                      suratId={surat.id}
                      nomorSurat={surat.nomorSurat}
                      iconOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
