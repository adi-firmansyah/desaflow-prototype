import { PaginationControls } from "@/components/pagination-controls";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { statusLabel } from "@/lib/constants";
import { normalizePagination } from "@/lib/pagination";
import { getWargaList } from "@/lib/queries";
import { EyeIcon, PencilIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteWargaButton } from "./_components/delete-warga-button";
import { ExportWargaButtons } from "./_components/export-warga-buttons";
import { WargaFilterBar } from "./_components/warga-filter-bar";
import { WargaFormDialog } from "./_components/warga-form-dialog";

export default async function DataWargaPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    limit?: string;
    jenisKelamin?: string;
    agama?: string;
    golonganDarah?: string;
    statusPerkawinan?: string;
    statusHubunganKeluarga?: string;
    pendidikanTerakhir?: string;
    jenisPekerjaan?: string;
    kewarganegaraan?: string;
  }>;
}) {
  const params = await searchParams;
  const {
    q,
    page,
    limit,
    jenisKelamin,
    agama,
    golonganDarah,
    statusPerkawinan,
    statusHubunganKeluarga,
    pendidikanTerakhir,
    jenisPekerjaan,
    kewarganegaraan,
  } = params;

  const filterParams: Record<string, string | undefined> = {
    jenisKelamin,
    agama,
    golonganDarah,
    statusPerkawinan,
    statusHubunganKeluarga,
    pendidikanTerakhir,
    jenisPekerjaan,
    kewarganegaraan,
  };

  const hasActiveFilters = Object.values(filterParams).some(Boolean);

  const pagination = normalizePagination(page, limit);
  const wargaResult = await getWargaList({
    ...pagination,
    query: q,
    jenisKelamin,
    agama,
    golonganDarah,
    statusPerkawinan,
    statusHubunganKeluarga,
    pendidikanTerakhir,
    jenisPekerjaan,
    kewarganegaraan,
  });

  if (wargaResult.currentPage !== pagination.page) {
    const nextParams = new URLSearchParams();
    if (q) nextParams.set("q", q);
    Object.entries(filterParams).forEach(([k, v]) => {
      if (v) nextParams.set(k, v);
    });
    nextParams.set("page", String(wargaResult.currentPage));
    nextParams.set("limit", String(pagination.limit));
    redirect(`/data-warga?${nextParams.toString()}`);
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

      <div className="mb-4">
        <WargaFilterBar
          exportButtons={
            <ExportWargaButtons query={q} filters={filterParams} />
          }
        >
          <SearchInput
            placeholder="Cari NIK atau nama..."
            defaultValue={q}
            className="max-w-sm"
          />
        </WargaFilterBar>
      </div>

      <div className="border rounded-lg bg-white overflow-x-auto">
        {wargaList.length === 0 ? (
          <div className="px-5 py-10 text-center text-neutral-500 text-sm">
            {q || hasActiveFilters
              ? "Tidak ada data warga yang sesuai dengan kriteria pencarian dan filter."
              : "Belum ada data warga."}
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
                    {warga.alamatKtp}, RT {warga.noRt}/RW {warga.noRw}
                  </td>
                  <td className="px-5 py-4 text-neutral-500">
                    {statusLabel[warga.statusPerkawinan]}
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
        extraParams={filterParams}
        page={wargaResult.currentPage}
        limit={pagination.limit}
        totalPages={wargaResult.totalPages}
      />
    </div>
  );
}
