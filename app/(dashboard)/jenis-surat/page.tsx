import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { parseFieldSchemas } from "@/types";
import { PencilIcon, PlusIcon } from "lucide-react";
import { DeleteJenisSuratButton } from "./_components/delete-jenis-surat-button";
import { JenisSuratFormDialog } from "./_components/jenis-surat-form-dialog";

export const dynamic = "force-dynamic";

export default async function JenisSuratPage() {
  const jenisSuratList = await prisma.jenisSurat.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Jenis Surat</h1>
          <p className="text-neutral-500">
            Kelola template jenis surat yang tersedia untuk dibuat.
          </p>
        </div>
        <JenisSuratFormDialog
          trigger={
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Tambah Jenis Surat
            </Button>
          }
        />
      </div>

      <div className="border rounded-lg bg-white overflow-x-auto">
        {jenisSuratList.length === 0 ? (
          <div className="px-5 py-10 text-center text-neutral-500 text-sm">
            Belum ada jenis surat. Tambahkan jenis surat pertama.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left text-neutral-500">
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Kode Format</th>
                <th className="px-5 py-3 font-medium">Deskripsi</th>
                <th className="px-5 py-3 font-medium">Jumlah Field</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jenisSuratList.map((jenis) => {
                const fields = parseFieldSchemas(jenis.templateFields);
                const jenisSurat = { ...jenis, templateFields: fields };
                return (
                  <tr key={jenis.id} className="border-t">
                    <td className="px-5 py-4 font-medium">{jenis.nama}</td>
                    <td className="px-5 py-4 text-neutral-500">
                      {jenis.kodeFormat}
                    </td>
                    <td className="px-5 py-4 text-neutral-500 max-w-xs truncate">
                      {jenis.deskripsi}
                    </td>
                    <td className="px-5 py-4 text-neutral-500">
                      {fields.length} field
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <JenisSuratFormDialog
                          key={jenis.id}
                          jenisSurat={jenisSurat}
                          trigger={
                            <button className="text-neutral-400 hover:text-neutral-700">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          }
                        />
                        <DeleteJenisSuratButton
                          id={jenis.id}
                          nama={jenis.nama}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
