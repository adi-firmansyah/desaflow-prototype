import { InfoRow } from "@/components/ui/detail-rows";
import { statusLabel, suratStatusColor } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { ArrowLeftIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DetailWargaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const warga = await prisma.warga.findUnique({
    where: { id },
    include: {
      surat: {
        include: { jenisSurat: true },
        orderBy: { tanggalDibuat: "desc" },
      },
    },
  });

  if (!warga) notFound();

  return (
    <div>
      <Link
        href="/data-warga"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali ke Data Warga
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <div className="border rounded-lg p-6 h-fit bg-white">
          <h2 className="text-xl font-bold mb-1">{warga.namaLengkap}</h2>
          <p className="text-neutral-500 text-sm mb-6">NIK: {warga.nik}</p>

          <div className="space-y-3 text-sm">
            <InfoRow
              label="Tempat, Tanggal Lahir"
              value={`${warga.tempatLahir}, ${new Date(
                warga.tanggalLahir,
              ).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`}
            />
            <InfoRow
              label="Jenis Kelamin"
              value={
                warga.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"
              }
            />
            <InfoRow label="Agama" value={warga.agama} />
            <InfoRow
              label="Status Kawin"
              value={statusLabel[warga.statusKawin]}
            />
            <InfoRow label="Pekerjaan" value={warga.pekerjaan ?? "-"} />
            <InfoRow
              label="Alamat"
              value={`${warga.alamat}, RT ${warga.rt}/RW ${warga.rw}`}
            />
          </div>
        </div>

        <div className="border rounded-lg bg-white">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold text-lg">Riwayat Surat</h3>
            <p className="text-sm text-neutral-500">
              Surat yang pernah dibuat atas nama warga ini.
            </p>
          </div>

          {warga.surat.length === 0 ? (
            <div className="px-5 py-10 text-center text-neutral-500 text-sm">
              Belum ada surat yang dibuat untuk warga ini.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 text-left text-neutral-500">
                  <th className="px-5 py-3 font-medium">No. Surat</th>
                  <th className="px-5 py-3 font-medium">Jenis Surat</th>
                  <th className="px-5 py-3 font-medium">Tanggal</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {warga.surat.map((surat) => (
                  <tr key={surat.id} className="border-t">
                    <td className="px-5 py-4 font-medium">
                      {surat.nomorSurat}
                    </td>
                    <td className="px-5 py-4">{surat.jenisSurat.nama}</td>
                    <td className="px-5 py-4 text-neutral-500">
                      {new Date(surat.tanggalDibuat).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          suratStatusColor[surat.status]
                        }`}
                      >
                        {surat.status === "FINAL" ? "Final" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/riwayat-surat/${surat.id}?from=warga&wargaId=${warga.id}`}
                        className="text-neutral-400 hover:text-neutral-700 inline-flex"
                        title="Detail surat"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
