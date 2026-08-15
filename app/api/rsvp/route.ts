import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

async function notificarTeams(registro: {
  nombre: string;
  empresa: string;
  correo: string;
  cargo: string;
  fecha: string;
}) {
  const url = process.env.TEAMS_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "message",
        attachments: [
          {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
              $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
              type: "AdaptiveCard",
              version: "1.4",
              body: [
                {
                  type: "TextBlock",
                  text: "🎉 Nuevo registro — Fracttal Partner Connect",
                  weight: "Bolder",
                  size: "Medium",
                  wrap: true,
                },
                {
                  type: "FactSet",
                  facts: [
                    { title: "Nombre:", value: registro.nombre },
                    { title: "Empresa:", value: registro.empresa },
                    { title: "Correo:", value: registro.correo },
                    { title: "Cargo:", value: registro.cargo || "—" },
                    {
                      title: "Fecha:",
                      value: new Date(registro.fecha).toLocaleString("es-MX", {
                        timeZone: "America/Mexico_City",
                      }),
                    },
                  ],
                },
              ],
            },
          },
        ],
      }),
    });
  } catch {
    // La notificación nunca debe bloquear el registro
  }
}

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

    const registro = {
      nombre,
      empresa,
      correo,
      cargo: cargo || "",
      fecha: new Date().toISOString(),
    };

    await kv.rpush("rsvp:summit", JSON.stringify(registro));

    await notificarTeams(registro);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
