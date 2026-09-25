"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart3Icon, FileTextIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

export interface JenisSuratStat {
  id: string;
  nama: string;
  kodeFormat: string;
  jumlah: number;
}

interface JenisSuratChartProps {
  data: JenisSuratStat[];
}

const chartConfig = {
  jumlah: {
    label: "Jumlah Surat",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function JenisSuratChart({ data }: JenisSuratChartProps) {
  // Hitung total surat yang telah dibuat
  const totalSurat = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.jumlah, 0);
  }, [data]);

  // Urutkan jenis surat dari jumlah terbanyak ke paling sedikit
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => b.jumlah - a.jumlah);
  }, [data]);

  // Jenis surat dengan frekuensi terbanyak
  const topSurat = sortedData.find((item) => item.jumlah > 0) ?? null;

  if (totalSurat === 0) {
    return (
      <Card className="mb-8 rounded-lg border bg-white">
        <CardHeader className="border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5 text-neutral-600" />
            <CardTitle className="text-base font-semibold">
              Statistik Frekuensi Jenis Surat
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-neutral-500">
            Grafik distribusi pembuatan surat berdasarkan jenis pelayanan
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center px-5 py-10 text-center">
          <FileTextIcon className="mb-3 h-10 w-10 text-neutral-300" />
          <p className="font-medium text-neutral-800">
            Belum Ada Data Pembuatan Surat
          </p>
          <p className="mt-1 mb-4 max-w-md text-sm text-neutral-500">
            Statistik jenis surat akan otomatis ditampilkan setelah surat
            pertama diterbitkan oleh sistem.
          </p>
          <Link href="/buat-surat" className={buttonVariants()}>
            Buat Surat Baru
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 rounded-lg border bg-white">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-neutral-900">
              Statistik Frekuensi Jenis Surat
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-neutral-500">
              Perbandingan jumlah pembuatan surat berdasarkan jenis surat
            </CardDescription>
          </div>

          {topSurat && (
            <div className="self-start rounded-md border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600 sm:self-auto">
              Jenis surat terbanyak:{" "}
              <strong className="font-semibold text-neutral-900">
                {topSurat.nama}
              </strong>{" "}
              ({topSurat.jumlah} surat)
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart
            accessibilityLayer
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 35, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              className="stroke-neutral-200"
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              className="text-xs text-neutral-500"
            />
            <YAxis
              dataKey="nama"
              type="category"
              tickLine={false}
              axisLine={false}
              width={190}
              className="text-xs font-medium text-neutral-700"
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <div className="flex items-center justify-between gap-4 text-xs">
                      <span className="text-neutral-500">Jumlah Dibuat:</span>
                      <span className="font-semibold text-neutral-900">
                        {value} surat
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey="jumlah"
              fill="#18181b"
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              <LabelList
                dataKey="jumlah"
                position="right"
                className="fill-neutral-600 text-xs font-medium"
                formatter={(val: unknown) => {
                  const num = Number(val);
                  return num > 0 ? `${num}` : "";
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          <InfoIcon className="h-4 w-4 text-neutral-400" />
          <span>
            Data diurutkan berdasarkan jenis surat yang paling sering diajukan.
          </span>
        </div>
        <span className="font-medium text-neutral-700">
          Total: {totalSurat} surat
        </span>
      </CardFooter>
    </Card>
  );
}
