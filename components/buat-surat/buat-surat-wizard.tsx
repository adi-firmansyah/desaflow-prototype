"use client";

import type { JenisSurat, Warga } from "@/types";
import { useEffect, useState } from "react";
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

  // Load state dari sessionStorage saat pertama kali mount
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: WizardState = JSON.parse(saved);

        // Kalau surat sudah selesai, atau state tersimpan masih di step 1,
        // jangan restore apapun — mulai bersih dari awal
        if (parsed.suratHasil || parsed.step === 1) {
          sessionStorage.removeItem(STORAGE_KEY);
        } else {
          setStep(parsed.step);
          setSelectedWarga(parsed.selectedWarga);
          setSelectedJenisSurat(parsed.selectedJenisSurat);
          setFormData(parsed.formData);
          setSuratHasil(parsed.suratHasil);
        }
      } catch {
        // abaikan kalau data corrupt
      }
    }
    setIsHydrated(true);
  }, []);

  // Simpan ke sessionStorage tiap kali ada perubahan (setelah hydrate awal selesai)
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

  if (!isHydrated) return null; // hindari flash konten sebelum data ke-load

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
