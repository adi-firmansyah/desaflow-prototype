/*
  Warnings:

  - You are about to drop the column `alamat` on the `warga` table. All the data in the column will be lost.
  - You are about to drop the column `pekerjaan` on the `warga` table. All the data in the column will be lost.
  - You are about to drop the column `rt` on the `warga` table. All the data in the column will be lost.
  - You are about to drop the column `rw` on the `warga` table. All the data in the column will be lost.
  - You are about to drop the column `statusKawin` on the `warga` table. All the data in the column will be lost.
  - Added the required column `alamatDomisili` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamatKtp` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anakKe` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `golonganDarah` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenisPekerjaan` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kewarganegaraan` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaAyah` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaIbu` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noKk` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noRt` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noRw` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendidikanTerakhir` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusHubunganKeluarga` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusPerkawinan` to the `warga` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `agama` on the `warga` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GolonganDarah" AS ENUM ('A', 'B', 'AB', 'O', 'TIDAK_TAHU');

-- CreateEnum
CREATE TYPE "Agama" AS ENUM ('ISLAM', 'KRISTEN_PROTESTAN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KHONGHUCU', 'PENGHAYAT_KEPERCAYAAN');

-- CreateEnum
CREATE TYPE "StatusPerkawinan" AS ENUM ('BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI');

-- CreateEnum
CREATE TYPE "StatusHubunganKeluarga" AS ENUM ('KEPALA_KELUARGA', 'SUAMI', 'ISTRI', 'ANAK', 'MENANTU', 'CUCU', 'ORANG_TUA', 'MERTUA', 'FAMILI_LAIN', 'PEMBANTU', 'LAINNYA');

-- CreateEnum
CREATE TYPE "PendidikanTerakhir" AS ENUM ('TIDAK_BELUM_SEKOLAH', 'BELUM_TAMAT_SD', 'TAMAT_SD', 'SLTP', 'SLTA', 'DIPLOMA_I_II', 'DIPLOMA_III', 'DIPLOMA_IV_STRATA_I', 'STRATA_II', 'STRATA_III');

-- CreateEnum
CREATE TYPE "JenisPekerjaan" AS ENUM ('BELUM_TIDAK_BEKERJA', 'MENGURUS_RUMAH_TANGGA', 'PELAJAR_MAHASISWA', 'PENSIUNAN', 'PEGAWAI_NEGERI_SIPIL', 'TNI', 'POLRI', 'KARYAWAN_SWASTA', 'WIRASWASTA', 'BURUH_HARIAN_LEPAS', 'LAINNYA');

-- CreateEnum
CREATE TYPE "Kewarganegaraan" AS ENUM ('WNI', 'WNA');

-- AlterTable
ALTER TABLE "warga" DROP COLUMN "alamat",
DROP COLUMN "pekerjaan",
DROP COLUMN "rt",
DROP COLUMN "rw",
DROP COLUMN "statusKawin",
ADD COLUMN     "alamatDomisili" TEXT NOT NULL,
ADD COLUMN     "alamatKtp" TEXT NOT NULL,
ADD COLUMN     "anakKe" INTEGER NOT NULL,
ADD COLUMN     "golonganDarah" "GolonganDarah" NOT NULL,
ADD COLUMN     "jenisPekerjaan" "JenisPekerjaan" NOT NULL,
ADD COLUMN     "kewarganegaraan" "Kewarganegaraan" NOT NULL,
ADD COLUMN     "namaAyah" TEXT NOT NULL,
ADD COLUMN     "namaIbu" TEXT NOT NULL,
ADD COLUMN     "noKk" TEXT NOT NULL,
ADD COLUMN     "noRt" TEXT NOT NULL,
ADD COLUMN     "noRw" TEXT NOT NULL,
ADD COLUMN     "pendidikanTerakhir" "PendidikanTerakhir" NOT NULL,
ADD COLUMN     "statusHubunganKeluarga" "StatusHubunganKeluarga" NOT NULL,
ADD COLUMN     "statusPerkawinan" "StatusPerkawinan" NOT NULL,
DROP COLUMN "agama",
ADD COLUMN     "agama" "Agama" NOT NULL;

-- DropEnum
DROP TYPE "StatusKawin";
