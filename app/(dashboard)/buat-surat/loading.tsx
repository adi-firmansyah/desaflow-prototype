"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "desaflow-wizard-state";

const stepLabels = [
  "Data Pemohon",
  "Pilih Jenis Surat",
  "Lengkapi Form",
  "Konfirmasi",
];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): number {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        typeof parsed?.step === "number" &&
        parsed.step >= 1 &&
        parsed.step <= 4
      ) {
        return parsed.step;
      }
    }
  } catch {
    // fallback to step 1
  }
  return 1;
}

function getServerSnapshot(): number {
  return 1;
}

export default function BuatSuratLoading() {
  const step = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <div className="space-y-10">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Step Indicator Skeleton (dynamically reflects current active step) */}
      <div className="flex items-center justify-center overflow-x-auto py-2">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isDone = stepNum < step;
          const isActive = stepNum === step;

          return (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all",
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "border border-border bg-background text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    isActive
                      ? "text-foreground font-semibold"
                      : isDone
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {index < stepLabels.length - 1 && (
                <div
                  className={cn(
                    "h-px w-10 sm:w-16 mx-3 sm:mx-4",
                    isDone ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Wizard Content Skeleton based on current step */}
      {step === 1 && <Step1Skeleton />}
      {step === 2 && <Step2Skeleton />}
      {step === 3 && <Step3Skeleton />}
      {step === 4 && <Step4Skeleton />}
    </div>
  );
}

/**
 * Step 1: Data Pemohon
 * - Search card (NIK / Nama) on the left
 * - Selected citizen summary card on the right
 */
function Step1Skeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
        <CardContent className="py-8 flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-3 w-40" />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Step 2: Pilih Jenis Surat
 * - Card with search bar & grid of letter template cards
 * - Bottom navigation buttons
 */
function Step2Skeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-9 w-full sm:w-72 rounded-md" />
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border p-5 flex flex-col justify-between h-44 bg-card"
              >
                <div>
                  <div className="flex items-start justify-between mb-3.5">
                    <Skeleton className="h-11 w-11 rounded-lg" />
                  </div>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
                <div className="pt-3 border-t border-border flex justify-between items-center">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Step 3: Lengkapi Form
 * - Left column: Data Pemohon read-only summary
 * - Right column: Dynamic template form fields
 * - Bottom navigation buttons
 */
function Step3Skeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-md" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3.5 w-56 max-w-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-3.5 w-64 max-w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-36 rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Step 4: Konfirmasi & Preview
 * - Left column: Surat info & action buttons
 * - Right column: Document paper preview
 * - Bottom navigation button
 */
function Step4Skeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-36 mb-1" />
              <Skeleton className="h-3.5 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-8 sm:p-12 space-y-6">
            <div className="space-y-2 text-center pb-4 border-b border-border">
              <Skeleton className="h-5 w-48 mx-auto" />
              <Skeleton className="h-3.5 w-64 mx-auto" />
            </div>

            <Skeleton className="h-6 w-56 mx-auto mb-6" />

            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>

            <div className="space-y-3 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-8">
              <div className="w-48 space-y-2 text-center">
                <Skeleton className="h-3 w-32 mx-auto" />
                <Skeleton className="h-3 w-24 mx-auto" />
                <Skeleton className="h-16 w-32 mx-auto" />
                <Skeleton className="h-4 w-36 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-start">
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
    </div>
  );
}
