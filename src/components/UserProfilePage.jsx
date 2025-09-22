import React from "react";
import { motion } from "framer-motion";

export default function UserProfilePage({ onBack, onLogout }) {
  return (
    <motion.div
      className="absolute inset-0 z-[1200] bg-white"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between bg-[#D8B25E] text-white px-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10" aria-label="Retour">‹</button>
        <h1 className="font-semibold">Compte</h1>
        <span className="w-6" />
      </div>

      <div className="absolute inset-x-0 top-16 bottom-0 overflow-y-auto px-5 py-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-[#EED9A5]">
            <img src="https://i.pravatar.cc/200" alt="Profil" className="h-full w-full object-cover" />
          </div>
          <h2 className="mt-3 text-xl font-semibold text-neutral-900">Stanley</h2>
          <div className="mt-1 text-[#D8B25E]">★★★★★ <span className="text-neutral-600 text-sm">4.6</span></div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="text-neutral-500 text-sm">J’ai rechargé …</div>
            <div className="text-neutral-900 font-semibold">1265 Véhicules</div>
          </div>
          <div>
            <div className="text-neutral-500 text-sm">Pour un profit de …</div>
            <div className="text-neutral-900 font-semibold">13.123€</div>
          </div>
          <div>
            <div className="text-neutral-500 text-sm">J’ai agi à hauteur de …</div>
            <div className="text-neutral-900 font-semibold">257 Kg de CO2</div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm text-neutral-600 text-center mb-3">Nombre de recharge de la semaine</h3>
          <div className="rounded-2xl border border-[#E5D199] bg-white p-3">
            <LineChart
              data={[4,5,3,6,7,6,5]}
              labels={["Jeu","Ven","Sam","Dim","Lun","Mar","Mer"]}
              stroke="#D8B25E"
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm text-neutral-600 text-center mb-3">Mes revenus mensuels</h3>
          <div className="rounded-2xl border border-[#E5D199] bg-white p-3">
            <BarChart
              data={[684,721,699,0,762,0,797]}
              labels={["Jan","Fév","Mar","Avr","Mai","Juin","Juil"]}
              barColor="#D8B25E"
            />
          </div>
        </div>

        {/* Activités récentes */}
        <div className="mt-6">
          <h3 className="text-sm text-neutral-600 mb-3">Activités récentes</h3>
          <div className="space-y-3">
            {[
              { t: "Chez Rémi", d: "Hier • 14:20", kwh: 12.4, price: 4.9 },
              { t: "Chez Aya", d: "Mar • 18:02", kwh: 9.8, price: 3.6 },
              { t: "Chez Amine", d: "Lun • 09:47", kwh: 15.2, price: 5.7 },
            ].map((a, i) => (
              <div key={i} className="rounded-xl border border-[#E5D199] bg-white px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-neutral-900">{a.t}</div>
                  <div className="text-[12px] text-neutral-600">{a.d}</div>
                </div>
                <div className="text-right text-[12px] text-neutral-700">
                  <div><span className="font-semibold">{a.kwh}</span> kWh</div>
                  <div><span className="font-semibold">{a.price}€</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Déconnexion */}
        <div className="mt-8 mb-4">
          <button
            onClick={() => {
              try { sessionStorage.removeItem("ownerMode"); } catch {}
              if (typeof onLogout === "function") onLogout();
              else if (typeof onBack === "function") onBack();
            }}
            className="w-full h-12 rounded-2xl bg-[#F3E6C9] text-[#BA9A58] font-semibold shadow-inner hover:bg-[#EEDCB8] active:scale-[.99]"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function LineChart({ data = [], labels = [], stroke = "#333" }) {
  const w = 320; const h = 120; const pad = 24;
  const max = Math.max(...data, 1); const min = Math.min(...data, 0);
  const scaleX = (i) => pad + (i * (w - 2*pad)) / Math.max(data.length - 1, 1);
  const scaleY = (v) => h - pad - ((v - min) * (h - 2*pad)) / Math.max(max - min || 1, 1);
  const pts = data.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36">
      <rect x="0" y="0" width={w} height={h} rx="10" fill="transparent" />
      {[0,1,2,3].map((g) => (
        <line key={g} x1={pad} x2={w-pad} y1={pad + g*((h-2*pad)/3)} y2={pad + g*((h-2*pad)/3)} stroke="#eee" />
      ))}
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2.5" />
      {data.map((v,i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY(v)} r="3" fill={stroke} />
      ))}
      {labels.map((l,i) => (
        <text key={l} x={scaleX(i)} y={h-6} textAnchor="middle" fontSize="10" fill="#777">{l}</text>
      ))}
    </svg>
  );
}

function BarChart({ data = [], labels = [], barColor = "#333" }) {
  const w = 320; const h = 140; const pad = 24; const gap = 8;
  const max = Math.max(...data, 1);
  const bw = (w - 2*pad - gap*(data.length-1)) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
      <rect x="0" y="0" width={w} height={h} rx="10" fill="transparent" />
      {[0,1,2,3].map((g) => (
        <line key={g} x1={pad} x2={w-pad} y1={pad + g*((h-2*pad)/3)} y2={pad + g*((h-2*pad)/3)} stroke="#eee" />
      ))}
      {data.map((v,i) => {
        const x = pad + i*(bw+gap);
        const bh = ((v/max) * (h - 2*pad));
        const y = h - pad - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx="6" fill={barColor} />
            <text x={x + bw/2} y={h-6} textAnchor="middle" fontSize="10" fill="#777">{labels[i] || ''}</text>
          </g>
        );
      })}
    </svg>
  );
}


