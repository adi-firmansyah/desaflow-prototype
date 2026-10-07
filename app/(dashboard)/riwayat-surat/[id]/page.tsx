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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 font-semibold">Informasi Surat</h3>
            <div className="space-y-2 text-sm">
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

          <div className="space-y-3 rounded-lg border bg-white p-6">
            <h3 className="mb-1 font-semibold">Tindakan</h3>
            {surat.status === "DRAFT" && <FinalisasiButton id={surat.id} />}

            <Button className="w-full justify-center" onClick={undefined}>
              <PrinterIcon className="mr-2 h-4 w-4" />
              Cetak Surat
            </Button>

            <DownloadPdfButton
              suratId={surat.id}
              nomorSurat={surat.nomorSurat}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-white p-10">
          <div className="mb-6 border-b-2 border-neutral-900 pb-4 text-center">
            <p className="text-lg font-bold uppercase">Pemerintah Desa</p>
            <p className="text-sm text-neutral-500">Alamat Kantor Desa</p>
          </div>

          <h2 className="mb-6 text-center text-lg font-bold uppercase underline">
            {jenisSurat.nama}
          </h2>

          <p className="mb-4 text-sm">
            Yang bertanda tangan di bawah ini, Kepala Desa, menerangkan dengan
            sesungguhnya bahwa:
          </p>

          <table className="mb-6 w-full table-fixed text-sm">
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

          <p className="mb-3 text-sm font-medium">Keterangan:</p>
          <table className="w-full text-sm">
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
