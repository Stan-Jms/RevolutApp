import React from "react";
import UserProfilePage from "./UserProfilePage.jsx";
import {
  Search,
  SlidersHorizontal,
  Bell,
  Plug,
  Clock,
  Star,
  ChevronRight,
  Home,
  Wrench,
  User,
  ReceiptText,
} from "lucide-react";

// ACCUEIL — avec carrousel IMAGES (sprite fournie)
// Un seul composant exporté: HomeScreen

export default function HomeScreen({ spriteUrl, onGoServices, onOpenChezRemi, onLogout }) {
  const [showProfile, setShowProfile] = React.useState(false);
  const stations = [
    { id: 1, name: "Chez Isma", time: "4 min en voiture", rating: 4.1 },
    { id: 2, name: "Chez Achraf", time: "6 min en voiture", rating: 4.3 },
    { id: 3, name: "Chez Theo", time: "8 min en voiture", rating: 4.2 },
  ];

  // Panneaux (images fournies dans src/assets ou fallback public/)
  let panel1 = "/revolt_panel1.png";
  let panel2 = "/revolt_panel2.png";
  let panel3 = "/revolt_panel3.png";
  try {
    // @ts-ignore
    // eslint-disable-next-line
    panel1 = new URL("../assets/revolt_panel1.png", import.meta.url).href;
    // @ts-ignore
    // eslint-disable-next-line
    panel2 = new URL("../assets/revolt_panel2.png", import.meta.url).href;
    // @ts-ignore
    // eslint-disable-next-line
    panel3 = new URL("../assets/revolt_panel3.png", import.meta.url).href;
  } catch {}
  const panels = [panel1, panel2, panel3];

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <header className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowProfile(true)} className="flex items-center gap-3 group">
              <img src="https://i.pravatar.cc/60" alt="avatar" className="h-9 w-9 rounded-full object-cover" />
              <div className="text-left">
                <p className="text-[13px] text-neutral-800 font-semibold group-hover:underline">Salut Stanley</p>
                <p className="text-[12px] text-sky-500">28°</p>
              </div>
            </button>
            <button className="p-2 rounded-lg hover:bg-neutral-100" aria-label="Notifications">
              <Bell className="h-5 w-5 text-neutral-700" />
            </button>
          </div>

          {/* Recherche + Filtres */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-neutral-100 rounded-xl px-3 h-10">
              <Search className="h-4 w-4 text-neutral-400" />
              <input
                placeholder="Trouver une borne"
                className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-neutral-400"
              />
            </div>
            <button className="h-10 w-10 grid place-items-center rounded-xl bg-neutral-100" aria-label="Filtres">
              <SlidersHorizontal className="h-4 w-4 text-neutral-700" />
            </button>
          </div>
        </header>

        {/* Bornes à proximité */}
        <section className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-neutral-800">Bornes à proximité</h3>
            <button className="text-[12px] text-neutral-500">Voir tout</button>
          </div>
          <div className="space-y-4">
            {stations.map((s) => (
              <StationItem key={s.id} name={s.name} time={s.time} rating={s.rating} />
            ))}
          </div>
        </section>

        {/* Carrousel panneaux (emplacement d'origine du carrousel) */}
        <section className="mt-5 px-5">
          <div className="grid grid-flow-col auto-cols-[64%] gap-0 overflow-x-auto pb-2 snap-x">
            {panels.map((src, idx) => (
              <PanelCard key={idx} src={src} />
            ))}
          </div>
        </section>

        {/* Activités récentes */}
        <section className="mt-6 px-5 pb-24">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-neutral-800">Activités récentes</h3>
            <button className="text-[12px] text-neutral-500">Voir tout</button>
          </div>
          <button onClick={onOpenChezRemi} className="rounded-xl bg-neutral-50 p-3 flex items-center justify-between w-full text-left hover:bg-neutral-100">
            <div className="flex items-center gap-3">
              <div className="h-6 w-8 rounded-lg bg-neutral-100 grid place-items-center">
                <ReceiptText className="h-4 w-4 text-neutral-700" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-neutral-800">Chez Rémi</p>
                <div className="flex items-center gap-3 text-[12px] text-neutral-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>10 min en voiture</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500" /> 4.5
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </button>
        </section>

        

        {/* Overlay: user profile */}
        {showProfile && <UserProfilePage onBack={() => setShowProfile(false)} onLogout={() => { setShowProfile(false); if (typeof onLogout === 'function') onLogout(); }} />}

        {/* Barre gestuelle fictive */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-36 rounded-full bg-neutral-900/80" />
      </div>
    </div>
  );
}

function StationItem({ name, time, rating }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-neutral-100 grid place-items-center">
          <Plug className="h-4 w-4 text-neutral-700" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-neutral-800">{name}</p>
          <div className="flex items-center gap-3 text-[12px] text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {time}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500" /> {rating}
            </span>
          </div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-neutral-400" />
    </div>
  );
}

function PromoCard({ title, subtitle, sprite, index }) {
  const positions = ["0% 50%", "50% 50%", "100% 50%"];
  const bgPos = positions[index] || positions[0];
  return (
    <article className="relative snap-center rounded-xl overflow-hidden min-h-[170px]">
      <div className="absolute inset-0 bg-[#F1C74D]" aria-hidden />
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{ backgroundImage: `url(${sprite})`, backgroundSize: "300% 100%", backgroundPosition: bgPos }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-300/45 to-transparent" aria-hidden />

      <div className="relative z-10 p-4">
        <h4 className="text-[16px] font-extrabold text-[#083344] leading-5">{title}</h4>
        <p className="text-[12px] text-[#083344]/80 mt-2 leading-4 max-w-[85%]">{subtitle}</p>
      </div>
    </article>
  );
}

function PanelCard({ src }) {
  return (
    <article className="relative snap-center inline-block w-fit  h-auto overflow-hidden bg-transparent place-self-start">
      <img src={src} alt="ReVOLT panel" className="block h-80 w-auto" />
    </article>
  );
}

function Tab({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 text-[11px] ${active ? "text-[#D59C2F]" : "text-neutral-400"}`}>
      <div className={`h-6 w-6 grid place-items-center rounded-xl ${active ? "bg-[#EED9A5]" : ""}`}>{icon}</div>
      <span>{label}</span>
    </button>
  );
}

// TEST (dev-only) — sanity check
if (process.env.NODE_ENV !== "production") {
  try {
    const el = <HomeScreen />;
    console.assert(React.isValidElement(el), "HomeScreen doit rendre un élément valide");
    [0,1,2].forEach((i) => {
      const pc = <PromoCard title="T" subtitle="S" sprite="x.png" index={i} />;
      console.assert(React.isValidElement(pc), `PromoCard rend (index ${i})`);
    });
  } catch (err) {
    console.warn("[self-test Accueil] échec:", err);
  }
}


