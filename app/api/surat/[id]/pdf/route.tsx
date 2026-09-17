import { SuratPdfDocument } from "@/components/pdf/surat-pdf-document";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/require-session";
import { parseFieldSchemas, parseFormData } from "@/types";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession(request.headers);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const surat = await prisma.surat.findUnique({
    where: { id },
    include: { warga: true, jenisSurat: true },
  });

  if (!surat) {
    return NextResponse.json(
      { error: "Surat tidak ditemukan" },
      { status: 404 },
    );
  }

  const fields = parseFieldSchemas(surat.jenisSurat.templateFields);
  const dataForm = parseFormData(surat.dataForm);

  const pdfBuffer = await renderToBuffer(
    <SuratPdfDocument
      nomorSurat={surat.nomorSurat}
      jenisSuratNama={surat.jenisSurat.nama}
      warga={surat.warga}
      fields={fields}
      dataForm={dataForm}
    />,
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${surat.nomorSurat.replace(/\//g, "-")}.pdf"`,
    },
  });
}
