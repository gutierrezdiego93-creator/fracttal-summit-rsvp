import RsvpForm from "./RsvpForm";

const horarios = [
  { pais: "México", ciudad: "CDMX", hora: "10:00 am", flag: "fi-mx" },
  { pais: "Colombia", ciudad: "Bogotá", hora: "11:00 am", flag: "fi-co" },
  { pais: "Chile", ciudad: "Santiago", hora: "12:00 pm", flag: "fi-cl" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="flex flex-col items-center text-center">
        {/* Logo real subido a /public/logo.png — no reemplazar */}
        <img src="/logo.png" alt="Fracttal Partners" width={220} />

        <h1 className="mt-8 text-4xl font-bold text-[#000D22]">
          Fracttal Partner Connect
        </h1>
        <p className="mt-3 text-lg text-[#000D22]/80">
          La primera cumbre estratégica del ecosistema de partners.
        </p>

        <p className="mt-6 inline-block rounded-full bg-[#2929FF] px-5 py-2 text-sm font-bold text-white">
          Jueves 27 de agosto · Virtual · 1h 30min
        </p>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {horarios.map((h) => (
          <div
            key={h.pais}
            className="rounded-xl bg-[#F5F6FA] p-5 text-center"
          >
            <span className={`fi ${h.flag} text-3xl`} />
            <p className="mt-2 font-bold text-[#000D22]">{h.pais}</p>
            <p className="text-sm text-[#000D22]/70">{h.ciudad}</p>
            <p className="mt-1 text-xl font-bold text-[#2929FF]">{h.hora}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold text-[#000D22]">
          Confirma tu asistencia
        </h2>
        <div className="mt-6">
          <RsvpForm />
        </div>
      </section>

      <footer className="mt-16 border-t border-[#000D22]/10 pt-6 text-center text-sm text-[#000D22]/60">
        Fracttal Partner Connect · Evento exclusivo para partners
      </footer>
    </main>
  );
}
