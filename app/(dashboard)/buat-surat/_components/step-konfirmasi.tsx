"use client";

import { createSurat } from "@/app/(dashboard)/buat-surat/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PreviewRow } from "@/components/ui/detail-rows";
import { Separator } from "@/components/ui/separator";
import {
  parseFieldSchemas,
  type FieldSchema,
  type JenisSurat,
  type Warga,
} from "@/types";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckIcon,
  EyeIcon,
  Loader2Icon,
  PlusIcon,
  PrinterIcon,
} from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fields: FieldSchema[] = parseFieldSchemas(jenisSurat.templateFields);

  async function handleSimpan(status: "DRAFT" | "FINAL") {
    setLoading(true);
    try {
      const surat = await createSurat({
        wargaId: warga.id,
        jenisSuratId: jenisSurat.id,
        dataForm: formData,
        status,
      });
      if (!("nomorSurat" in surat)) {
        setError(surat.message);
        return;
      }

      setError(null);
      onSuratCreated({
        nomorSurat: surat.nomorSurat,
        tanggalDibuat: surat.tanggalDibuat,
      });
    } finally {
      setLoading(false);
    }
  }

  if (suratHasil && !showPreview) {
    return (
      <div className="flex flex-col items-center pb-12 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-neutral-100">
          <CheckIcon className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-3xl font-bold">Surat Berhasil Dibuat</h2>
        <p className="mb-8 text-neutral-500">
          Dokumen telah tersimpan di sistem dan siap untuk dicetak atau
          ditandatangani.
        </p>

        <Card className="mb-8 w-full max-w-md">
          <CardHeader>
            <CardTitle>Ringkasan Dokumen</CardTitle>
          </CardHeader>
          <CardContent>
            <SummaryRow label="No. Surat" value={suratHasil.nomorSurat} />
            <Separator />
            <SummaryRow label="Nama Warga" value={warga.namaLengkap} />
            <Separator />
            <SummaryRow label="Jenis Surat" value={jenisSurat.nama} />
            <Separator />
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
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => window.print()}>
            <PrinterIcon className="mr-2 h-4 w-4" />
            Cetak Surat
          </Button>
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <EyeIcon className="mr-2 h-4 w-4" />
            Preview Surat
          </Button>
          <Button variant="outline" onClick={onReset}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Buat Surat Baru
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Gagal Menyimpan Surat</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Surat</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
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
            </CardContent>
          </Card>

          {!suratHasil && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tindakan Dokumen</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => handleSimpan("DRAFT")}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    "Simpan Sebagai Draft"
                  )}
                </Button>
                <Button
                  className="w-full justify-center"
                  onClick={() => handleSimpan("FINAL")}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </span>
                  ) : (
                    "Cetak & Simpan Surat"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-8 sm:p-12">
            <div className="border-foreground mb-6 border-b-2 pb-4 text-center">
              <p className="text-lg font-bold tracking-wider uppercase">
                Pemerintah Desa
              </p>
              <p className="text-muted-foreground text-sm">
                Kecamatan Wilayah • Kabupaten Wilayah
              </p>
            </div>

            <h2 className="mb-6 text-center text-lg font-bold tracking-wide uppercase underline">
              {jenisSurat.nama}
            </h2>

            <p className="mb-4 text-sm leading-relaxed">
              Yang bertanda tangan di bawah ini, Kepala Desa, menerangkan dengan
              sesungguhnya bahwa:
            </p>

            <table className="mb-6 w-full table-fixed text-sm">
              <tbody>
                <PreviewRow
                  label="Nama Lengkap"
                  value={warga.namaLengkap}
                  bold
                />
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
                    warga.jenisKelamin === "LAKI_LAKI"
                      ? "Laki-laki"
                      : "Perempuan"
                  }
                />
                <PreviewRow label="Agama" value={warga.agama} />
                <PreviewRow
                  label="Alamat"
                  value={`${warga.alamatKtp}, RT ${warga.noRt}/RW ${warga.noRw}`}
                />
              </tbody>
            </table>

            <p className="mb-3 text-sm font-semibold">Keterangan Tambahan:</p>
            <table className="mb-8 w-full text-sm">
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

            <div className="mt-12 flex justify-end text-sm">
              <div className="w-56 text-center">
                <p className="text-muted-foreground mb-1">
                  Ditetapkan di Kantor Desa
                </p>
                <p className="mb-16">Kepala Desa</p>
                <p className="border-foreground inline-block border-b pb-0.5 font-bold">
                  ( Kepala Desa )
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={() => (suratHasil ? setShowPreview(false) : onBack())}
          className="gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>{suratHasil ? "Kembali ke Ringkasan" : "Kembali Edit"}</span>
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
      <div className="border-b pb-3 last:border-0">
        <p className="text-muted-foreground mb-1 text-xs">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
