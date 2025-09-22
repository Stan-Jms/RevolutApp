import React from "react";

export default function ChargingSummaryPage({ onClose, onRate }) {
  return (
    <div className="absolute inset-0 z-[1950] w-full h-full bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#D8B25E] text-white flex items-center justify-center">
          <h1 className="text-[16px] font-semibold">Résumé de recharge</h1>
          <button onClick={onClose} className="absolute right-4 h-8 w-8 grid place-items-center rounded-full bg-white/20" aria-label="Fermer">✕</button>
        </div>

        <div className="absolute inset-x-0 top-16 bottom-2 overflow-y-auto px-4 py-4 space-y-6">
          <Section title="Informations sur le véhicule">
            <Row label="Plaque d’immatriculation" value="AB 123 CD" />
          </Section>

          <Section title="Infos de l’hôte">
            <Row label="Nom" value="Rémi" />
            <Row label="Adresse" value={"172 Avenue d'Aubervilliers\nParis 75019"} multiline />
          </Section>

          <Section title="Informations de recharge">
            <Row label="Commencer à" value="11/09/25   11:30" />
            <Row label="Terminer à" value="11/09/25   12:30" />
            <Row label="Utilisation (kWh)" value="50.25   kWh" />
            <Row label="Coût du service (Euro)" value="16.56   Eur" />
          </Section>

          <div className="pt-1">
            <button onClick={onClose} className="h-12 w-full rounded-2xl bg-[#D8B25E] text-white font-semibold shadow hover:bg-[#C79E4F]">Terminer</button>
            <button onClick={onRate} className="mt-3 h-12 w-full rounded-2xl bg-[#F5E7C4] text-[#C79E4F] font-semibold border border-[#E5D199]">Noter la Borne</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-[16px] font-semibold text-neutral-900 mb-2">{title}</h2>
      <div className="rounded-2xl border border-[#E5D199] bg-white shadow-sm p-3 space-y-3">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, multiline }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-3">
      <div className="text-[13px] text-neutral-600">{label}</div>
      <div className="text-right text-[14px] text-neutral-900 whitespace-pre-line">{value}</div>
    </div>
  );
}


