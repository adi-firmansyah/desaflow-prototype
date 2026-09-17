export const dynamic = "force-dynamic";

import { BuatSuratWizard } from "@/components/buat-surat/buat-surat-wizard";
import type { JenisSurat } from "@/types";
import { getJenisSuratList } from "./actions";

export default async function BuatSuratPage() {
  const jenisSuratList = await getJenisSuratList();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Proses Pembuatan Surat</h1>
      <p className="text-neutral-500 mb-10">
        Ikuti langkah-langkah di bawah ini untuk menerbitkan surat administrasi
        baru.
      </p>

      <BuatSuratWizard jenisSuratList={jenisSuratList satisfies JenisSurat[]} />
    </div>
  );
}
