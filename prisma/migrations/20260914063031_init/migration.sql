-- CreateTable
CREATE TABLE "warga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nik" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" DATETIME NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "agama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" TEXT NOT NULL,
    "rw" TEXT NOT NULL,
    "statusKawin" TEXT NOT NULL DEFAULT 'BELUM_KAWIN',
    "pekerjaan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "jenis_surat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "kodeFormat" TEXT NOT NULL,
    "templateFields" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "surat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomorSurat" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "dataForm" JSONB NOT NULL,
    "petugas" TEXT NOT NULL DEFAULT 'Admin Desa',
    "tanggalDibuat" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "wargaId" TEXT NOT NULL,
    "jenisSuratId" TEXT NOT NULL,
    CONSTRAINT "surat_wargaId_fkey" FOREIGN KEY ("wargaId") REFERENCES "warga" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "surat_jenisSuratId_fkey" FOREIGN KEY ("jenisSuratId") REFERENCES "jenis_surat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "warga_nik_key" ON "warga"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_surat_nama_key" ON "jenis_surat"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "surat_nomorSurat_key" ON "surat"("nomorSurat");
