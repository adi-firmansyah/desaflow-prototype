import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-8 py-6">
        <h1 className="text-xl font-bold">DesaFlow</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <span className="inline-block text-xs font-semibold tracking-wider text-neutral-500 border rounded-full px-4 py-1.5 mb-6">
          DESAFLOW
        </span>

        <h2 className="text-5xl font-bold mb-4">Pelayanan Surat Desa</h2>

        <p className="text-neutral-500 text-lg mb-8 max-w-md">
          Sistem administrasi desa yang cepat, efisien, dan otomatis.
        </p>

        <Link
          href="/buat-surat"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-md font-medium hover:bg-neutral-800 transition-colors"
        >
          Mulai Buat Surat
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>

      <footer className="border-t px-6 py-6 text-center text-sm text-neutral-500">
        © 2024 DesaFlow - Sistem Administrasi Wireframe.
      </footer>
    </div>
  );
}
