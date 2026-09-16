import { SuratPdfDocument } from "@/components/pdf/surat-pdf-document";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const fields = JSON.parse(surat.jenisSurat.templateFields as string);
  const dataForm = JSON.parse(surat.dataForm as string);

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
