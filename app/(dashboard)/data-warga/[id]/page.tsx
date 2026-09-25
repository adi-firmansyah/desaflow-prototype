import { InfoRow } from "@/components/ui/detail-rows";
import {
  jenisPekerjaanLabel,
  statusHubunganKeluargaLabel,
  statusPerkawinanLabel,
  suratStatusColor,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { ArrowLeftIcon, EyeIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const urutanHubunganKeluarga: Record<string, number> = {
  KEPALA_KELUARGA: 1,
  SUAMI: 2,
  ISTRI: 3,
  ANAK: 4,
  MENANTU: 5,
  CUCU: 6,
  ORANG_TUA: 7,
  MERTUA: 8,
  FAMILI_LAIN: 9,
  PEMBANTU: 10,
  LAINNYA: 11,
};

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

  const anggotaKeluarga = await prisma.warga.findMany({
    where: { noKk: warga.noKk },
    orderBy: { tanggalLahir: "asc" },
  });

  const sortedAnggotaKeluarga = [...anggotaKeluarga].sort((a, b) => {
    const orderA = urutanHubunganKeluarga[a.statusHubunganKeluarga] ?? 99;
    const orderB = urutanHubunganKeluarga[b.statusHubunganKeluarga] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return (
      new Date(a.tanggalLahir).getTime() - new Date(b.tanggalLahir).getTime()
    );
  });

  return (
    <div>
      <Link
        href="/data-warga"
        className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali ke Data Warga
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-lg border bg-white p-6">
          <h2 className="mb-1 text-xl font-bold">{warga.namaLengkap}</h2>
          <p className="mb-6 text-sm text-neutral-500">NIK: {warga.nik}</p>

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
            <InfoRow label="No KK" value={warga.noKk} />
            <InfoRow
              label="Gol. Darah"
              value={warga.golonganDarah.replace(/_/g, " ")}
            />
            <InfoRow
              label="Status Perkawinan"
              value={statusPerkawinanLabel[warga.statusPerkawinan]}
            />
            <InfoRow
              label="Status Hub. Keluarga"
              value={
                statusHubunganKeluargaLabel[warga.statusHubunganKeluarga] ??
                warga.statusHubunganKeluarga.replace(/_/g, " ")
              }
            />
            <InfoRow
              label="Pendidikan Terakhir"
              value={warga.pendidikanTerakhir.replace(/_/g, " ")}
            />
            <InfoRow
              label="Pekerjaan"
              value={
                jenisPekerjaanLabel[warga.jenisPekerjaan] ??
                warga.jenisPekerjaan.replace(/_/g, " ")
              }
            />
            <InfoRow label="Kewarganegaraan" value={warga.kewarganegaraan} />
            <InfoRow label="Nama Ayah" value={warga.namaAyah} />
            <InfoRow label="Nama Ibu" value={warga.namaIbu} />
            <InfoRow label="Anak Ke" value={warga.anakKe.toString()} />
            <InfoRow
              label="Alamat KTP"
              value={`${warga.alamatKtp}, RT ${warga.noRt}/RW ${warga.noRw}`}
            />
            <InfoRow
              label="Alamat Domisili"
              value={`${warga.alamatDomisili}`}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Tabel Anggota Keluarga */}
          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="flex items-center gap-4 border-b px-5 py-4">
              <div className="rounded-full bg-neutral-100 p-2 text-neutral-600">
                <UsersIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">
                Anggota Keluarga ({sortedAnggotaKeluarga.length} orang)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 text-left text-neutral-500">
                    <th className="px-5 py-3 font-medium">Nama Lengkap</th>
                    <th className="px-5 py-3 font-medium">NIK</th>
                    <th className="px-5 py-3 font-medium">Hubungan</th>
                    <th className="px-5 py-3 font-medium">Jenis Kelamin</th>
                    <th className="px-5 py-3 font-medium">Tgl Lahir</th>
                    <th className="px-5 py-3 font-medium">Pekerjaan</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAnggotaKeluarga.map((anggota) => {
                    const isCurrentWarga = anggota.id === warga.id;
                    return (
                      <tr
                        key={anggota.id}
                        className={`border-t transition-colors ${
                          isCurrentWarga
                            ? "bg-neutral-50 font-medium"
                            : "hover:bg-neutral-50/60"
                        }`}
                      >
                        <td className="px-5 py-4">{anggota.namaLengkap}</td>
                        <td className="px-5 py-4 text-xs text-neutral-600">
                          {anggota.nik}
                        </td>
                        <td className="px-5 py-4">
                          {
                            statusHubunganKeluargaLabel[
                              anggota.statusHubunganKeluarga
                            ]
                          }
                        </td>
                        <td className="px-5 py-4 text-neutral-600">
                          {anggota.jenisKelamin === "LAKI_LAKI"
                            ? "Laki-laki"
                            : "Perempuan"}
                        </td>
                        <td className="px-5 py-4 text-neutral-600">
                          {new Date(anggota.tanggalLahir).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-5 py-4 text-neutral-600">
                          {jenisPekerjaanLabel[anggota.jenisPekerjaan] ??
                            anggota.jenisPekerjaan.replace(/_/g, " ")}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end">
                            {isCurrentWarga ? (
                              <span className="text-end text-xs text-neutral-400">
                                Sedang dilihat
                              </span>
                            ) : (
                              <Link
                                href={`/data-warga/${anggota.id}`}
                                className="text-neutral-400 hover:text-neutral-700"
                                title="Lihat detail warga"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Riwayat Surat */}
          <div className="rounded-lg border bg-white">
            <div className="border-b px-5 py-4">
              <h3 className="text-lg font-semibold">Riwayat Surat</h3>
              <p className="text-sm text-neutral-500">
                Surat yang pernah dibuat atas nama warga ini.
              </p>
            </div>

            {warga.surat.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-neutral-500">
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
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
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
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            suratStatusColor[surat.status]
                          }`}
                        >
                          {surat.status === "FINAL" ? "Final" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/riwayat-surat/${surat.id}?from=warga&wargaId=${warga.id}`}
                          className="inline-flex text-neutral-400 hover:text-neutral-700"
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
    </div>
  );
}
