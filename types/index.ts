export type JenisKelamin = "LAKI_LAKI" | "PEREMPUAN";

export type StatusKawin =
  | "BELUM_KAWIN"
  | "KAWIN"
  | "CERAI_HIDUP"
  | "CERAI_MATI";

export type FieldType = "text" | "date" | "select" | "textarea";

export type FieldSchema = {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type Warga = {
  id: string;
  nik: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: Date;
  jenisKelamin: JenisKelamin;
  agama: string;
  alamat: string;
  rt: string;
  rw: string;
  statusKawin: StatusKawin;
  pekerjaan: string | null;
};

export type JenisSurat = {
  id: string;
  nama: string;
  deskripsi: string;
  icon: string;
  kodeFormat: string;
  templateFields: FieldSchema[];
};

export type WargaSearchResult = Pick<Warga, "id" | "nik" | "namaLengkap">;

export type SuratSearchResult = {
  id: string;
  nomorSurat: string;
  warga: Pick<Warga, "namaLengkap">;
  jenisSurat: Pick<JenisSurat, "nama">;
};

function isFieldSchema(value: unknown): value is FieldSchema {
  if (typeof value !== "object" || value === null) return false;

  const field = Object.fromEntries(Object.entries(value));
  return (
    typeof field.key === "string" &&
    typeof field.label === "string" &&
    (field.type === "text" ||
      field.type === "date" ||
      field.type === "select" ||
      field.type === "textarea") &&
    typeof field.required === "boolean"
  );
}

export function parseFieldSchemas(value: unknown): FieldSchema[] {
  if (typeof value === "string") {
    try {
      return parseFieldSchemas(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) return [];

  return value.filter(isFieldSchema);
}

export function parseFormData(value: unknown): Record<string, string> {
  if (typeof value === "string") {
    try {
      return parseFormData(JSON.parse(value));
    } catch {
      return {};
    }
  }

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}
