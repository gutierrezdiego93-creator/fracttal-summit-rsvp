import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nombre, empresa, correo, cargo } = data;

    if (!nombre || !empresa || !correo) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    await kv.rpush(
      "rsvp:summit",
      JSON.stringify({
        nombre,
        empresa,
        correo,
        cargo: cargo || "",
        fecha: new Date().toISOString(),
      })
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
