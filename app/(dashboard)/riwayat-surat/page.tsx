import { DownloadPdfButton } from "@/components/riwayat-surat/download-pdf-button";
import { statusColor, statusLabel } from "@/lib/constants";
import { getSuratList } from "@/lib/queries";
import { normalizePagination } from "@/lib/pagination";
import { PaginationControls } from "@/components/pagination-controls";
import { SearchInput } from "@/components/search-input";
import { redirect } from "next/navigation";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

export default async function RiwayatSuratPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}) {
  const { q, page, limit } = await searchParams;
  const pagination = normalizePagination(page, limit);
  const suratResult = await getSuratList({
    ...pagination,
    query: q,
  });
  if (suratResult.currentPage !== pagination.page) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(suratResult.currentPage));
    params.set("limit", String(pagination.limit));
    redirect(`/riwayat-surat?${params.toString()}`);
  }
  const suratList = suratResult.data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Riwayat Surat</h1>
      <p className="text-neutral-500 mb-6">
        Daftar seluruh surat yang pernah dibuat dan tersimpan di sistem.
      </p>

      <div className="max-w-sm mb-4">
        <SearchInput
          placeholder="Cari nomor surat atau nama warga..."
          defaultValue={q}
        />
      </div>

      <div className="border rounded-lg bg-white overflow-x-auto">
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
                  <td className="px-5 py-4 flex items-center justify-end gap-3">
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
      <PaginationControls
        pathname="/riwayat-surat"
        query={q}
        page={suratResult.currentPage}
        limit={pagination.limit}
        totalPages={suratResult.totalPages}
      />
    </div>
  );
}
