import React from "react";

// === ETAPE SUIVANTE — Paiement (sélection du moyen de paiement) ===
// Utilisation : <PaymentMethodsPage onBack={()=>{}} onValidate={(d)=>console.log(d)} />
export default function PaymentMethodsPage({ onValidate, onBack }) {
  const [method, setMethod] = React.useState("mc");
  const [showAddCard, setShowAddCard] = React.useState(false);
  const price = 40;
  let chargerImg = "/revolt-charger.png";
  try {
    chargerImg = new URL("../assets/revolt-charger.png", import.meta.url).href;
  } catch {}

  return (
    <div className="absolute inset-0 z-[1700] w-full h-full bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        {/* Header sable */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#D8B25E] text-white flex items-center justify-center">
          <button onClick={onBack} className="absolute left-4 text-2xl leading-none" aria-label="Retour">‹</button>
          <h1 className="text-[16px] font-semibold">Paiement</h1>
        </div>

        {/* Contenu */}
        <div className="absolute inset-x-0 top-16 bottom-0 overflow-y-auto px-4 py-4 pb-24 space-y-5" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Résumé */}
          <div className="rounded-2xl bg-white shadow p-3 flex items-center gap-3">
            <img
              src={chargerImg}
              alt="Chargeur ReVOLT"
              className="h-14 w-14 rounded-xl object-contain bg-neutral-50 p-1"
            />
            <div className="flex-1">
              <p className="text-[13px] text-neutral-500 font-semibold">Résumé</p>
              <p className="text-[14px] font-semibold text-neutral-900">Chez Rémi</p>
              <div className="flex items-center gap-1 text-[12px] text-yellow-500">{"★".repeat(5)}<span className="ml-1 text-neutral-600">4.6</span></div>
              <p className="text-[12px] text-neutral-600 mt-0.5">172 Avenue d'Aubervilliers Paris 75019</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-neutral-500">Reserver</p>
              <p className="text-[16px] font-bold text-neutral-900">{price} €</p>
            </div>
          </div>

          {/* Offres */}
          <button className="w-full rounded-2xl bg-white shadow p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#EEF2FF] grid place-items-center">
                {/* petit ticket */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[14px] font-medium text-neutral-900">Offres</span>
            </div>
            <span className="text-neutral-400 text-xl">›</span>
          </button>

          {/* Cartes */}
          <div>
            <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">Crédit & Debit Cards</h3>
            <div className="rounded-2xl bg-white shadow p-3 space-y-3">
              <PaymentRow
                logo={<MastercardLogo/>}
                label="Axis Bank"
                last4="8395"
                selected={method === "mc"}
                onSelect={() => setMethod("mc")}
              />
              <PaymentRow
                logo={<VisaLogo/>}
                label="HDFC Bank"
                last4="6246"
                selected={method === "visa"}
                onSelect={() => setMethod("visa")}
              />
              <ActionRow label="Add New Card" onClick={() => setShowAddCard(true)} />
            </div>
          </div>

          {/* UPI / Wallets */}
          <div>
            <h3 className="text-[14px] font-semibold text-neutral-900 mb-2">UPI</h3>
            <div className="rounded-2xl bg-white shadow p-3 space-y-3">
              <PaymentRow
                logo={<PayPalLogo/>}
                label="PayPal"
                selected={method === "paypal"}
                onSelect={() => setMethod("paypal")}
              />
              <PaymentRow
                logo={<ApplePayLogo/>}
                label="apple pay"
                selected={method === "apple"}
                onSelect={() => setMethod("apple")}
              />
              <ActionRow label="Ajouter un nouvel identifiant UPI" />
            </div>
            {/* Bouton de confirmation juste sous l'élément UPI */}
            <button
              onClick={() => onValidate?.({ method, price, status: "validated" })}
              className="mt-4 h-12 w-full rounded-2xl bg-[#D8B25E] text-white font-semibold shadow hover:bg-[#C79E4F]"
            >
              Valider
            </button>
          </div>

        </div>

        {/* Barre gestuelle */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-36 rounded-full bg-neutral-900/80" />

        {showAddCard && (
          <AddCardSheet
            onClose={() => setShowAddCard(false)}
            onSave={(data) => {
              setShowAddCard(false);
              // Optionnel: sélectionner automatiquement une carte ajoutée
              setMethod("mc");
            }}
          />
        )}
      </div>
    </div>
  );
}

/* -- sous-composants UI simples (pas de lib) -- */
function PaymentRow({ logo, label, last4, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 rounded-xl border ${selected ? "border-[#D8B25E] bg-[#FFF9EA]" : "border-neutral-200 bg-white"} px-3 h-11`}
    >
      <div className="h-7 w-12 grid place-items-center">{logo}</div>
      <div className="flex-1 text-left text-[14px] text-neutral-800">
        <span className="font-medium">{label}</span>
        {last4 && <span className="text-neutral-500 ml-2">{maskLast4(last4)}</span>}
      </div>
      <Radio selected={!!selected}/>
    </button>
  );
}

function ActionRow({ label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-3 h-11 text-[14px] text-neutral-700">
      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-neutral-100 mr-1">+</span>
      {label}
    </button>
  );
}

function Radio({ selected }) {
  return (
    <span className={`inline-block h-5 w-5 rounded-full border ${selected ? "border-[#3B82F6]" : "border-neutral-300"} grid place-items-center`}>
      <span className={`h-2.5 w-2.5 rounded-full ${selected ? "bg-[#3B82F6]" : "bg-transparent"}`} />
    </span>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 40 24" width="40" height="24">
      <circle cx="14" cy="12" r="8" fill="#EA001B" />
      <circle cx="26" cy="12" r="8" fill="#FF9900" />
    </svg>
  );
}
function VisaLogo() {
  return <div className="text-[16px] font-extrabold text-[#1E3A8A]">VISA</div>;
}
function PayPalLogo() {
  return <div className="text-[14px] font-bold text-[#1f4e79]">Pay<span className="text-[#2185D0]">Pal</span></div>;
}
function ApplePayLogo() {
  return <div className="text-[14px] font-semibold text-black"> pay</div>;
}

/* -- helper + tests non bloquants -- */
function maskLast4(last4) {
  const clean = (last4 || "").toString().replace(/\D/g, "");
  return `**** **** **** ${clean.slice(-4)}`;
}
try {
  console.assert(maskLast4("8395").endsWith("8395"), "maskLast4 garde les 4 derniers");
  console.assert(maskLast4("6246").includes("**** **** ****"), "maskLast4 masque le reste");
} catch (e) { console.warn("[tests PaymentMethodsPage]", e); }


// — Bottom sheet pour ajouter une nouvelle carte —
function AddCardSheet({ onClose, onSave }) {
  const [num, setNum] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [holder, setHolder] = React.useState("");
  const [showCvv, setShowCvv] = React.useState(false);

  const isValid =
    /^(\d{12,19})$/.test(num.replace(/\s+/g, "")) &&
    /^(0?[1-9]|1[0-2])$/.test(month) &&
    /^(\d{2}|\d{4})$/.test(year) &&
    /^\d{3,4}$/.test(cvv) &&
    holder.trim().length > 1;

  return (
    <div className="absolute inset-0 z-[1800] bg-neutral-900/70 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-[393px] rounded-t-[28px] bg-white shadow-2xl max-h-[88%] overflow-hidden flex flex-col mb-[30%]">
        <div className="flex items-center justify-between p-4 pb-2">
          <h2 className="text-[18px] font-semibold text-neutral-900">Ajouter une nouvelle carte</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full bg-neutral-100" aria-label="Fermer">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          <label className="block text-[13px] text-neutral-600 mb-1">Numéro de carte</label>
          <input
            value={num}
            onChange={(e) => setNum(e.target.value)}
            placeholder="Enter 12 digit card number"
            inputMode="numeric"
            className="w-full h-11 px-3 rounded-xl border border-neutral-300 outline-none mb-4"
          />

          <div className="mb-4">
            <label className="block text-[13px] text-neutral-600 mb-1">Mois</label>
            <input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="mois" className="w-full h-11 px-3 rounded-xl border border-neutral-300 outline-none" />
          </div>

          <div className="mb-4">
            <label className="block text-[13px] text-neutral-600 mb-1">Année</label>
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Année" className="w-full h-11 px-3 rounded-xl border border-neutral-300 outline-none" />
          </div>

          <div className="mb-4">
            <label className="block text-[13px] text-neutral-600 mb-1">CVV</label>
            <div className="relative">
              <input
                type={showCvv ? "text" : "password"}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="CVV"
                inputMode="numeric"
                autoComplete="cc-csc"
                name="card-csc"
                maxLength={4}
                pattern="\\d{3,4}"
                className="w-full h-11 pr-10 px-3 rounded-xl border border-neutral-300 outline-none"
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
              />
              <button type="button" onClick={() => setShowCvv((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500" aria-label="Voir/Cacher">{showCvv ? "🙈" : "👁️"}</button>
            </div>
          </div>

          <label className="block text-[13px] text-neutral-600 mb-1">Nom du titulaire de la carte</label>
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            placeholder="Nom sur la carte"
            className="w-full h-11 px-3 rounded-xl border border-neutral-300 outline-none mb-5"
          />
        </div>

        <div className="p-4 pt-3 bg-white" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 20px)' }}>
          <button
            disabled={!isValid}
            onClick={() => onSave?.({ num, month, year, cvv, holder })}
            className="h-12 w-full rounded-2xl bg-[#D8B25E] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enregistrer la carte et continuer
          </button>
        </div>
      </div>
    </div>
  );
}

