import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

type Registro = {
  nombre: string;
  empresa: string;
  correo: string;
  cargo: string;
  fecha: string;
};

function parseRegistro(raw: unknown): Registro | null {
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (obj && typeof obj === "object" && "nombre" in obj) {
      return obj as Registro;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  let registros: Registro[] = [];
  let error = false;

  try {
    const raw = await kv.lrange("rsvp:summit", 0, -1);
    registros = raw
      .map(parseRegistro)
      .filter((r): r is Registro => r !== null)
      .reverse();
  } catch {
    error = true;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-[#000D22]">
        Asistentes confirmados
      </h1>
      <p className="mt-2 text-lg text-[#2929FF] font-bold">
        Total: {registros.length}
      </p>

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
                  {r.fecha ? new Date(r.fecha).toLocaleString("es-MX") : "—"}
                </td>
              </tr>
            ))}
            {registros.length === 0 && !error && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-[#000D22]/60"
                >
                  Aún no hay confirmaciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
