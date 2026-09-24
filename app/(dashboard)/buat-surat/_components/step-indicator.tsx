import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  "Data Pemohon",
  "Pilih Jenis Surat",
  "Lengkapi Form",
  "Konfirmasi",
];

export function StepIndicator({
  current,
  completed,
}: {
  current: number;
  completed?: boolean;
}) {
  return (
    <div className="flex items-center justify-center mb-10 overflow-x-auto py-2">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isDone = completed || stepNum < current;
        const isActive = !completed && stepNum === current;

        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all",
                  isDone
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : isActive
                      ? "bg-primary text-primary-foreground shadow-xs ring-4 ring-primary/20"
                      : "border border-border bg-background text-muted-foreground",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap transition-colors",
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
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-10 sm:w-16 mx-3 sm:mx-4 transition-colors",
                  isDone ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

