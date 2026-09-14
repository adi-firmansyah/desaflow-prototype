import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama biar seed idempotent
  await prisma.surat.deleteMany();
  await prisma.jenisSurat.deleteMany();
  await prisma.warga.deleteMany();

  // --- Data Warga ---
  const warga = await prisma.warga.createMany({
    data: [
      {
        nik: "3201234567890001",
        namaLengkap: "Ahmad Syafiq",
        tempatLahir: "Bandung",
        tanggalLahir: new Date("1990-03-12"),
        jenisKelamin: "LAKI_LAKI",
        agama: "Islam",
        alamat: "Dusun Krajan, RT 01/RW 02, Desa Suka Maju",
        rt: "01",
        rw: "02",
        statusKawin: "BELUM_KAWIN",
        pekerjaan: "Wiraswasta",
      },
      {
        nik: "3404051234567890",
        namaLengkap: "Budi Santoso",
        tempatLahir: "Sleman",
        tanggalLahir: new Date("1965-08-15"),
        jenisKelamin: "LAKI_LAKI",
        agama: "Islam",
        alamat: "Jl. Manggis No 45, RT 02/RW 05, Caturtunggal, Depok, Sleman",
        rt: "02",
        rw: "05",
        statusKawin: "KAWIN",
        pekerjaan: "Petani",
      },
      {
        nik: "3201234567890045",
        namaLengkap: "Siti Aminah",
        tempatLahir: "Subang",
        tanggalLahir: new Date("1988-11-20"),
        jenisKelamin: "PEREMPUAN",
        agama: "Islam",
        alamat: "Jl. Kenanga No 12, RT 03/RW 01, Desa Suka Maju",
        rt: "03",
        rw: "01",
        statusKawin: "CERAI_MATI",
        pekerjaan: "Ibu Rumah Tangga",
      },
      {
        nik: "3201234567890078",
        namaLengkap: "Ratna Dewi",
        tempatLahir: "Purwakarta",
        tanggalLahir: new Date("1995-06-05"),
        jenisKelamin: "PEREMPUAN",
        agama: "Islam",
        alamat: "Jl. Melati No 7, RT 04/RW 02, Desa Suka Maju",
        rt: "04",
        rw: "02",
        statusKawin: "KAWIN",
        pekerjaan: "Guru",
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
