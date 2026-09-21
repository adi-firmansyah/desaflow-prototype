import { auth } from "@/lib/auth/server";
import { ArrowRightIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d4d4d4 1.1px, transparent 1.1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-white via-transparent to-white" />

      <header className="border-b px-8 py-6 bg-white/80 backdrop-blur-sm flex items-center justify-between">
        <h1 className="text-xl font-bold">DesaFlow</h1>

        <Link
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          {isLoggedIn ? "Dashboard" : "Masuk"}
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <span className="inline-block text-xs font-semibold tracking-wider text-neutral-500 border rounded-full px-4 py-1.5 mb-6 bg-white">
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
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </main>

      <footer className="border-t px-6 py-6 text-center text-sm text-neutral-500 bg-white/80 backdrop-blur-sm">
        © 2024 DesaFlow - Sistem Administrasi Wireframe.
      </footer>
    </div>
  );
}
