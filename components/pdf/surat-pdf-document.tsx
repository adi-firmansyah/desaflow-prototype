import type { FieldSchema } from "@/types";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

type SuratPdfProps = {
  nomorSurat: string;
  jenisSuratNama: string;
  warga: {
    namaLengkap: string;
    nik: string;
    tempatLahir: string;
    tanggalLahir: Date;
    jenisKelamin: string;
    agama: string;
    alamat: string;
    rt: string;
    rw: string;
  };
  fields: FieldSchema[];
  dataForm: Record<string, string>;
};

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    borderBottom: 2,
    borderBottomColor: "#000",
    paddingBottom: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  title: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  nomor: {
    textAlign: "center",
    fontSize: 11,
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 1.5,
  },
  table: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  labelCell: {
    width: 160,
  },
  colonCell: {
    width: 12,
  },
  valueCell: {
    flex: 1,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
});

export function SuratPdfDocument({
  nomorSurat,
  jenisSuratNama,
  warga,
  fields,
  dataForm,
}: SuratPdfProps) {
  const tanggalLahirFormatted = new Date(warga.tanggalLahir).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pemerintah Desa</Text>
          <Text>Alamat Kantor Desa</Text>
        </View>

        <Text style={styles.title}>{jenisSuratNama}</Text>
        <Text style={styles.nomor}>Nomor: {nomorSurat}</Text>

        <Text style={styles.paragraph}>
          Yang bertanda tangan di bawah ini, Kepala Desa, menerangkan dengan
          sesungguhnya bahwa:
        </Text>

        <View style={styles.table}>
          <Row label="Nama Lengkap" value={warga.namaLengkap} bold />
          <Row label="NIK" value={warga.nik} />
          <Row
            label="Tempat, Tanggal Lahir"
            value={`${warga.tempatLahir}, ${tanggalLahirFormatted}`}
          />
          <Row
            label="Jenis Kelamin"
            value={
              warga.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"
            }
          />
          <Row label="Agama" value={warga.agama} />
          <Row
            label="Alamat"
            value={`${warga.alamat}, RT ${warga.rt}/RW ${warga.rw}`}
          />
        </View>

        <Text style={styles.sectionTitle}>Keterangan:</Text>
        <View style={styles.table}>
          {fields.map((field) => (
            <Row
              key={field.key}
              label={field.label}
              value={dataForm[field.key] || "-"}
            />
          ))}
        </View>
      </Page>
    </Document>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.labelCell}>{label}</Text>
      <Text style={styles.colonCell}>:</Text>
      <Text style={[styles.valueCell, bold ? styles.bold : {}]}>{value}</Text>
    </View>
  );
}
