import { getRegistros, type Registro } from "./data";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;

  let registros: Registro[] = [];
  let error = false;

  try {
    registros = await getRegistros(from, to);
  } catch {
    error = true;
  }

  const exportQuery = new URLSearchParams();
  if (from) exportQuery.set("from", from);
  if (to) exportQuery.set("to", to);
  const exportHref = `/admin/export${
    exportQuery.size > 0 ? `?${exportQuery.toString()}` : ""
  }`;

  const filtroActivo = Boolean(from || to);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#000D22]">
            Asistentes confirmados
          </h1>
          <p className="mt-2 text-lg font-bold text-[#2929FF]">
            Total: {registros.length}
            {filtroActivo && (
              <span className="ml-2 text-sm font-normal text-[#000D22]/60">
                (filtrado{from ? ` desde ${from}` : ""}
                {to ? ` hasta ${to}` : ""})
              </span>
            )}
          </p>
        </div>

        <a
          href={exportHref}
          className="rounded-lg bg-[#2929FF] px-5 py-3 font-bold text-white transition hover:bg-[#1f1fd6]"
        >
          Descargar Excel
        </a>
      </div>

      <form
        method="GET"
        className="mt-8 flex flex-wrap items-end gap-4 rounded-xl bg-[#F5F6FA] p-5"
      >
        <label className="flex flex-col gap-1 text-sm font-bold text-[#000D22]">
          Desde
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="rounded-lg border border-[#000D22]/20 bg-white px-3 py-2 font-normal text-[#000D22] outline-none focus:border-[#2929FF]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold text-[#000D22]">
          Hasta
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="rounded-lg border border-[#000D22]/20 bg-white px-3 py-2 font-normal text-[#000D22] outline-none focus:border-[#2929FF]"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-[#000D22] px-5 py-2.5 font-bold text-white transition hover:bg-[#00081a]"
        >
          Filtrar
        </button>
        {filtroActivo && (
          <a
            href="/admin"
            className="px-2 py-2.5 text-sm font-bold text-[#2929FF] underline"
          >
            Limpiar filtro
          </a>
        )}
      </form>

      {error && (
        <p className="mt-6 text-red-600">
          No se pudo conectar con la base de datos (KV). Verifica la
          configuración en Vercel.
        </p>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-[#000D22] text-[#000D22]">
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Empresa</th>
              <th className="px-3 py-2">Correo</th>
              <th className="px-3 py-2">Cargo</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr
                key={i}
                className="border-b border-[#000D22]/10 text-[#000D22]"
              >
                <td className="px-3 py-2 font-bold">{r.nombre}</td>
                <td className="px-3 py-2">{r.empresa}</td>
                <td className="px-3 py-2">{r.correo}</td>
                <td className="px-3 py-2">{r.cargo || "—"}</td>
                <td className="px-3 py-2">
                  {r.fecha
                    ? new Date(r.fecha).toLocaleString("es-MX", {
                        timeZone: "America/Mexico_City",
                      })
                    : "—"}
                </td>
                <td className="px-3 py-2 text-right">
                  <DeleteButton
                    idx={r.idx}
                    fecha={r.fecha}
                    correo={r.correo}
                    nombre={r.nombre}
                  />
                </td>
              </tr>
            ))}
            {registros.length === 0 && !error && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-[#000D22]/60"
                >
                  {filtroActivo
                    ? "No hay confirmaciones en ese periodo."
                    : "Aún no hay confirmaciones."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
