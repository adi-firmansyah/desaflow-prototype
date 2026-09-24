import { PaginationControls } from "@/components/pagination-controls";
import { DownloadPdfButton } from "@/components/riwayat-surat/download-pdf-button";
import { StatusFilter } from "@/components/riwayat-surat/status-filter";
import { SearchInput } from "@/components/search-input";
import { buttonVariants } from "@/components/ui/button";
import { statusColor, statusSuratLabel } from "@/lib/constants";
import { normalizePagination } from "@/lib/pagination";
import { getSuratList } from "@/lib/queries";
import { EyeIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RiwayatSuratPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    limit?: string;
    status?: string;
  }>;
}) {
  const { q, page, limit, status } = await searchParams;
  const pagination = normalizePagination(page, limit);
  const suratResult = await getSuratList({
    ...pagination,
    query: q,
    status,
  });
  if (suratResult.currentPage !== pagination.page) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    params.set("page", String(suratResult.currentPage));
    params.set("limit", String(pagination.limit));
    redirect(`/riwayat-surat?${params.toString()}`);
  }
  const suratList = suratResult.data;

  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold">Riwayat Surat</h1>
      <p className="mb-6 text-neutral-500">
        Daftar seluruh surat yang pernah dibuat dan tersimpan di sistem.
      </p>

      <div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            placeholder="Cari nomor surat atau nama warga..."
            defaultValue={q}
          />
        </div>
        <StatusFilter />
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        {suratList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-12 text-center">
            <p className="text-sm text-neutral-500">
              {q && status
                ? `Tidak ada surat dengan status "${statusSuratLabel[status] || status}" dan kata kunci "${q}".`
                : q
                  ? `Tidak ada surat dengan kata kunci "${q}".`
                  : status
                    ? `Tidak ada surat dengan status "${statusSuratLabel[status] || status}".`
                    : "Belum ada surat yang dibuat."}
            </p>
            {q || status ? (
              <Link
                href="/riwayat-surat"
                className={buttonVariants({ variant: "default" })}
              >
                Reset Filter
              </Link>
            ) : (
              <Link href="/buat-surat" className={buttonVariants()}>
                <PlusIcon className="h-4 w-4" />
                Buat Surat Baru
              </Link>
            )}
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
                <th className="px-5 py-3 text-right font-medium">Aksi</th>
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
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        statusColor[surat.status]
                      }`}
                    >
                      {statusSuratLabel[surat.status]}
                    </span>
                  </td>
                  <td className="flex items-center justify-end gap-3 px-5 py-4">
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
        extraParams={{ status }}
        page={suratResult.currentPage}
        limit={pagination.limit}
        totalPages={suratResult.totalPages}
      />
    </div>
  );
}
