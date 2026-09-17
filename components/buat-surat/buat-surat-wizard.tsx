"use client";

import { parseFieldSchemas, type JenisSurat, type Warga } from "@/types";
import { startTransition, useEffect, useState } from "react";
import { StepDataPemohon } from "./step-data-pemohon";
import { StepIndicator } from "./step-indicator";
import { StepKonfirmasi } from "./step-konfirmasi";
import { StepLengkapiForm } from "./step-lengkapi-form";
import { StepPilihJenisSurat } from "./step-pilih-jenis-surat";

const STORAGE_KEY = "desaflow-wizard-state";

type WizardState = {
  step: number;
  selectedWarga: Warga | null;
  selectedJenisSurat: JenisSurat | null;
  formData: Record<string, string>;
  suratHasil: { nomorSurat: string; tanggalDibuat: Date } | null;
};

function toRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return Object.fromEntries(Object.entries(value));
}

function normalizeWarga(value: unknown): Warga | null {
  const record = toRecord(value);
  if (!record || typeof record.id !== "string") return null;

  const tanggalLahir = new Date(String(record.tanggalLahir));
  if (Number.isNaN(tanggalLahir.getTime())) return null;

  if (
    typeof record.nik !== "string" ||
    typeof record.namaLengkap !== "string" ||
    typeof record.tempatLahir !== "string" ||
    (record.jenisKelamin !== "LAKI_LAKI" &&
      record.jenisKelamin !== "PEREMPUAN") ||
    typeof record.agama !== "string" ||
    typeof record.alamat !== "string" ||
    typeof record.rt !== "string" ||
    typeof record.rw !== "string" ||
    (record.statusKawin !== "BELUM_KAWIN" &&
      record.statusKawin !== "KAWIN" &&
      record.statusKawin !== "CERAI_HIDUP" &&
      record.statusKawin !== "CERAI_MATI") ||
    (record.pekerjaan !== null && typeof record.pekerjaan !== "string")
  ) {
    return null;
  }

  return {
    id: record.id,
    nik: record.nik,
    namaLengkap: record.namaLengkap,
    tempatLahir: record.tempatLahir,
    tanggalLahir,
    jenisKelamin: record.jenisKelamin,
    agama: record.agama,
    alamat: record.alamat,
    rt: record.rt,
    rw: record.rw,
    statusKawin: record.statusKawin,
    pekerjaan: record.pekerjaan,
  };
}

function normalizeJenisSurat(value: unknown): JenisSurat | null {
  const record = toRecord(value);
  if (
    !record ||
    typeof record.id !== "string" ||
    typeof record.nama !== "string" ||
    typeof record.deskripsi !== "string" ||
    typeof record.icon !== "string" ||
    typeof record.kodeFormat !== "string"
  ) {
    return null;
  }

  return {
    id: record.id,
    nama: record.nama,
    deskripsi: record.deskripsi,
    icon: record.icon,
    kodeFormat: record.kodeFormat,
    templateFields: parseFieldSchemas(record.templateFields),
  };
}

function normalizeWizardState(value: unknown): WizardState | null {
  const record = toRecord(value);
  if (
    !record ||
    typeof record.step !== "number" ||
    record.step < 1 ||
    record.step > 4
  ) {
    return null;
  }

  const formDataRecord = toRecord(record.formData);
  if (!formDataRecord) return null;

  const formData = Object.fromEntries(
    Object.entries(formDataRecord).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
  const selectedWarga = normalizeWarga(record.selectedWarga);
  const selectedJenisSurat = normalizeJenisSurat(record.selectedJenisSurat);
  const suratRecord = toRecord(record.suratHasil);
  const nomorSurat = suratRecord?.nomorSurat;
  const tanggalDibuat = suratRecord
    ? new Date(String(suratRecord.tanggalDibuat))
    : null;
  const suratHasil =
    typeof nomorSurat === "string" &&
    tanggalDibuat &&
    !Number.isNaN(tanggalDibuat.getTime())
      ? { nomorSurat, tanggalDibuat }
      : null;

  if (
    (record.selectedWarga !== null && !selectedWarga) ||
    (record.selectedJenisSurat !== null && !selectedJenisSurat) ||
    (suratRecord && (typeof nomorSurat !== "string" || !suratHasil))
  ) {
    return null;
  }

  return {
    step: record.step,
    selectedWarga,
    selectedJenisSurat,
    formData,
    suratHasil,
  };
}

export function BuatSuratWizard({
  jenisSuratList,
}: {
  jenisSuratList: JenisSurat[];
}) {
  const [step, setStep] = useState(1);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);
  const [selectedJenisSurat, setSelectedJenisSurat] =
    useState<JenisSurat | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [suratHasil, setSuratHasil] = useState<{
    nomorSurat: string;
    tanggalDibuat: Date;
  } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sinkronisasi state dari sessionStorage supaya data form tidak hilang saat refresh.
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = normalizeWizardState(JSON.parse(saved));

        if (!parsed || parsed.suratHasil || parsed.step === 1) {
          sessionStorage.removeItem(STORAGE_KEY);
        } else {
          startTransition(() => {
            setStep(parsed.step);
            setSelectedWarga(parsed.selectedWarga);
            setSelectedJenisSurat(parsed.selectedJenisSurat);
            setFormData(parsed.formData);
            setSuratHasil(parsed.suratHasil);
          });
        }
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    startTransition(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const state: WizardState = {
      step,
      selectedWarga,
      selectedJenisSurat,
      formData,
      suratHasil,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [
    step,
    selectedWarga,
    selectedJenisSurat,
    formData,
    suratHasil,
    isHydrated,
  ]);

  function resetWizard() {
    setStep(1);
    setSelectedWarga(null);
    setSelectedJenisSurat(null);
    setFormData({});
    setSuratHasil(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  if (!isHydrated) return null;

  return (
    <div>
      <StepIndicator current={step} completed={step === 4 && !!suratHasil} />

      {step === 1 && (
        <StepDataPemohon
          selectedWarga={selectedWarga}
          onSelect={setSelectedWarga}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepPilihJenisSurat
          jenisSuratList={jenisSuratList}
          selected={selectedJenisSurat}
          onSelect={setSelectedJenisSurat}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && selectedWarga && selectedJenisSurat && (
        <StepLengkapiForm
          warga={selectedWarga}
          jenisSurat={selectedJenisSurat}
          formData={formData}
          onChange={setFormData}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && selectedWarga && selectedJenisSurat && (
        <StepKonfirmasi
          warga={selectedWarga}
          jenisSurat={selectedJenisSurat}
          formData={formData}
          suratHasil={suratHasil}
          onSuratCreated={setSuratHasil}
          onBack={() => setStep(3)}
          onReset={resetWizard}
        />
      )}
    </div>
  );
}
