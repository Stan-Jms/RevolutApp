import React, { useState } from "react";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

// Tailwind requis. Pas d'icônes iOS simulées.
// Contient 3 écrans :
// - RoleChoiceScreen (nouveau) → export par défaut
// - LoginScreen (conservé)
// - WelcomeScreen (conservé)

/* ------------------------------------------------------------------ */
/*  SIGN UP SCREEN (Inscription)                                       */
/* ------------------------------------------------------------------ */
export default function SignUpScreen() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [plate, setPlate] = useState("");
  const [showBrand, setShowBrand] = useState(false);
  const [showPlate, setShowPlate] = useState(false);

  const canNext = lastName.trim() && firstName.trim() && carBrand.trim() && plate.trim();

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {/* Téléphone */}
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        {/* Header moutarde + topo + vague */}
        <div className="relative h-[300px] bg-[#D59C2F]">
          <TopoPattern />
          {/* Vague blanche plus prononcée à gauche */}
          <svg className="absolute -bottom-[1px] left-0 w-full" viewBox="0 0 393 150" preserveAspectRatio="none">
            <path d="M0,60 C60,0 150,0 240,40 C300,65 340,75 393,45 L393,150 L0,150 Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Contenu */}
        <div className="relative px-6 pt-6 pb-24">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="text-[40px] leading-[42px] font-extrabold text-neutral-900">Inscription</motion.h1>
          <div className="h-[4px] w-16 bg-[#D59C2F] rounded mt-3 mb-4" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!canNext) return;
              alert(`Suivant →\nNom: ${lastName}\nPrénom: ${firstName}\nMarque: ${carBrand}\nPlaque: ${plate}`);
            }}
          >
            {/* Nom */}
            <label className="block text-[13px] text-neutral-600 mb-1">Nom</label>
            <div className="border-b border-[#DFB760] pb-3 mb-5">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Votre Nom"
                className="w-full outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800"
                required
              />
            </div>

            {/* Prénom */}
            <label className="block text-[13px] text-neutral-600 mb-1">Prénom</label>
            <div className="border-b border-[#DFB760] pb-3 mb-5">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre Prénom"
                className="w-full outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800"
                required
              />
            </div>

            {/* Marque de Voiture */}
            <label className="block text-[13px] text-neutral-600 mb-1">Marque de Voiture</label>
            <div className="flex items-center gap-2 border-b border-neutral-300 pb-3 mb-5">
              <input
                type={showBrand ? "text" : "password"}
                value={carBrand}
                onChange={(e) => setCarBrand(e.target.value)}
                placeholder="Mercedes"
                className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800"
                required
              />
              <button type="button" aria-label={showBrand ? "Masquer" : "Afficher"} onClick={() => setShowBrand((s) => !s)} className="grid place-items-center p-1 rounded hover:bg-neutral-100">
                {showBrand ? <EyeOff className="h-4 w-4 text-neutral-500" /> : <Eye className="h-4 w-4 text-neutral-500" />}
              </button>
            </div>

            {/* Plaque d’immatriculation */}
            <label className="block text-[13px] text-neutral-600 mb-1">Plaque d’immatriculation</label>
            <div className="flex items-center gap-2 border-b border-neutral-300 pb-3 mb-2">
              <input
                type={showPlate ? "text" : "password"}
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="AB 123 CD"
                className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800 tracking-wider"
                required
              />
              <button type="button" aria-label={showPlate ? "Masquer" : "Afficher"} onClick={() => setShowPlate((s) => !s)} className="grid place-items-center p-1 rounded hover:bg-neutral-100">
                {showPlate ? <EyeOff className="h-4 w-4 text-neutral-500" /> : <Eye className="h-4 w-4 text-neutral-500" />}
              </button>
            </div>

            {/* CTA */}
            <button type="submit" disabled={!canNext} className="mt-8 w-full h-12 rounded-2xl text-white text-[16px] font-semibold bg-[#D8B25E] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#CDA551] active:scale-[.99] transition">
              Suivant
            </button>
          </form>

          {/* Bas de page */}
          <div className="text-center mt-6 text-[13px] text-neutral-400">
            Vous avez déjà un compte ?
            <button className="ml-1 text-[#D59C2F] hover:underline" onClick={() => alert("Aller vers Connexion")}>Connexion</button>
          </div>
        </div>

        {/* Barre gestuelle fictive */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-36 rounded-full bg-neutral-900/80" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ROLE CHOICE SCREEN (Onboarding « Bienvenue »)                      */
/* ------------------------------------------------------------------ */
export function RoleChoiceScreen() {
  const [role, setRole] = useState(null);
  const toggle = (next) => setRole((r) => (r === next ? null : next));
  const canContinue = role !== null;

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        <div className="relative h-[360px] bg-[#D59C2F]">
          <TopoPattern />
          <svg className="absolute -bottom-[1px] left-0 w-full" viewBox="0 0 393 160" preserveAspectRatio="none">
            <path d="M0,0 C130,155 280,155 393,60 L393,160 L0,160 Z" fill="#ffffff" />
          </svg>
        </div>

        <div className="relative px-6 pt-8 pb-28">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="text-[40px] leading-[42px] font-extrabold text-neutral-900">Bienvenue</motion.h1>
          <div className="h-[4px] w-16 bg-[#D59C2F] rounded mt-3 mb-4" />
          <p className="text-[13px] leading-5 text-neutral-400 max-w-[320px]">Inscrivez-vous comme hôte et conducteur pour profiter pleinement.</p>

          <div className="mt-8">
            <p className="text-[14px] font-semibold text-neutral-800 mb-3">Êtes-vous hôte ou conducteur ?</p>
            <div className="flex items-center gap-8">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={role === "conducteur"} onChange={() => toggle("conducteur")} className="accent-[#D59C2F] w-4 h-4" />
                <span className="text-[14px] text-neutral-700">Conducteur</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={role === "hote"} onChange={() => toggle("hote")} className="accent-[#D59C2F] w-4 h-4" />
                <span className="text-[14px] text-neutral-700">Hote</span>
              </label>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <span className="text-[15px] font-semibold text-neutral-400">Continue</span>
          <button type="button" aria-label="Continuer" disabled={!canContinue} onClick={() => alert(`Continuer en tant que: ${role}`)} className="h-12 w-12 rounded-full grid place-items-center shadow-lg bg-[#D8B25E] hover:bg-[#CDA551] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
            <ArrowRight className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-36 rounded-full bg-neutral-900/80" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LOGIN SCREEN                                                       */
/* ------------------------------------------------------------------ */
export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const canSubmit = email.trim() !== "" && pwd.trim() !== "";

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {/* Téléphone */}
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        {/* Header moutarde avec topo + vague */}
        <div className="relative h-[340px] bg-[#D59C2F]">
          <TopoPattern />
          {/* Vague blanche */}
          <svg
            className="absolute -bottom-[1px] left-0 w-full"
            viewBox="0 0 393 140"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C120,130 280,130 393,40 L393,140 L0,140 Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Formulaire */}
        <div className="relative px-6 pt-8 pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-[40px] leading-[42px] font-extrabold text-neutral-900"
          >
            Connexion
          </motion.h1>
          <div className="h-[4px] w-16 bg-[#D59C2F] rounded mt-3 mb-6" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              alert(`Login →\nemail: ${email}`); // Remplace par ta navigation / appel API
            }}
          >
            {/* Email */}
            <label className="block text-[13px] text-neutral-600 mb-1">Email</label>
            <div className="flex items-center gap-2 border-b border-[#DFB760]/70 pb-3 mb-5">
              <Mail className="h-4 w-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@email.com"
                className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800"
                required
              />
            </div>

            {/* Mot de passe */}
            <label className="block text-[13px] text-neutral-600 mb-1">Mot de passe</label>
            <div className="flex items-center gap-2 border-b border-neutral-300 pb-3">
              <Lock className="h-4 w-4 text-neutral-400" />
              <input
                type={showPwd ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="flex-1 outline-none text-[15px] placeholder:text-neutral-400 text-neutral-800"
                required
              />
              <button
                type="button"
                aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                onClick={() => setShowPwd((s) => !s)}
                className="grid place-items-center p-1 rounded hover:bg-neutral-100"
              >
                {showPwd ? (
                  <EyeOff className="h-4 w-4 text-neutral-500" />
                ) : (
                  <Eye className="h-4 w-4 text-neutral-500" />
                )}
              </button>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between gap-3 text-[13px] mt-4">
              <label className="inline-flex items-center gap-2 select-none">
                <input type="checkbox" className="accent-[#D59C2F] w-4 h-4" />
                <span className="text-neutral-700">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                className="text-[#D59C2F] hover:underline"
                onClick={() => alert("Mot de passe oublié ?")}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-8 w-full h-12 rounded-2xl text-white text-[16px] font-semibold bg-[#D8B25E] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#CDA551] active:scale-[.99] transition"
            >
              Connexion
            </button>
          </form>

          {/* Bas de page */}
          <div className="text-center mt-6 text-[13px] text-neutral-400">
            Vous n’avez pas de compte ?
            <button
              className="ml-1 text-[#D59C2F] hover:underline"
              onClick={() => alert("Aller vers Inscription")}
            >
              Inscription
            </button>
          </div>
        </div>

        {/* Barre gestuelle fictive */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-36 rounded-full bg-neutral-900/80" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  WELCOME SCREEN (conservé)                                         */
/* ------------------------------------------------------------------ */
export function WelcomeScreen() {
  return (
    <div className="w-full min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="relative w-[393px] h-[808px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        <div className="relative h-[550px] bg-[#D59C2F]">
          <TopoPattern />
          <svg
            className="absolute -bottom-[1px] left-0 w-full"
            viewBox="0 0 393 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C100,120 290,120 393,40 L393,120 L0,120 Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="relative px-6 pt-8 pb-20">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[40px] leading-[40px] font-extrabold text-neutral-900 mb-3"
          >
            Bienvenue
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-[13px] leading-5 text-neutral-500 max-w-[300px]"
          >
            Bienvenue, ensemble construisons la mobilité électrique de demain
          </motion.p>
        </div>
        <motion.button
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-[#D8B25E] hover:bg-[#CDA551] active:scale-95 grid place-items-center"
          aria-label="Continuer"
          onClick={() => alert("Continue →")} // à remplacer par votre navigation
        >
          <ArrowRight className="h-5 w-5 text-white" />
        </motion.button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TOPO PATTERN (utilisé par les 2 écrans)                           */
/* ------------------------------------------------------------------ */
function TopoPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.35]"
      viewBox="0 0 393 550"
      preserveAspectRatio="none"
    >
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

/* ------------------------------------------------------------------ */
/*  TESTS (dev-only, non bloquants)                                   */
/* ------------------------------------------------------------------ */
if (process.env.NODE_ENV !== "production") {
  try {
    const signEl = <SignUpScreen />;
    console.assert(React.isValidElement(signEl), "SignUpScreen retourne un élément valide");

    const roleEl = <RoleChoiceScreen />;
    console.assert(React.isValidElement(roleEl), "RoleChoiceScreen retourne un élément valide");

    const loginEl = <LoginScreen />;
    console.assert(React.isValidElement(loginEl), "LoginScreen retourne un élément valide");

    const welcomeEl = <WelcomeScreen />;
    console.assert(React.isValidElement(welcomeEl), "WelcomeScreen retourne un élément valide");

    const topoEl = <TopoPattern />;
    console.assert(React.isValidElement(topoEl), "TopoPattern retourne un élément valide");
  } catch (err) {
    console.warn("[self-test] échec:", err);
  }
}


