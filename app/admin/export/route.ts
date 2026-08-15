import ExcelJS from "exceljs";
import { getRegistros } from "../data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const registros = await getRegistros(from, to);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Asistentes");

  sheet.columns = [
    { header: "Nombre", key: "nombre", width: 30 },
    { header: "Empresa", key: "empresa", width: 25 },
    { header: "Correo", key: "correo", width: 35 },
    { header: "Cargo", key: "cargo", width: 25 },
    { header: "Fecha de registro", key: "fecha", width: 22 },
  ];

  // Encabezado en negrita con fondo azul marino
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF000D22" },
  };

  for (const r of registros) {
    sheet.addRow({
      nombre: r.nombre,
      empresa: r.empresa,
      correo: r.correo,
      cargo: r.cargo || "",
      fecha: r.fecha
        ? new Date(r.fecha).toLocaleString("es-MX", {
            timeZone: "America/Mexico_City",
          })
        : "",
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  const sufijo =
    from || to ? `_${from || "inicio"}_a_${to || "hoy"}` : "";

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="asistentes-summit${sufijo}.xlsx"`,
    },
  });
}
