import { Button } from "@/components/ui/button";
import { DeleteWargaButton } from "@/components/warga/delete-warga-button";
import { ExportWargaButtons } from "@/components/warga/export-warga-buttons";
import { WargaFormDialog } from "@/components/warga/warga-form-dialog";
import { prisma } from "@/lib/prisma";
import { EyeIcon, PencilIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  BELUM_KAWIN: "Belum Kawin",
  KAWIN: "Kawin",
  CERAI_HIDUP: "Cerai Hidup",
  CERAI_MATI: "Cerai Mati",
};

export default async function DataWargaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const wargaList = await prisma.warga.findMany({
    where: q
      ? {
          OR: [{ nik: { contains: q } }, { namaLengkap: { contains: q } }],
        }
      : undefined,
    orderBy: { namaLengkap: "asc" },
  });

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
        <form className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari NIK atau nama..."
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-300"
          />
        </form>
        <ExportWargaButtons query={q} />
      </div>

      <div className="border rounded-lg">
        {wargaList.length === 0 ? (
          <div className="px-5 py-10 text-center text-neutral-500 text-sm">
            {q
              ? `Tidak ada warga dengan kata kunci "${q}".`
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
    </div>
  );
}
