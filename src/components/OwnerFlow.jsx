import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Star, ChevronLeft, ChevronRight, QrCode, Phone, Plus, X, Power } from "lucide-react";

const classNames = (...c) => c.filter(Boolean).join(" ");
const formatDate = (d) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

function useMonth(date = new Date()) {
  const [cursor, setCursor] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
  const monthName = cursor.toLocaleDateString("fr-FR", { month: "long" });
  const year = cursor.getFullYear();

  const days = useMemo(() => {
    const firstDay = new Date(year, cursor.getMonth(), 1);
    const lastDay = new Date(year, cursor.getMonth() + 1, 0);
    const startPadding = (firstDay.getDay() + 6) % 7; // Lundi=0
    const total = startPadding + lastDay.getDate();
    const weeks = Math.ceil(total / 7);
    const grid = [];
    let dayNum = 1;
    for (let w = 0; w < weeks; w++) {
      const row = [];
      for (let i = 0; i < 7; i++) {
        const idx = w * 7 + i;
        if (idx < startPadding || dayNum > lastDay.getDate()) {
          row.push(null);
        } else {
          row.push(new Date(year, cursor.getMonth(), dayNum++));
        }
      }
      grid.push(row);
    }
    return grid;
  }, [cursor, year]);

  return {
    cursor,
    setCursor,
    monthName,
    year,
    weeks: days,
    next: () => setCursor(new Date(year, cursor.getMonth() + 1, 1)),
    prev: () => setCursor(new Date(year, cursor.getMonth() - 1, 1)),
  };
}

function TopBar({ title, onBack, avatarSrc, onAvatarClick }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#D8B25E] text-white px-4 py-3">
      <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10" aria-label="Retour">
        <ChevronLeft />
      </button>
      <h1 className="font-semibold">{title}</h1>
      <div className="ml-auto">
        <button onClick={onAvatarClick} className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-white/40">
          <img src={avatarSrc} alt="Profil" className="h-full w-full object-cover" />
        </button>
      </div>
    </div>
  );
}

function PrimaryButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={classNames(
        "w-full rounded-2xl px-4 py-4 font-semibold shadow-sm",
        "bg-[#D8B25E] text-white hover:bg-[#C79E4F] disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={classNames("w-full rounded-2xl px-4 py-4 font-semibold bg-[#F5E7C4] text-[#6A5216] hover:bg-[#EED9A5]", className)}
    >
      {children}
    </button>
  );
}

function ChargerCard({ item, onContact }) {
  return (
    <div className="rounded-3xl bg-white shadow-sm border border-black/5 p-4 flex gap-4 items-center">
      <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden grid place-items-center">
        <Power className="w-7 h-7" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{item.name}</p>
          <span className="text-xs text-amber-700">↗</span>
        </div>
        <p className="text-sm text-gray-600">De {item.owner}</p>
        <div className="flex items-center gap-1 text-[#D8B25E]">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <span className="text-xs text-gray-500 ml-1">4.6</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
          <MapPin className="w-3 h-3" /> {item.address}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked={item.on} />
          <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-emerald-400 relative transition-all">
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all peer-checked:left-4" />
          </div>
        </label>
        <button onClick={onContact} className="text-xs text-[#C79E4F] hover:underline">Contacter</button>
      </div>
    </div>
  );
}

function EmptyIllustration({ onScan, onContact }) {
  let hero = "/background_pay.png";
  try {
    hero = new URL("../assets/background_pay.png", import.meta.url).href;
  } catch {}
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-full aspect-[9/10] rounded-3xl overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <img src={hero} alt="Illustration" className="w-full h-full object-cover" />
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 p-4 text-sm">
        Veuillez ajouter les informations de votre borne pour la <span className="underline">configurer dans l'application</span>.
      </div>
      <PrimaryButton onClick={onScan}>
        <div className="flex items-center justify-center gap-2"><QrCode className="w-5 h-5"/> Scanner le QR code</div>
      </PrimaryButton>
      <SecondaryButton onClick={onContact}>
        <div className="flex items-center justify-center gap-2"><Phone className="w-5 h-5"/> Contacter un conseiller</div>
      </SecondaryButton>
    </div>
  );
}

