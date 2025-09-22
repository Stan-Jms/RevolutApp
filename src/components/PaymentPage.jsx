import React from "react";

export default function PaymentPage({ heroSrc, chargerSrc, onStart, onCancel }) {
  const hero = resolveSrc(heroSrc, "/mnt/data/40871727-0fea-4863-a245-caa231b29923.png");
  const charger = resolveSrc(chargerSrc, "/mnt/data/9c3bd324-94de-4ff9-9e03-f641e0b0936a.png");

  return (
    <div className="absolute inset-0 z-[1600] w-full h-full bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        {/* Illustration top (img) */}
        <img src={hero} alt="Voiture et borne" className="absolute top-0 left-0 w-full h-[52%] object-cover" />

        {/* Bandeau blanc */}
        <div className="absolute top-[52%] left-0 right-0 h-[4%] bg-white" />

        {/* Contenu */}
        <div className="absolute left-4 right-4 top-[56%]">
          <div className="-mt-10 mb-3 flex justify-center">
            <div className="h-20 w-20 rounded-full ring-4 ring-[#E9D3A2] overflow-hidden bg-white shadow">
              <img src={charger} alt="Borne" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#E3B554] bg-white p-3 text-center text-[14px] text-neutral-800 shadow-sm">
            Veuillez brancher le connecteur de charge à la voiture et appuyer
            <span className="font-semibold text-[#C79E4F]"> Commencer la charge</span>
          </div>

          <div className="mt-4 space-y-3">
            <button
              onClick={onStart || (() => alert("Commencer la charge"))}
              className="h-12 w-full rounded-2xl bg-[#D8B25E] text-white font-semibold shadow hover:bg-[#C79E4F]"
            >
              Commencer la charge
            </button>
            <button
              onClick={onCancel || (() => window.history.back())}
              className="h-12 w-full rounded-2xl bg-[#F3E6C9] text-[#BA9A58] font-semibold shadow-inner"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function resolveSrc(src, fallback) {
  return typeof src === "string" && src.length > 0 ? src : fallback || "";
}

function safeAsset(relativePath) {
  try {
    return new URL(relativePath, import.meta.url).href;
  } catch {
    return "";
  }
}

// tests (dev-only)
try {
  console.assert(resolveSrc("A", "B") === "A", "resolveSrc direct");
  console.assert(resolveSrc("", "B") === "B", "resolveSrc fallback");
} catch (e) {
  console.warn("[tests PaymentPage]", e);
}


