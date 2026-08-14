"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  idx,
  fecha,
  correo,
  nombre,
}: {
  idx: number;
  fecha: string;
  correo: string;
  nombre: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`¿Eliminar el registro de "${nombre}"?`)) return;
    setBusy(true);
    try {
      const res = await fetch("/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idx, fecha, correo }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "No se pudo eliminar. Recarga la página.");
      }
      router.refresh();
    } catch {
      alert("Error de conexión al eliminar.");
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="rounded-md border border-red-600 px-3 py-1 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
    >
      {busy ? "..." : "Eliminar"}
    </button>
  );
}
