import { kv } from "@vercel/kv";

export type Registro = {
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

/**
 * Lee todos los registros de KV y los filtra por rango de fechas
 * (from/to en formato YYYY-MM-DD, ambos inclusivos).
 */
export async function getRegistros(
  from?: string,
  to?: string
): Promise<Registro[]> {
  const raw = await kv.lrange("rsvp:summit", 0, -1);
  let registros = raw
    .map(parseRegistro)
    .filter((r): r is Registro => r !== null);

  const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : null;
  const toTime = to ? new Date(`${to}T23:59:59.999`).getTime() : null;

  if (fromTime || toTime) {
    registros = registros.filter((r) => {
      const t = new Date(r.fecha).getTime();
      if (Number.isNaN(t)) return false;
      if (fromTime && t < fromTime) return false;
      if (toTime && t > toTime) return false;
      return true;
    });
  }

  // Más recientes primero
  return registros.reverse();
}
