"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusSuratLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { FilterIcon, Loader2Icon, RotateCcwIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface StatusFilterProps {
  className?: string;
}

export function StatusFilter({ className }: StatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") || "ALL";

  const handleStatusChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.delete("page");

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  const handleReset = () => {
    handleStatusChange("ALL");
  };

  const getLabel = () => {
    if (currentStatus === "DRAFT") return statusSuratLabel.DRAFT ?? "Draft";
    if (currentStatus === "FINAL") return statusSuratLabel.FINAL ?? "Final";
    return "Semua Status";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger
          className={cn(
            "text-primary w-40 bg-white text-sm font-medium transition-colors",
            currentStatus !== "ALL" && "border-primary bg-primary/5",
          )}
          aria-label="Filter status surat"
        >
          <div className="flex items-center gap-1.5 truncate">
            {isPending ? (
              <Loader2Icon className="h-3.5 w-3.5 shrink-0 animate-spin text-neutral-400" />
            ) : (
              <FilterIcon className="text-primary h-3.5 w-3.5 shrink-0" />
            )}
            <SelectValue placeholder="Semua Status">{getLabel()}</SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value="ALL">
            <span>Semua Status</span>
          </SelectItem>
          <SelectItem value="DRAFT">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>{statusSuratLabel.DRAFT ?? "Draft"}</span>
            </span>
          </SelectItem>
          <SelectItem value="FINAL">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>{statusSuratLabel.FINAL ?? "Final"}</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {currentStatus !== "ALL" && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-muted-foreground hover:text-foreground h-9 gap-1 px-2 text-xs"
          title="Reset filter status"
        >
          <RotateCcwIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      )}
    </div>
  );
}
