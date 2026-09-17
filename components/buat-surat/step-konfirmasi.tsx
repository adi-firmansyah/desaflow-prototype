"use client";

import { createSurat } from "@/app/(dashboard)/buat-surat/actions";
import { Button } from "@/components/ui/button";
import type { FieldSchema, JenisSurat, Warga } from "@/types";
import { CheckIcon, EyeIcon, PlusIcon, PrinterIcon } from "lucide-react";
import { useState } from "react";

export function StepKonfirmasi({
  warga,
  jenisSurat,
  formData,
  suratHasil,
  onSuratCreated,
  onBack,
  onReset,
}: {
  warga: Warga;
  jenisSurat: JenisSurat;
  formData: Record<string, string>;
  suratHasil: { nomorSurat: string; tanggalDibuat: Date } | null;
  onSuratCreated: (data: { nomorSurat: string; tanggalDibuat: Date }) => void;
  onBack: () => void;
  onReset: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fields: FieldSchema[] = jenisSurat.templateFields;

  async function handleSimpan(status: "DRAFT" | "FINAL") {
    setLoading(true);
    try {
      const surat = await createSurat({
        wargaId: warga.id,
        jenisSuratId: jenisSurat.id,
        dataForm: formData,
        status,
      });
      onSuratCreated({
        nomorSurat: surat.nomorSurat,
        tanggalDibuat: surat.tanggalDibuat,
      });
    } finally {
      setLoading(false);
    }
  }

  // Setelah surat berhasil dibuat, tampilkan halaman sukses
  if (suratHasil && !showPreview) {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <div className="h-16 w-16 rounded-lg bg-neutral-100 flex items-center justify-center mb-6">
          <CheckIcon className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Surat Berhasil Dibuat</h2>
        <p className="text-neutral-500 mb-8">
          Dokumen telah tersimpan di sistem dan siap untuk dicetak atau
          ditandatangani.
        </p>

        <div className="border rounded-lg p-6 w-full max-w-md text-left space-y-3 mb-8 bg-white">
          <h3 className="font-semibold mb-2">Ringkasan Dokumen</h3>
          <SummaryRow label="No. Surat" value={suratHasil.nomorSurat} />
          <SummaryRow label="Nama Warga" value={warga.namaLengkap} />
          <SummaryRow label="Jenis Surat" value={jenisSurat.nama} />
          <SummaryRow
            label="Tanggal Dibuat"
            value={new Date(suratHasil.tanggalDibuat).toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              },
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={() => window.print()}>
            <PrinterIcon className="h-4 w-4 mr-2" />
            Cetak Surat
          </Button>
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <EyeIcon className="h-4 w-4 mr-2" />
            Preview Surat
          </Button>
          <Button variant="outline" onClick={onReset}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Buat Surat Baru
          </Button>
        </div>
      </div>
    );
  }

  // Preview surat sebelum disimpan
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-6">
        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="font-semibold mb-4">Informasi Surat</h3>
            <div className="space-y-3 text-sm">
              <SummaryRow
                label="Jenis Surat"
                value={jenisSurat.nama}
                vertical
              />
              <SummaryRow
                label="Nama Pemohon"
                value={warga.namaLengkap}
                vertical
              />
              <SummaryRow
                label="Tanggal Pembuatan"
                value={new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                vertical
              />
              <SummaryRow
                label="Petugas Register"
                value="Admin Desa"
                vertical
              />
            </div>
          </div>

          {!suratHasil && (
            <div className="border rounded-lg p-6 space-y-3 bg-white">
              <h3 className="font-semibold mb-1">Tindakan</h3>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => handleSimpan("DRAFT")}
                disabled={loading}
              >
                Simpan Draft
              </Button>
              <Button
                className="w-full justify-center"
                onClick={() => handleSimpan("FINAL")}
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Cetak & Simpan Surat"}
              </Button>
            </div>
          )}
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
                  value={formData[field.key] || "-"}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={() => (suratHasil ? setShowPreview(false) : onBack())}
        >
          ← {suratHasil ? "Kembali" : "Kembali Edit"}
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  vertical,
}: {
  label: string;
  value: string;
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <div className="pb-3 border-b last:border-0">
        <p className="text-neutral-500 text-xs mb-1">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    );
  }
  return (
    <div className="flex justify-between">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium">{value}</span>
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
      <td className="py-1 pr-2 w-3 align-top">:</td>
      <td className={`py-1 align-top ${bold ? "font-semibold" : ""}`}>
        {value}
      </td>
    </tr>
  );
}
