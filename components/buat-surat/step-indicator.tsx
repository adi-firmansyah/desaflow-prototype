import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  "Data Pemohon",
  "Pilih Jenis Surat",
  "Lengkapi Form",
  "Konfirmasi",
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;

        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                  isDone || isActive
                    ? "bg-neutral-900 text-white"
                    : "border text-neutral-400",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  isActive ? "text-neutral-900" : "text-neutral-400",
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="h-px w-16 bg-neutral-200 mx-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}
