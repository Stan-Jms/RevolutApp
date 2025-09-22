import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Phone, CheckCircle } from "lucide-react";
import HomeScreen from "./HomeScreen.jsx";
import MapScreen from "./MapScreen.jsx";
import OwnerFlow from "./OwnerFlow.jsx";

// Tailwind requis. Pas d'icônes iOS simulées.
// ✅ IMPORTANT: on conserve tout l'AVANT tel quel (Splash, Bienvenue simple, Connexion, etc.)
// 👉 Modifs demandées SEULEMENT sur :
//    - Bienvenue – choix du rôle (Conducteur / Chargeur)
//    - Inscription – Marque + Plaque
//    - Inscription – Adresse + Type de borne
//    avec cette logique de parcours :
//      • conducteur seul → seulement « Marque + Plaque »
//      • chargeur seul   → seulement « Adresse + Borne »
//      • les deux        → les deux écrans dans l'ordre: Véhicule puis Adresse
//    Et ne JAMAIS masquer plaque/adresse (seuls les MDP peuvent être cachés ailleurs).

// Flow builder
function buildFlow(roles) {
  const sequence = ["splash", "welcome", "login", "role"];
  if (roles.conducteur) sequence.push("vehicle");
  if (roles.chargeur) sequence.push("address");
  sequence.push("credentials", "success", "home", "map");
  return sequence;
}

