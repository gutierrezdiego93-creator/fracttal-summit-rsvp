"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function RsvpForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      nombre: (form.elements.namedItem("nombre") as HTMLInputElement).value,
      empresa: (form.elements.namedItem("empresa") as HTMLInputElement).value,
      correo: (form.elements.namedItem("correo") as HTMLInputElement).value,
      cargo: (form.elements.namedItem("cargo") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border-2 border-[#2929FF] p-6 text-center">
        <p className="text-lg font-bold text-[#000D22]">
          ¡Listo! Tu asistencia quedó confirmada.
        </p>
        <p className="mt-1 text-sm text-[#000D22]/70">
          Nos vemos el jueves 27 de agosto.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[#000D22]/20 px-4 py-3 text-[#000D22] outline-none focus:border-[#2929FF] focus:ring-2 focus:ring-[#2929FF]/20";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="nombre"
        type="text"
        required
        placeholder="Nombre completo *"
        className={inputClass}
      />
      <input
        name="empresa"
        type="text"
        required
        placeholder="Empresa *"
        className={inputClass}
      />
      <input
        name="correo"
        type="email"
        required
        placeholder="Correo electrónico *"
        className={inputClass}
      />
      <input
        name="cargo"
        type="text"
        placeholder="Cargo (opcional)"
        className={inputClass}
      />

      {status === "error" && (
        <p className="text-sm font-bold text-red-600">
          Ocurrió un error al enviar tu confirmación. Inténtalo de nuevo.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-[#2929FF] px-6 py-3 font-bold text-white transition hover:bg-[#1f1fd6] disabled:opacity-60"
      >
        {status === "sending" ? "Enviando..." : "Confirmar asistencia"}
      </button>
    </form>
  );
}
