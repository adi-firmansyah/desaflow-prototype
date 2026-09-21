import { BackButton } from "@/components/riwayat-surat/back-button";
import { DownloadPdfButton } from "@/components/riwayat-surat/download-pdf-button";
import { FinalisasiButton } from "@/components/riwayat-surat/finalisasi-button";
import { Button } from "@/components/ui/button";
import { InfoRow, PreviewRow } from "@/components/ui/detail-rows";
import { prisma } from "@/lib/prisma";
import { parseFieldSchemas, parseFormData, type FieldSchema } from "@/types";
import { PrinterIcon } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DetailSuratPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const surat = await prisma.surat.findUnique({
    where: { id },
    include: { warga: true, jenisSurat: true },
  });

  if (!surat) notFound();

  const fields: FieldSchema[] = parseFieldSchemas(
    surat.jenisSurat.templateFields,
  );
  const dataForm = parseFormData(surat.dataForm);
  const { warga, jenisSurat } = surat;

  return (
    <div>
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-4">Informasi Surat</h3>
            <div className="space-y-3 text-sm">
              <InfoRow label="Nomor Surat" value={surat.nomorSurat} />
              <InfoRow label="Jenis Surat" value={jenisSurat.nama} />
              <InfoRow label="Nama Pemohon" value={warga.namaLengkap} />
              <InfoRow
                label="Tanggal Dibuat"
                value={new Date(surat.tanggalDibuat).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              />
              <InfoRow
                label="Status"
                value={surat.status === "FINAL" ? "Final" : "Draft"}
              />
              <InfoRow label="Petugas" value={surat.petugas} />
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-3 bg-white">
            <h3 className="font-semibold mb-1">Tindakan</h3>
            {surat.status === "DRAFT" && <FinalisasiButton id={surat.id} />}

            <Button className="w-full justify-center" onClick={undefined}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Cetak Surat
            </Button>

            <DownloadPdfButton
              suratId={surat.id}
              nomorSurat={surat.nomorSurat}
            />
          </div>
        </div>

        <div className="border rounded-lg p-10 bg-white">
          <div className="text-center border-b-2 border-neutral-900 pb-4 mb-6">
            <p className="font-bold text-lg uppercase">Pemerintah Desa</p>
            <p className="text-sm text-neutral-500">Alamat Kantor Desa</p>
          </div>

          <h2 className="text-center font-bold text-lg underline mb-6 uppercase">
            {jenisSurat.nama}
          </h2>

          <p className="text-sm mb-4">
            Yang bertanda tangan di bawah ini, Kepala Desa, menerangkan dengan
            sesungguhnya bahwa:
          </p>

          <table className="text-sm w-full mb-6 table-fixed">
            <tbody>
              <PreviewRow label="Nama Lengkap" value={warga.namaLengkap} bold />
              <PreviewRow label="NIK" value={warga.nik} />
              <PreviewRow
                label="Tempat, Tanggal Lahir"
                value={`${warga.tempatLahir}, ${new Date(
                  warga.tanggalLahir,
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}`}
              />
              <PreviewRow
                label="Jenis Kelamin"
                value={
                  warga.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"
                }
              />
              <PreviewRow label="Agama" value={warga.agama} />
              <PreviewRow
                label="Alamat"
                value={`${warga.alamatKtp}, RT ${warga.noRt}/RW ${warga.noRw}`}
              />
            </tbody>
          </table>

          <p className="text-sm font-medium mb-3">Keterangan:</p>
          <table className="text-sm w-full">
            <tbody>
              {fields.map((field) => (
                <PreviewRow
                  key={field.key}
                  label={field.label}
                  value={dataForm[field.key] || "-"}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
