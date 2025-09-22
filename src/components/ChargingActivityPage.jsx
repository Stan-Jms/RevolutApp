import React from "react";

export default function ChargingActivityPage({ onClose, onStop, stationName = "Chez Rémi" }) {
  const [elapsedMs, setElapsedMs] = React.useState(0);

  React.useEffect(() => {
    const startedAt = Date.now();
    const t = setInterval(() => setElapsedMs(Date.now() - startedAt), 1000);
    return () => clearInterval(t);
  }, []);

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");

  return (
    <div className="absolute inset-0 z-[1900] w-full h-full bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#D8B25E] text-white flex items-center justify-center">
          <h1 className="text-[16px] font-semibold">Activité de charge</h1>
          <button onClick={onClose} className="absolute right-4 h-8 w-8 grid place-items-center rounded-full bg-white/20" aria-label="Fermer">✕</button>
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 top-16 bottom-2 overflow-y-auto px-4 py-4">
          <h2 className="text-[16px] font-semibold text-neutral-900 mb-3">Ma voiture</h2>
          <div className="rounded-2xl border border-[#E5D199] bg-white shadow-sm p-2 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-semibold text-[14px] text-neutral-900">Polo</div>
              <div className="text-[12px] text-neutral-500">AB 123 CD</div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-[#EED9A5] text-[#6A5216] text-[12px] font-medium">
              En charge
            </div>
          </div>

          <h2 className="text-[16px] font-semibold text-neutral-900 mt-6 mb-3">Activité de recharge</h2>
          <div className="rounded-2xl border-2 border-[#E5D199] bg-white shadow-sm p-4">
            <div className="text-center mb-2">
              <div className="text-[22px] font-bold tracking-wider">
                {h} : {m} : {s}
              </div>
              <div className="text-[12px] text-[#C79E4F]">Hours</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Metric label="Prix de recharge" value="5.5" unit="Euro" />
              <Metric label="Recharge" value="30" unit="kW/h" />
              <Metric label="Prix Kwh" value="0.16" unit="Euro" />
              <Metric label="Stationnement" value="18" unit="Mins" />
            </div>
            <button onClick={onStop} className="mt-4 h-12 w-full rounded-2xl bg-[#D8B25E] text-white font-semibold shadow hover:bg-[#C79E4F]">
              Terminer la recharge
            </button>
            <button onClick={onClose} className="mt-3 h-12 w-full rounded-2xl bg-white text-[#C79E4F] font-semibold border border-[#E5D199]">
              Masquer dans l’activité
            </button>
          </div>

          <div className="mt-4 text-center text-[12px] text-neutral-500">Station: {stationName}</div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, unit }) {
  return (
    <div className="rounded-xl border-2 border-[#E5D199] p-3 text-center">
      <div className="text-[12px] text-neutral-700 mb-1">{label}</div>
      <div className="text-[#C79E4F] font-bold text-[22px] leading-none">{value} <span className="text-[12px] align-top text-neutral-700 font-medium">{unit}</span></div>
    </div>
  );
}