// Orchestrateur (export par défaut)
export default function AppFlow() {
  const [roles, setRoles] = useState({ conducteur: false, chargeur: false });
  const [flow, setFlow] = useState(buildFlow(roles));
  const [index, setIndex] = useState(0);
  const [ownerMode, setOwnerMode] = useState(() => sessionStorage.getItem("ownerMode") === "1");

  const id = flow[index];
  const goto = (idx) => setIndex(Math.max(0, Math.min(idx, flow.length - 1)));
  const next = () => goto(index + 1);
  const back = () => goto(index - 1);

  function onRolesChosen(r) {
    setRoles(r);
    const newFlow = buildFlow(r);
    setFlow(newFlow);
    const roleIndex = newFlow.indexOf("role");
    goto(roleIndex + 1);
  }

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {id === "splash" && <SplashStep onNext={next} />}
            {id === "welcome" && <WelcomeSimpleStep onNext={next} />}
            {id === "login" && (
              <LoginStep
                onLogin={() => goto(flow.indexOf("home"))}
                onOwnerLogin={() => { sessionStorage.setItem("ownerMode", "1"); setOwnerMode(true); goto(flow.indexOf("home")); }}
                onGoSignUp={() => goto(flow.indexOf("role"))}
              />
            )}
            {id === "role" && <RoleChoiceStep roles={roles} onNext={onRolesChosen} />}
            {id === "vehicle" && <SignUpVehicleStep onNext={next} />}
            {id === "address" && <SignUpAddressStep onNext={next} />}
            {id === "credentials" && <SignUpCredentialsStep onBack={back} onNext={next} />}
            {id === "success" && <SuccessStep onNext={next} />}
            {id === "home" && (
              ownerMode ? (
                <OwnerFlow onBack={() => { sessionStorage.removeItem("ownerMode"); setOwnerMode(false); }} />
              ) : (
                <HomeScreen
                  onGoServices={() => goto(index + 1)}
                  onOpenChezRemi={() => goto(flow.indexOf("map"))}
                />
              )
            )}
            {id === "map" && <MapScreen preselectIndex={0} />}
          </motion.div>
        </AnimatePresence>

        {/* Barre gestuelle fictive (toutes étapes) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-36 rounded-full bg-neutral-900/80" />
      </div>
    </div>
  );
}

// ÉTAPE 0 — SPLASH (écran blanc court)
function SplashStep({ onNext }) {
  useEffect(() => {
    const t = setTimeout(onNext, 700);
    return () => clearTimeout(t);
  }, [onNext]);
  return <div className="w-full h-full bg-white" />;
}

// ÉTAPE 1 — WELCOME simple
function WelcomeSimpleStep({ onNext }) {
  return (
    <div className="absolute inset-0">
      <div className="relative h-[360px] bg-[#D59C2F]">
        <TopoPattern />
        <svg className="absolute -bottom-[1px] left-0 w-full" viewBox="0 0 393 160" preserveAspectRatio="none">
          <path d="M0,0 C140,150 270,150 393,70 L393,160 L0,160 Z" fill="#ffffff" />
        </svg>
      </div>
      <div className="px-6 pt-10">
        <h1 className="text-[40px] leading-[42px] font-extrabold text-neutral-900">Bienvenue</h1>
        <p className="mt-3 text-[13px] leading-5 text-neutral-500 max-w-[300px]">
          Bienvenue, ensemble construisons la mobilité électrique de demain
        </p>
      </div>
      <button className="absolute bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-[#D8B25E] hover:bg-[#CDA551] active:scale-95 grid place-items-center" onClick={onNext} aria-label="Continuer">
        <ArrowRight className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}

// ÉTAPE 2 — CONNEXION
function LoginStep({ onLogin, onGoSignUp }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const canSubmit = email.trim() !== "" && pwd.trim() !== "";
  return (
    <div className="absolute inset-0">
      <HeaderWave height={340} />
      <div className="relative px-6 pt-8 pb-24">
        <h1 className="text-[40px] leading-[42px] font-extrabold text-neutral-900">Connexion</h1>
        <div className="h-[4px] w-16 bg-[#D59C2F] rounded mt-3 mb-6" />
        <form onSubmit={(e) => { e.preventDefault(); if (!canSubmit) return; if (email.trim().toLowerCase() === "admin@mail.com") { const ownerIdx = 999; sessionStorage.setItem("ownerMode","1"); onLogin(() => ownerIdx); } else { onLogin(); } }}>
          <label className="block text-[13px] text-neutral-600 mb-1">Email</label>
          <div className="flex items-center gap-2 border-b border-[#DFB760]/70 pb-3 mb-5">
            <Mail className="h-4 w-4 text-neutral-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="demo@email.com" className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800" required />
          </div>
          <label className="block text-[13px] text-neutral-600 mb-1">Mot de passe</label>
          <div className="flex items-center gap-2 border-b border-neutral-300 pb-3">
            <Lock className="h-4 w-4 text-neutral-400" />
            <input type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Entrez votre mot de passe" className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800" required />
            <button type="button" onClick={() => setShowPwd((s) => !s)} className="p-1 rounded hover:bg-neutral-100">
              {showPwd ? <EyeOff className="h-4 w-4 text-neutral-500" /> : <Eye className="h-4 w-4 text-neutral-500" />}
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 text-[13px] mt-4">
            <label className="inline-flex items-center gap-2 select-none">
              <input type="checkbox" className="accent-[#D59C2F] w-4 h-4" />
              <span className="text-neutral-700">Se souvenir de moi</span>
            </label>
            <button type="button" className="text-[#D59C2F] hover:underline">Mot de passe oublié ?</button>
          </div>
          <button type="submit" disabled={!canSubmit} className="mt-8 w-full h-12 rounded-2xl text-white text-[16px] font-semibold bg-[#D8B25E] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#CDA551] active:scale-[.99] transition">Connexion</button>
        </form>
        <div className="text-center mt-6 text-[13px] text-neutral-400">
          Vous n’avez pas de compte ?
          <button onClick={onGoSignUp} className="ml-1 text-[#D59C2F] hover:underline">Inscription</button>
        </div>
      </div>
    </div>
  );
}

// ÉTAPE 3 — BIENVENUE : CHOIX DU RÔLE (modifiée)
function RoleChoiceStep({ roles, onNext }) {
  const [loc, setLoc] = useState(roles);
  const canContinue = loc.conducteur || loc.chargeur;
  return (
    <div className="absolute inset-0">
      <HeaderWave height={360} />
      <div className="relative px-6 pt-8 pb-28">
        <h1 className="text-[40px] leading-[42px] font-extrabold text-neutral-900">Bienvenue</h1>
        <div className="h-[4px] w-16 bg-[#D59C2F] rounded mt-3 mb-4" />
        <p className="text-[13px] leading-5 text-neutral-400 max-w-[320px]">Inscrivez-vous comme hôte et conducteur pour profiter pleinement.</p>
        <div className="mt-8">
          <p className="text-[14px] font-semibold text-neutral-800 mb-3">Êtes-vous hôte ou conducteur ?</p>
          <div className="flex items-center gap-8">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={loc.conducteur} onChange={() => setLoc((r) => ({ ...r, conducteur: !r.conducteur }))} className="accent-[#D59C2F] w-4 h-4" />
              <span className="text-[14px] text-neutral-700">Conducteur</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={loc.chargeur} onChange={() => setLoc((r) => ({ ...r, chargeur: !r.chargeur }))} className="accent-[#D59C2F] w-4 h-4" />
              <span className="text-[14px] text-neutral-700">Chargeur (hôte)</span>
            </label>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 flex items-center gap-3">
        <span className="text-[15px] font-semibold text-neutral-400">Continue</span>
        <button disabled={!canContinue} onClick={() => onNext(loc)} className="h-12 w-12 rounded-full grid place-items-center shadow-lg bg-[#D8B25E] hover:bg-[#CDA551] active:scale-95 disabled:opacity-60" aria-label="Continuer">
          <ArrowRight className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}

// ÉTAPE 4 — SIGNUP (Marque + Plaque)
function SignUpVehicleStep({ onNext }) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [plate, setPlate] = useState("");
  const canNext = [lastName, firstName, carBrand, plate].every((s) => s.trim());
  return (
    <div className="absolute inset-0">
      <HeaderWave height={300} />
      <div className="relative px-6 pt-6 pb-24">
        <h1 className="text-[40px] leading-[42px] font-extrabold text-neutral-900">Inscription</h1>
        <div className="h-[4px] w-16 bg-[#D59C2F] rounded mt-3 mb-4" />
        <form onSubmit={(e) => { e.preventDefault(); if (!canNext) return; onNext(); }}>
          <FieldLabel>Nom</FieldLabel>
          <UnderlinedInput value={lastName} onChange={setLastName} placeholder="Votre Nom" highlight />
          <FieldLabel>Prénom</FieldLabel>
          <UnderlinedInput value={firstName} onChange={setFirstName} placeholder="Votre Prénom" highlight />
          <FieldLabel>Marque de Voiture</FieldLabel>
          <UnderlinedInput value={carBrand} onChange={setCarBrand} placeholder="Mercedes" />
          <FieldLabel>Plaque d’immatriculation</FieldLabel>
          <UnderlinedInput value={plate} onChange={(v) => setPlate(v.toUpperCase())} placeholder="AB 123 CD" />
          <CTA disabled={!canNext}>Suivant</CTA>
        </form>
        <BottomAuthHint />
      </div>
    </div>
  );
}

// ÉTAPE 5 — SIGNUP (Adresse + Type de borne)
function SignUpAddressStep({ onNext }) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [chargerType, setChargerType] = useState("");
  const canNext = [lastName, firstName, address, chargerType].every((s) => s.trim());
  return (
    <div className="absolute inset-0">
      <HeaderWave height={300} />
      <div className="relative px-6 pt-6 pb-24">
        <h1 className="text-[40px] leading-[42px] font-extrabold text-neutral-900">Inscription</h1>
        <div className="h-[4px] w-16 bg-[#D59C2F] rounded mt-3 mb-4" />
        <form onSubmit={(e) => { e.preventDefault(); if (!canNext) return; onNext(); }}>
          <FieldLabel>Nom</FieldLabel>
          <UnderlinedInput value={lastName} onChange={setLastName} placeholder="Votre Nom" highlight />
          <FieldLabel>Prénom</FieldLabel>
          <UnderlinedInput value={firstName} onChange={setFirstName} placeholder="Votre Prénom" highlight />
          <FieldLabel>Adresse Postale</FieldLabel>
          <UnderlinedInput value={address} onChange={setAddress} placeholder="Votre adresse" />
          <FieldLabel>Type de borne</FieldLabel>
          <UnderlinedInput value={chargerType} onChange={setChargerType} placeholder="chargeur rapide" />
          <CTA disabled={!canNext}>Suivant</CTA>
        </form>
        <BottomAuthHint />
      </div>
    </div>
  );
}

// Helpers validation
function isEmail(v) { return /.+@.+\..+/.test(v); }
function digits(v) { return (v.match(/\d/g) || []).length; }
function canCreateAccount(data) {
  const okEmail = isEmail(data.email);
  const okPhone = digits(data.phone) >= 9;
  const okPwd = data.pwd.length >= 8;
  const okMatch = data.pwd === data.confirm;
  return okEmail && okPhone && okPwd && okMatch;
}

// ÉTAPE 6 — SIGNUP (Email + Téléphone + MDP + Confirm)
function SignUpCredentialsStep({ onBack, onNext }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const canSubmit = canCreateAccount({ email, phone, pwd, confirm });
  return (
    <div className="absolute inset-0">
      <HeaderWave height={300} />
      <div className="relative px-6 pt-6 pb-24">
        <h1 className="text-[40px] leading-[42px] font-extrabold text-neutral-900">Inscription</h1>
        <div className="h-[4px] w-16 bg-[#D59C2F] rounded mt-3 mb-4" />
        <form onSubmit={(e) => { e.preventDefault(); if (!canSubmit) return; onNext(); }}>
          <FieldLabel>Email</FieldLabel>
          <div className="flex items-center gap-2 border-b border-neutral-300 pb-3 mb-5">
            <Mail className="h-4 w-4 text-neutral-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="demo@email.com" className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800" required />
          </div>
          <FieldLabel>Numéro de téléphone</FieldLabel>
          <div className="flex items-center gap-2 border-b border-neutral-300 pb-3 mb-5">
            <Phone className="h-4 w-4 text-neutral-400" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33 6 24 24 56 78" className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800" required />
          </div>
          <FieldLabel>Mot de passe</FieldLabel>
          <div className="flex items-center gap-2 border-b border-neutral-300 pb-3 mb-5">
            <Lock className="h-4 w-4 text-neutral-400" />
            <input type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Entrez votre mot de passe" className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800" required />
            <button type="button" onClick={() => setShowPwd((s) => !s)} className="p-1 rounded hover:bg-neutral-100">
              {showPwd ? <EyeOff className="h-4 w-4 text-neutral-500" /> : <Eye className="h-4 w-4 text-neutral-500" />}
            </button>
          </div>
          <FieldLabel>Confirmer le mot de passe</FieldLabel>
          <div className="flex items-center gap-2 border-b border-neutral-300 pb-3 mb-6">
            <Lock className="h-4 w-4 text-neutral-400" />
            <input type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirmez votre mot de passe" className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800" required />
            <button type="button" onClick={() => setShowConfirm((s) => !s)} className="p-1 rounded hover:bg-neutral-100">
              {showConfirm ? <EyeOff className="h-4 w-4 text-neutral-500" /> : <Eye className="h-4 w-4 text-neutral-500" />}
            </button>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onBack} className="h-12 flex-1 rounded-2xl text-[15px] font-semibold bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:scale-[.99]">Retour</button>
            <button type="submit" disabled={!canSubmit} className="h-12 flex-1 rounded-2xl text-white text-[16px] font-semibold bg-[#D8B25E] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#CDA551] active:scale-[.99] transition">Créer un compte</button>
          </div>
        </form>
        <BottomAuthHint />
      </div>
    </div>
  );
}

// ÉTAPE 7 — SUCCÈS
function SuccessStep({ onNext }) {
  return (
    <div className="absolute inset-0 grid place-items-center p-8">
      <div className="max-w-[320px] text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-12 w-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">Votre compte est prêt</h2>
        <p className="text-neutral-500 mb-6">Appuyez sur le bouton ci‑dessous pour entrer dans l’application.</p>
        <button onClick={onNext} className="w-full h-12 rounded-2xl text-white text-[16px] font-semibold bg-[#D8B25E] hover:bg-[#CDA551] active:scale-[.99] transition">Se connecter</button>
      </div>
    </div>
  );
}

// BLOCS UI réutilisables
function HeaderWave({ height }) {
  return (
    <div className={`relative bg-[#D59C2F]`} style={{ height }}>
      <TopoPattern />
      <svg className="absolute -bottom-[1px] left-0 w-full" viewBox="0 0 393 160" preserveAspectRatio="none">
        <path d="M0,0 C130,155 280,155 393,60 L393,160 L0,160 Z" fill="#ffffff" />
      </svg>
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-[13px] text-neutral-600 mb-1">{children}</label>;
}

function UnderlinedInput({ value, onChange, placeholder, highlight }) {
  return (
    <div className={`pb-3 mb-5 border-b ${highlight ? "border-[#DFB760]" : "border-neutral-300"}`}>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800" />
    </div>
  );
}

function CTA({ children, disabled }) {
  return (
    <button
      type="submit"
      disabled={!!disabled}
      className="mt-8 w-full h-12 rounded-2xl text-white text-[16px] font-semibold bg-[#D8B25E] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#CDA551] active:scale-[.99] transition"
    >
      {children}
    </button>
  );
}

function BottomAuthHint() {
  return (
    <div className="text-center mt-6 text-[13px] text-neutral-400">
      Vous avez déjà un compte ?
      <button className="ml-1 text-[#D59C2F] hover:underline">Connexion</button>
    </div>
  );
}

// TOPO PATTERN (commun)
function TopoPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.35]" viewBox="0 0 393 550" preserveAspectRatio="none">
      <defs>
        <clipPath id="clip">
          <rect width="393" height="550" rx="0" ry="0" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip)" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.55">
        <path d="M-50 80 C 60 10, 190 10, 310 80 S 520 170, 430 240" />
        <path d="M-30 150 C 80 90, 200 90, 320 150 S 520 240, 430 310" />
        <path d="M-20 220 C 90 170, 210 170, 330 220 S 520 300, 430 370" />
        <path d="M-10 290 C 100 250, 220 250, 340 290 S 520 360, 430 430" />
        <path d="M0 360 C 110 330, 230 330, 350 360 S 520 430, 430 500" />
        <path d="M10 430 C 120 410, 240 410, 360 430 S 520 500, 430 570" />
        <circle cx="270" cy="110" r="18" />
        <circle cx="95" cy="260" r="22" />
        <circle cx="205" cy="340" r="14" />
        <circle cx="330" cy="280" r="10" />
        <circle cx="250" cy="465" r="8" />
      </g>
    </svg>
  );
}

// TESTS (dev-only, non bloquants)
if (process.env.NODE_ENV !== "production") {
  try {
    const f1 = buildFlow({ conducteur: true, chargeur: false });
    console.assert(JSON.stringify(f1) === JSON.stringify(["splash","welcome","login","role","vehicle","credentials","success","home","map"]), "conducteur seul → vehicle");
    const f2 = buildFlow({ conducteur: false, chargeur: true });
    console.assert(JSON.stringify(f2) === JSON.stringify(["splash","welcome","login","role","address","credentials","success","home","map"]), "chargeur seul → address");
    const f3 = buildFlow({ conducteur: true, chargeur: true });
    console.assert(JSON.stringify(f3) === JSON.stringify(["splash","welcome","login","role","vehicle","address","credentials","success","home","map"]), "les deux → vehicle puis address");

    const el = CTA({ children: "OK", disabled: false });
    console.assert(React.isValidElement(el), "CTA doit être un élément React valide");
  } catch (err) {
    console.warn("[self-test] échec:", err);
  }
}


