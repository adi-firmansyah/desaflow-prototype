import { Button } from "@/components/ui/button";
import { statusLabel } from "@/lib/constants";
import { getWargaList } from "@/lib/queries";
import { normalizePagination } from "@/lib/pagination";
import { EyeIcon, PencilIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { DeleteWargaButton } from "./_components/delete-warga-button";
import { ExportWargaButtons } from "./_components/export-warga-buttons";
import { WargaFormDialog } from "./_components/warga-form-dialog";
import { PaginationControls } from "@/components/pagination-controls";
import { SearchInput } from "@/components/search-input";
import { redirect } from "next/navigation";

export default async function DataWargaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
}) {
  const { q, page, limit } = await searchParams;
  const pagination = normalizePagination(page, limit);
  const wargaResult = await getWargaList({
    ...pagination,
    query: q,
  });
  if (wargaResult.currentPage !== pagination.page) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(wargaResult.currentPage));
    params.set("limit", String(pagination.limit));
    redirect(`/data-warga?${params.toString()}`);
  }
  const wargaList = wargaResult.data;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Data Warga</h1>
          <p className="text-neutral-500">
            Kelola data kependudukan sebagai sumber data surat.
          </p>
        </div>
        <WargaFormDialog
          trigger={
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Tambah Warga
            </Button>
          }
        />
      </div>

      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="max-w-sm flex-1">
          <SearchInput
            placeholder="Cari NIK atau nama..."
            defaultValue={q}
          />
        </div>
        <ExportWargaButtons query={q} />
      </div>

      <div className="border rounded-lg bg-white overflow-x-auto">
        {wargaList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-12 text-center">
            <p className="text-sm text-neutral-500">
              {q
                ? `Tidak ada warga dengan kata kunci "${q}".`
                : "Belum ada data warga."}
            </p>
            <WargaFormDialog
              trigger={
                <Button>
                  <PlusIcon className="h-4 w-4" />
                  Tambah Warga
                </Button>
              }
            />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left text-neutral-500">
                <th className="px-5 py-3 font-medium">NIK</th>
                <th className="px-5 py-3 font-medium">Nama Lengkap</th>
                <th className="px-5 py-3 font-medium">Alamat</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {wargaList.map((warga) => (
                <tr key={warga.id} className="border-t">
                  <td className="px-5 py-4">{warga.nik}</td>
                  <td className="px-5 py-4 font-medium">{warga.namaLengkap}</td>
                  <td className="px-5 py-4 text-neutral-500">
                    {warga.alamat}, RT {warga.rt}/RW {warga.rw}
                  </td>
                  <td className="px-5 py-4 text-neutral-500">
                    {statusLabel[warga.statusKawin]}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/data-warga/${warga.id}`}
                        className="hover:text-neutral-700 text-neutral-400"
                        title="Detail warga"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <WargaFormDialog
                        key={warga.id}
                        warga={warga}
                        trigger={
                          <button
                            className="text-neutral-400 hover:text-neutral-700"
                            title="Edit warga"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        }
                      />
                      <DeleteWargaButton
                        id={warga.id}
                        nama={warga.namaLengkap}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <PaginationControls
        pathname="/data-warga"
        query={q}
        page={wargaResult.currentPage}
        limit={pagination.limit}
        totalPages={wargaResult.totalPages}
      />
    </div>
  );
}
