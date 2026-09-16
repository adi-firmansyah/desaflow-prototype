import { DownloadPdfButton } from "@/components/riwayat-surat/download-pdf-button";
import { prisma } from "@/lib/prisma";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  DRAFT: "Draft",
  FINAL: "Final",
};

const statusColor: Record<string, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  FINAL: "bg-green-100 text-green-700",
};

export default async function RiwayatSuratPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const suratList = await prisma.surat.findMany({
    where: q
      ? {
          OR: [
            { nomorSurat: { contains: q, mode: "insensitive" } },
            { warga: { namaLengkap: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: { warga: true, jenisSurat: true },
    orderBy: { tanggalDibuat: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Riwayat Surat</h1>
      <p className="text-neutral-500 mb-6">
        Daftar seluruh surat yang pernah dibuat dan tersimpan di sistem.
      </p>

      <form className="max-w-sm mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cari nomor surat atau nama warga..."
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-300"
        />
      </form>

      <div className="border rounded-lg">
        {suratList.length === 0 ? (
          <div className="px-5 py-10 text-center text-neutral-500 text-sm">
            {q
              ? `Tidak ada surat dengan kata kunci "${q}".`
              : "Belum ada surat yang dibuat."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left text-neutral-500">
                <th className="px-5 py-3 font-medium">No. Surat</th>
                <th className="px-5 py-3 font-medium">Nama Pemohon</th>
                <th className="px-5 py-3 font-medium">Jenis Surat</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suratList.map((surat) => (
                <tr key={surat.id} className="border-t">
                  <td className="px-5 py-4 font-medium">{surat.nomorSurat}</td>
                  <td className="px-5 py-4">{surat.warga.namaLengkap}</td>
                  <td className="px-5 py-4">{surat.jenisSurat.nama}</td>
                  <td className="px-5 py-4 text-neutral-500">
                    {new Date(surat.tanggalDibuat).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        statusColor[surat.status]
                      }`}
                    >
                      {statusLabel[surat.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right flex items-center justify-end gap-3">
                    <Link
                      href={`/riwayat-surat/${surat.id}`}
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
