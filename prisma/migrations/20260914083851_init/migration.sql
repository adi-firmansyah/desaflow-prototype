-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "StatusKawin" AS ENUM ('BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI');

-- CreateEnum
CREATE TYPE "StatusSurat" AS ENUM ('DRAFT', 'FINAL');

-- CreateTable
CREATE TABLE "warga" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "agama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" TEXT NOT NULL,
    "rw" TEXT NOT NULL,
    "statusKawin" "StatusKawin" NOT NULL DEFAULT 'BELUM_KAWIN',
    "pekerjaan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_surat" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "kodeFormat" TEXT NOT NULL,
    "templateFields" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jenis_surat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surat" (
    "id" TEXT NOT NULL,
    "nomorSurat" TEXT NOT NULL,
    "status" "StatusSurat" NOT NULL DEFAULT 'DRAFT',
    "dataForm" JSONB NOT NULL,
    "petugas" TEXT NOT NULL DEFAULT 'Admin Desa',
    "tanggalDibuat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wargaId" TEXT NOT NULL,
    "jenisSuratId" TEXT NOT NULL,

    CONSTRAINT "surat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warga_nik_key" ON "warga"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_surat_nama_key" ON "jenis_surat"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "surat_nomorSurat_key" ON "surat"("nomorSurat");

-- AddForeignKey
ALTER TABLE "surat" ADD CONSTRAINT "surat_wargaId_fkey" FOREIGN KEY ("wargaId") REFERENCES "warga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surat" ADD CONSTRAINT "surat_jenisSuratId_fkey" FOREIGN KEY ("jenisSuratId") REFERENCES "jenis_surat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
