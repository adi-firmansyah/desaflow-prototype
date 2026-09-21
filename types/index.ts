import type { Warga, JenisSurat } from "../prisma/generated/client";

export type { Warga, JenisSurat };
export * from "../prisma/generated/client";

export type FieldType = "text" | "date" | "select" | "textarea";

export type FieldSchema = {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
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
