import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { parseRegistro } from "../data";

export const dynamic = "force-dynamic";

const KEY = "rsvp:summit";
const SENTINEL = "__ELIMINADO__";

export async function POST(request: Request) {
  try {
    const { idx, fecha, correo } = await request.json();

    if (typeof idx !== "number" || idx < 0 || !fecha || !correo) {
      return NextResponse.json(
        { ok: false, error: "Parámetros inválidos" },
        { status: 400 }
      );
    }

    // Verificar que el registro en esa posición sea el esperado
    // (evita borrar el equivocado si la lista cambió entre lecturas)
    const raw = await kv.lindex(KEY, idx);
    const registro = parseRegistro(raw);

    if (!registro || registro.fecha !== fecha || registro.correo !== correo) {
      return NextResponse.json(
        { ok: false, error: "El registro cambió, recarga la página" },
        { status: 409 }
      );
    }

    // Patrón estándar de Redis para borrar por índice
    await kv.lset(KEY, idx, SENTINEL);
    await kv.lrem(KEY, 1, SENTINEL);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
