-- CreateTable
CREATE TABLE "surat_sequence" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "kodeFormat" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "surat_sequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "surat_sequence_year_kodeFormat_key" ON "surat_sequence"("year", "kodeFormat");

-- Backfill counters from the highest valid existing surat number.
WITH parsed_numbers AS (
    SELECT
        split_part("nomorSurat", '/', 1)::INTEGER AS "lastNumber",
        split_part("nomorSurat", '/', 2) AS "kodeFormat",
        split_part("nomorSurat", '/', 3)::INTEGER AS "year"
    FROM "surat"
    WHERE "nomorSurat" ~ '^[0-9]+/[^/]+/[0-9]{4}$'
), grouped_numbers AS (
    SELECT "year", "kodeFormat", MAX("lastNumber") AS "lastNumber"
    FROM parsed_numbers
    GROUP BY "year", "kodeFormat"
)
INSERT INTO "surat_sequence" ("id", "year", "kodeFormat", "lastNumber")
SELECT
    'legacy-' || md5("year"::TEXT || ':' || "kodeFormat"),
    "year",
    "kodeFormat",
    "lastNumber"
FROM grouped_numbers
ON CONFLICT ("year", "kodeFormat") DO NOTHING;