function AdvisorModal({ open, onClose, onConfirm }) {
  const { monthName, year, weeks, next, prev } = useMonth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [slot, setSlot] = useState(null);
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-[92%] max-w-md rounded-3xl bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Contacter un conseiller</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Fermer"><X/></button>
        </div>
        <p className="text-sm text-gray-600 mb-2">Choisir une date</p>
        <div className="rounded-2xl border bg-white">
          <div className="flex items-center justify-between px-3 py-2">
            <button onClick={prev} className="p-2 rounded hover:bg-gray-100" aria-label="Précédent"><ChevronLeft/></button>
            <div className="flex items-center gap-2 font-medium capitalize">
              <CalendarIcon className="w-4 h-4"/>
              {monthName} {year}
            </div>
            <button onClick={next} className="p-2 rounded hover:bg-gray-100" aria-label="Suivant"><ChevronRight/></button>
          </div>
          <div className="grid grid-cols-7 gap-1 px-3 pb-3 text-center text-xs text-gray-500">
            {["Lu","Ma","Me","Je","Ve","Sa","Di"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 px-3 pb-3">
            {weeks.flatMap((row, rIdx) => row.map((d, cIdx) => (
              <button
                key={`${rIdx}-${cIdx}`}
                disabled={!d}
                onClick={() => setSelectedDate(d)}
                className={classNames(
                  "aspect-square rounded-full text-sm",
                  d ? "hover:bg-amber-50" : "opacity-0 cursor-default",
                  selectedDate && d && d.toDateString() === selectedDate.toDateString() ? "bg-[#D8B25E] text-white hover:bg-[#D8B25E]" : ""
                )}
              >
                {d ? d.getDate() : ""}
              </button>
            )))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Sélectionner une période</p>
          <div className="space-y-2">
            {["9:00 – 10:00", "11:00 – 12:00"].map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={classNames(
                  "w-full rounded-2xl px-4 py-3 text-left border",
                  slot === s ? "bg-[#D8B25E] text-white border-[#D8B25E]" : "bg-white hover:bg-amber-50 border-gray-200"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <PrimaryButton className="mt-4" onClick={() => selectedDate && slot && onConfirm({ date: selectedDate, slot })} disabled={!selectedDate || !slot}>
          Confirmer
        </PrimaryButton>
      </motion.div>
    </div>
  );
}

function SuccessDialog({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-[92%] max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
        <p className="font-semibold mb-1">Note</p>
        <p className="text-sm text-gray-700">Votre réservation a bien été effectuée</p>
        <button onClick={onClose} className="mt-6 mx-auto rounded-full bg-amber-100 text-amber-700 px-4 py-2 font-medium">OK</button>
      </motion.div>
    </div>
  );
}

export default function OwnerFlow({ onBack }) {
  const [view, setView] = useState("list"); // list | empty
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const chargers = [
    { id: 1, name: "Borne 1", owner: "Rémi", on: true, address: "176 Avenue d'Aubervilliers Paris 75019" },
    { id: 2, name: "Borne 2", owner: "Rémi", on: false, address: "172 Avenue d'Aubervilliers Paris 75019" },
    { id: 3, name: "Borne 3", owner: "Rémi", on: true, address: "174 Avenue d'Aubervilliers Paris 75019" },
  ];

  const handleBack = () => {
    if (view !== "list") { setView("list"); return; }
    if (typeof onBack === "function") onBack();
  };

  return (
    <div className="absolute inset-0 bg-[#FCFCFC] text-gray-900">
      <TopBar
        title="Mes bornes"
        onBack={handleBack}
        avatarSrc="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop"
        onAvatarClick={() => setShowProfile(true)}
      />
      <div className="mx-auto max-w-md p-4 pb-28 space-y-4">
        {view === "list" ? (
          <>
            {chargers.map((c) => (
              <ChargerCard key={c.id} item={c} onContact={() => setAdvisorOpen(true)} />
            ))}
            <div className="pt-2" />
            <PrimaryButton onClick={() => setView("empty")}>
              <div className="flex items-center justify-center gap-2"><Plus className="w-5 h-5"/> Ajouter une borne</div>
            </PrimaryButton>
          </>
        ) : (
          <EmptyIllustration onScan={() => alert("Simulation scan QR")} onContact={() => setAdvisorOpen(true)} />
        )}
      </div>

      <AnimatePresence>{advisorOpen && (
        <AdvisorModal
          open={advisorOpen}
          onClose={() => setAdvisorOpen(false)}
          onConfirm={({ date, slot }) => {
            setAdvisorOpen(false);
            setTimeout(() => setSuccess(true), 200);
            // eslint-disable-next-line no-console
            console.log("Réservation:", formatDate(date), slot);
          }}
        />
      )}</AnimatePresence>

      <AnimatePresence>{success && (
        <SuccessDialog open={success} onClose={() => setSuccess(false)} />
      )}</AnimatePresence>

      <AnimatePresence>{showProfile && (
        <OwnerProfilePage onBack={() => setShowProfile(false)} />
      )}</AnimatePresence>
    </div>
  );
}

function OwnerProfilePage({ onBack }) {
  return (
    <div className="absolute inset-0 z-[60] bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#D8B25E] text-white px-4 py-3">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10" aria-label="Retour"><ChevronLeft/></button>
        <h1 className="font-semibold">Compte</h1>
        <span className="w-8" />
      </div>
      <div className="px-5 py-6">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-[#EED9A5]">
            <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop" alt="Profil" className="h-full w-full object-cover" />
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
          <div className="h-40 rounded-2xl border border-[#E5D199] bg-white grid place-items-center text-neutral-400">Graph ligne</div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm text-neutral-600 text-center mb-3">Mes revenus mensuels</h3>
          <div className="h-48 rounded-2xl border border-[#E5D199] bg-white grid place-items-center text-neutral-400">Graph barres</div>
        </div>
      </div>
    </div>
  );
}


