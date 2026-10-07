import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama biar seed idempotent
  await prisma.surat.deleteMany();
  await prisma.suratSequence.deleteMany();
  await prisma.jenisSurat.deleteMany();
  await prisma.warga.deleteMany();

  // --- Data Warga ---
  const warga = await prisma.warga.createMany({
    data: [
      {
        nik: "3201234567890001",
        noKk: "3201234567890000",
        namaLengkap: "Ahmad Syafiq",
        tempatLahir: "Bandung",
        tanggalLahir: new Date("1990-03-12"),
        jenisKelamin: "LAKI_LAKI",
        golonganDarah: "O",
        agama: "ISLAM",
        statusPerkawinan: "BELUM_KAWIN",
        statusHubunganKeluarga: "KEPALA_KELUARGA",
        pendidikanTerakhir: "DIPLOMA_IV_STRATA_I",
        jenisPekerjaan: "WIRASWASTA",
        kewarganegaraan: "WNI",
        namaAyah: "Budi",
        namaIbu: "Siti",
        anakKe: 1,
        alamatKtp: "Dusun Krajan",
        alamatDomisili: "Dusun Krajan",
        noRt: "01",
        noRw: "02",
      },
      {
        nik: "3404051234567890",
        noKk: "3404051234567800",
        namaLengkap: "Budi Santoso",
        tempatLahir: "Sleman",
        tanggalLahir: new Date("1965-08-15"),
        jenisKelamin: "LAKI_LAKI",
        golonganDarah: "A",
        agama: "ISLAM",
        statusPerkawinan: "KAWIN",
        statusHubunganKeluarga: "KEPALA_KELUARGA",
        pendidikanTerakhir: "SLTA",
        jenisPekerjaan: "KARYAWAN_SWASTA",
        kewarganegaraan: "WNI",
        namaAyah: "Hasan",
        namaIbu: "Aminah",
        anakKe: 2,
        alamatKtp: "Jl. Manggis No 45, Caturtunggal, Depok, Sleman",
        alamatDomisili: "Jl. Manggis No 45, Caturtunggal, Depok, Sleman",
        noRt: "02",
        noRw: "05",
      },
      {
        nik: "3201234567890045",
        noKk: "3201234567890040",
        namaLengkap: "Siti Aminah",
        tempatLahir: "Subang",
        tanggalLahir: new Date("1988-11-20"),
        jenisKelamin: "PEREMPUAN",
        golonganDarah: "B",
        agama: "ISLAM",
        statusPerkawinan: "CERAI_MATI",
        statusHubunganKeluarga: "KEPALA_KELUARGA",
        pendidikanTerakhir: "SLTP",
        jenisPekerjaan: "MENGURUS_RUMAH_TANGGA",
        kewarganegaraan: "WNI",
        namaAyah: "Umar",
        namaIbu: "Fatimah",
        anakKe: 3,
        alamatKtp: "Jl. Kenanga No 12, Desa Suka Maju",
        alamatDomisili: "Jl. Kenanga No 12, Desa Suka Maju",
        noRt: "03",
        noRw: "01",
      },
      {
        nik: "3201234567890078",
        noKk: "3201234567890070",
        namaLengkap: "Ratna Dewi",
        tempatLahir: "Purwakarta",
        tanggalLahir: new Date("1995-06-05"),
        jenisKelamin: "PEREMPUAN",
        golonganDarah: "AB",
        agama: "ISLAM",
        statusPerkawinan: "KAWIN",
        statusHubunganKeluarga: "ISTRI",
        pendidikanTerakhir: "DIPLOMA_IV_STRATA_I",
        jenisPekerjaan: "PEGAWAI_NEGERI_SIPIL",
        kewarganegaraan: "WNI",
        namaAyah: "Joko",
        namaIbu: "Sri",
        anakKe: 1,
        alamatKtp: "Jl. Melati No 7, Desa Suka Maju",
        alamatDomisili: "Jl. Melati No 7, Desa Suka Maju",
        noRt: "04",
        noRw: "02",
      },
    ],
  });

  // --- Jenis Surat ---
  await prisma.jenisSurat.createMany({
    data: [
      {
        nama: "Surat Keterangan Kematian",
        deskripsi:
          "Keterangan resmi meninggal dunia untuk keperluan administratif keluarga.",
        icon: "church",
        kodeFormat: "SKK",
        templateFields: JSON.stringify([
          {
            key: "tanggalKematian",
            label: "Tanggal Kematian",
            type: "date",
            required: true,
          },
          {
            key: "tempatKematian",
            label: "Tempat Kematian",
            type: "text",
            required: true,
            placeholder: "Contoh: RSUD Cibinong",
          },
          {
            key: "sebabKematian",
            label: "Sebab Kematian",
            type: "select",
            required: true,
            options: ["Sakit", "Kecelakaan", "Usia Lanjut", "Lainnya"],
          },
          {
            key: "keteranganTambahan",
            label: "Keterangan Tambahan",
            type: "textarea",
            required: false,
          },
        ]),
      },
      {
        nama: "Surat Status Janda/Duda",
        deskripsi:
          "Keterangan status perkawinan janda atau duda untuk keperluan administrasi.",
        icon: "users",
        kodeFormat: "SKJD",
        templateFields: JSON.stringify([
          {
            key: "statusSebelumnya",
            label: "Status Sebelumnya",
            type: "select",
            required: true,
            options: ["Cerai Hidup", "Cerai Mati"],
          },
          {
            key: "tanggalPerceraian",
            label: "Tanggal Perceraian/Kematian Pasangan",
            type: "date",
            required: true,
          },
          {
            key: "keteranganTambahan",
            label: "Keterangan Tambahan",
            type: "textarea",
            required: false,
          },
        ]),
      },
      {
        nama: "Surat Belum Menikah",
        deskripsi:
          "Surat pengantar pernyataan belum pernah menikah dari kelurahan/desa.",
        icon: "user",
        kodeFormat: "SKBM",
        templateFields: JSON.stringify([
          {
            key: "keperluan",
            label: "Keperluan",
            type: "text",
            required: true,
            placeholder: "Contoh: Persyaratan pernikahan",
          },
          {
            key: "keteranganTambahan",
            label: "Keterangan Tambahan",
            type: "textarea",
            required: false,
          },
        ]),
      },
      {
        nama: "Surat Keterangan Usaha",
        deskripsi:
          "Keterangan resmi kepemilikan usaha untuk keperluan administratif.",
        icon: "briefcase",
        kodeFormat: "SKU",
        templateFields: JSON.stringify([
          {
            key: "namaUsaha",
            label: "Nama Usaha",
            type: "text",
            required: true,
          },
          {
            key: "jenisUsaha",
            label: "Jenis Usaha",
            type: "text",
            required: true,
          },
          {
            key: "alamatUsaha",
            label: "Alamat Usaha",
            type: "text",
            required: true,
          },
          {
            key: "keteranganTambahan",
            label: "Keterangan Tambahan",
            type: "textarea",
            required: false,
          },
        ]),
      },
      {
        nama: "Surat Keterangan Domisili",
        deskripsi:
          "Keterangan tempat tinggal warga untuk keperluan administratif.",
        icon: "map-pin",
        kodeFormat: "SKD",
        templateFields: JSON.stringify([
          {
            key: "lamaTinggal",
            label: "Lama Tinggal",
            type: "text",
            required: true,
            placeholder: "Contoh: 5 tahun",
          },
          {
            key: "keperluan",
            label: "Keperluan",
            type: "text",
            required: true,
          },
          {
            key: "keteranganTambahan",
            label: "Keterangan Tambahan",
            type: "textarea",
            required: false,
          },
        ]),
      },
      {
        nama: "Surat Keterangan Tidak Mampu",
        deskripsi:
          "Keterangan status ekonomi tidak mampu untuk keperluan bantuan/administrasi.",
        icon: "heart-handshake",
        kodeFormat: "SKTM",
        templateFields: JSON.stringify([
          {
            key: "keperluan",
            label: "Keperluan",
            type: "text",
            required: true,
            placeholder: "Contoh: Bantuan pendidikan",
          },
          {
            key: "keteranganTambahan",
            label: "Keterangan Tambahan",
            type: "textarea",
            required: false,
          },
        ]),
      },
      {
        nama: "Surat Keterangan Lainnya",
        deskripsi:
          "Keterangan umum atau khusus yang tidak tercakup dalam kategori standar.",
        icon: "ellipsis",
        kodeFormat: "SKL",
        templateFields: JSON.stringify([
          { key: "perihal", label: "Perihal", type: "text", required: true },
          {
            key: "isiKeterangan",
            label: "Isi Keterangan",
            type: "textarea",
            required: true,
          },
        ]),
      },
    ],
  });

  console.log(`Seed selesai: ${warga.count} warga ditambahkan.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
