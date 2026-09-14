import { FinalisasiButton } from "@/components/riwayat-surat/finalisasi-button";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type FieldSchema = {
  key: string;
  label: string;
};

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

  const fields: FieldSchema[] = JSON.parse(
    surat.jenisSurat.templateFields as string,
  );
  const dataForm: Record<string, string> = JSON.parse(surat.dataForm as string);
  const { warga, jenisSurat } = surat;

  return (
    <div>
      <Link
        href="/riwayat-surat"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Riwayat Surat
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
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

          {surat.status === "DRAFT" && <FinalisasiButton id={surat.id} />}

          <Button className="w-full justify-center" onClick={undefined}>
            <Printer className="h-4 w-4 mr-2" />
            Cetak Surat
          </Button>
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

          <table className="text-sm w-full mb-6">
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
                value={`${warga.alamat}, RT ${warga.rt}/RW ${warga.rw}`}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="pb-3 border-b last:border-0">
      <p className="text-neutral-500 text-xs mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <tr>
      <td className="py-1 pr-4 w-48 text-neutral-600 align-top">{label}</td>
      <td className="py-1 pr-2 align-top">:</td>
      <td className={`py-1 align-top ${bold ? "font-semibold" : ""}`}>
        {value}
      </td>
    </tr>
  );
}
