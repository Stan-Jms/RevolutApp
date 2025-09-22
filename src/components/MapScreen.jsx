import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, Home, Wrench, Plug, User, ChevronRight, X, QrCode } from "lucide-react";
import PaymentPage from "./PaymentPage.jsx";
import PaymentMethodsPage from "./PaymentMethodsPage.jsx";
import ChargingActivityPage from "./ChargingActivityPage.jsx";
import ChargingSummaryPage from "./ChargingSummaryPage.jsx";
import { MapContainer, TileLayer, CircleMarker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Utilitaire pur
function makeFakeRoute(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== 2 || b.length !== 2) return [];
  const mid = [(a[0] + b[0]) / 2 + 0.001, (a[1] + b[1]) / 2 - 0.0015];
  return [a, mid, b];
}

function makeStationId(pos) {
  if (!Array.isArray(pos) || pos.length !== 2) return "";
  const lat = Math.abs(Math.round(pos[0] * 1000)).toString(36);
  const lng = Math.abs(Math.round(pos[1] * 1000)).toString(36);
  return (lat + lng).toUpperCase().slice(0, 7);
}

// Fetch a route that follows roads using the public OSRM server
async function fetchOsrmRoute(start, end) {
  try {
    if (!Array.isArray(start) || !Array.isArray(end)) return [];
    const [sLat, sLng] = start;
    const [eLat, eLng] = end;
    const url = `https://router.project-osrm.org/route/v1/driving/${sLng},${sLat};${eLng},${eLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const coords = data?.routes?.[0]?.geometry?.coordinates || [];
    // OSRM returns [lng, lat]; Leaflet expects [lat, lng]
    return coords.map(([lng, lat]) => [lat, lng]);
  } catch {
    return [];
  }
}

function safeAsset(relativePath) {
  try {
    return new URL(relativePath, import.meta.url).href;
  } catch {
    return "";
  }
}

export default function MapScreen({ preselectIndex }) {
  const center = [48.853, 2.3478];
  // Point de départ souhaité: Châtelet–Les Halles
  const routeStart = [48.8609, 2.3469];

  const points = useMemo(
    () => [
      [48.8528, 2.347],
      [48.8538, 2.3425],
      [48.8532, 2.351],
      [48.8509, 2.345],
      [48.855, 2.3496],
      [48.8562, 2.3449],
      [48.8516, 2.3527],
      [48.8499, 2.3468],
    ],
    []
  );

  // Données par point: chaque dot représente une personne différente
  const stations = useMemo(
    () => [
      { name: "Chez Rémi", distKm: 1.6, rating: 4.6, addr: "53 Rue Gustave Flaubert", price: 0.28 },
      { name: "Chez Leïla", distKm: 0.8, rating: 4.4, addr: "12 Rue Oberkampf", price: 0.30 },
      { name: "Chez Hugo", distKm: 2.1, rating: 4.2, addr: "8 Rue de Sèvres", price: 0.27 },
      { name: "Chez Chloé", distKm: 1.2, rating: 4.5, addr: "3 Rue Tronchet", price: 0.32 },
      { name: "Chez Amine", distKm: 3.4, rating: 4.0, addr: "Quai d'Austerlitz", price: 0.26 },
      { name: "Chez Zoé", distKm: 1.9, rating: 4.7, addr: "21 Quai Saint-Michel", price: 0.29 },
      { name: "Chez Marco", distKm: 2.6, rating: 4.1, addr: "Place Monge", price: 0.31 },
      { name: "Chez Aya", distKm: 2.0, rating: 4.8, addr: "Place du Panthéon", price: 0.33 },
    ],
    []
  );

  const [selected, setSelected] = useState(null);
  const [route, setRoute] = useState([]);
  const [showQR, setShowQR] = useState(false); // false | true | "methods"
  const [connecting, setConnecting] = useState(false);
  const [connectId, setConnectId] = useState("");
  const connectTimer = useRef(null);
  const [userPos, setUserPos] = useState(null);
  const [showActivity, setShowActivity] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => () => {
    if (connectTimer.current) clearTimeout(connectTimer.current);
  }, []);

  // Preselect a point (e.g., first station) when arriving from Home
  useEffect(() => {
    if (typeof preselectIndex === 'number' && points[preselectIndex]) {
      const p = points[preselectIndex];
      const meta = stations[preselectIndex] || { name: "Station", distKm: 1.0, rating: 4.0, addr: "Adresse inconnue", price: 0.30 };
      setSelected({ ...meta, pos: p });
      const start = userPos || routeStart;
      // optimistic fallback route, then replace with routed polyline
      setRoute(makeFakeRoute(start, p));
      fetchOsrmRoute(start, p).then((r) => {
        if (Array.isArray(r) && r.length > 1) setRoute(r);
      });
      setShowQR(false);
    }
  }, [preselectIndex, points, stations, userPos]);

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="relative w-[393px] h-[852px] rounded-[28px] overflow-hidden bg-white shadow-2xl">
        <MapContainer
          center={center}
          zoom={15}
          className="absolute inset-0 z-0"
          zoomControl={false}
          attributionControl={true}
          preferCanvas
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

          {points.map((p, i) => (
            <CircleMarker
              key={i}
              center={p}
              radius={6}
              interactive
              eventHandlers={{
                click: () => {
                  const meta = stations[i] || { name: "Station", distKm: 1.0, rating: 4.0, addr: "Adresse inconnue", price: 0.30 };
                  setSelected({ ...meta, pos: p });
                  const start = userPos || routeStart;
                  // optimistic fallback route, then replace with routed polyline
                  setRoute(makeFakeRoute(start, p));
                  fetchOsrmRoute(start, p).then((r) => {
                    if (Array.isArray(r) && r.length > 1) setRoute(r);
                  });
                  setShowQR(false);
                  setConnectId(makeStationId(p) || "343A4Z5");
                  setConnecting(true);
                  if (connectTimer.current) clearTimeout(connectTimer.current);
                  connectTimer.current = setTimeout(() => setConnecting(false), 2200);
                },
              }}
              pathOptions={{ color: "#C58B00", fillColor: "#C58B00", fillOpacity: 1, weight: 1, opacity: 0.9 }}
            />
          ))}

          {route.length > 1 && (
            <Polyline positions={route} pathOptions={{ color: "#2563EB", weight: 3, opacity: 0.9, dashArray: "6 6" }} />
          )}

          <MyLocation />
          <NudgeCenter dy={-0.0015} />
        </MapContainer>

        <div className="absolute top-4 left-4 right-4 flex items-center gap-2 z-50">
          <div className="flex-1 flex items-center gap-2 bg-white/90 backdrop-blur rounded-xl px-3 h-11 shadow">
            <Search className="h-4 w-4 text-neutral-400" />
            <input placeholder="Trouver une borne" className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-neutral-400" />
          </div>
          <button className="h-11 w-11 grid place-items-center rounded-xl bg-white/90 backdrop-blur shadow" aria-label="Filtres">
            <SlidersHorizontal className="h-4 w-4 text-neutral-700" />
          </button>
        </div>

        <nav className="absolute bottom-0 left-0 right-0 h-16 bg-[#F2E3BF]/90 border-t border-neutral-200 grid grid-cols-4 z-50">
          <Tab icon={<Home className="h-5 w-5" />} label="Accueil" />
          <Tab icon={<Wrench className="h-5 w-5" />} label="Services" active />
          <Tab icon={<Plug className="h-5 w-5" />} label="Ma borne" />
          <Tab icon={<User className="h-5 w-5" />} label="Compte" />
        </nav>

        {selected && !connecting && (
          <BottomSheet
            station={selected}
            onDirections={() => setShowQR(true)}
            onClose={() => {
              setSelected(null);
              setRoute([]);
              setShowQR(false);
            }}
          />
        )}

        {/* Paiement / Scan */}
        {selected && !connecting && showQR && (
          <PaymentPage
            heroSrc={safeAsset("../assets/background_pay.png")}
            chargerSrc={safeAsset("../assets/revolt-charger.png")}
            onStart={() => setShowQR("methods")}
            onCancel={() => setShowQR(false)}
          />
        )}

        {selected && showQR === "methods" && !showActivity && (
          <PaymentMethodsPage
            onBack={() => setShowQR(true)}
            onValidate={() => {
              setShowQR(false);
              setShowActivity(true);
            }}
          />
        )}

        {showActivity && !showSummary && (
          <ChargingActivityPage
            stationName={selected?.name}
            onClose={() => setShowActivity(false)}
            onStop={() => {
              setShowActivity(false);
              setShowSummary(true);
            }}
          />
        )}

        {showSummary && (
          <ChargingSummaryPage
            onClose={() => setShowSummary(false)}
            onRate={() => setShowSummary(false)}
          />
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-36 rounded-full bg-neutral-900/80" />
        {connecting && (
          <ConnectingOverlay id={connectId} />
        )}
      </div>
    </div>
  );
}

function MyLocation() {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setPos([p.coords.latitude, p.coords.longitude]),
      () => void 0,
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
    );
  }, []);
  if (!pos) return null;
  return <CircleMarker center={pos} radius={6} pathOptions={{ color: "#18C37D", fillColor: "#18C37D", fillOpacity: 1, weight: 1 }} />;
}

function NudgeCenter({ dy = 0 }) {
  const map = useMap();
  useEffect(() => {
    const c = map.getCenter();
    map.setView([c.lat + dy, c.lng], map.getZoom(), { animate: false });
  }, [map, dy]);
  return null;
}

function Tab({ icon, label, active }) {
  return (
    <button className={`flex flex-col items-center justify-center gap-1 text-[11px] ${active ? "text-[#D59C2F]" : "text-neutral-400"}`}>
      <div className={`h-6 w-6 grid place-items-center rounded-xl ${active ? "bg-[#EED9A5]" : ""}`}>{icon}</div>
      <span>{label}</span>
    </button>
  );
}

function BottomSheet({ station, onClose, onDirections }) {
  let chargerImg = "/revolt-charger.png";
  try {
    // Works when image is in src/assets/revolt-charger.png
    chargerImg = new URL("../assets/revolt-charger.png", import.meta.url).href;
  } catch {}
  return (
    <div className="absolute left-4 right-4 bottom-[10%] z-[1000]">
      <div className="rounded-3xl bg-[#D8B25E] p-3 shadow-xl">
        <div className="rounded-2xl bg-white shadow p-3 flex items-center gap-3 relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-neutral-900/80 text-white grid place-items-center"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
          <img
            src={chargerImg}
            alt="Chargeur ReVOLT"
            className="h-16 w-16 rounded-xl object-contain bg-neutral-50 p-1"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] font-semibold text-neutral-800">
                  {station.name} <span className="text-[11px] text-neutral-500 align-middle">{station.distKm} km</span>
                </p>
                <RatingStars value={station.rating} />
                <p className="text-[12px] text-neutral-500">{station.addr}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[18px] font-bold text-neutral-900">{station.price.toFixed(2)}€</span>
                <span className="text-[11px] text-neutral-500">/kWh</span>
                <span className="mt-1 inline-block text-[11px] px-2 py-0.5 bg-emerald-500 text-white rounded">Super hôte</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button className="h-11 rounded-2xl bg-white text-neutral-800 font-medium shadow hover:bg-neutral-50">
            Réserver la borne
          </button>
          <button onClick={onDirections} className="h-11 rounded-2xl bg-[#C79E4F] text-white font-semibold shadow hover:bg-[#BD9343] flex items-center justify-center gap-2">
            S'y rendre <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function QRScanButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-5 right-5 bottom-6 z-[900] h-12 rounded-2xl bg-[#D8B25E] text-white font-semibold shadow-lg hover:bg-[#C79E4F] active:scale-[.99] flex items-center justify-center gap-2"
    >
      <QrCode className="h-5 w-5" />
      Scanner le Qr code
    </button>
  );
}

function RatingStars({ value }) {
  const safe = typeof value === 'number' && isFinite(value) ? Math.max(0, Math.min(5, value)) : 0;
  const pct = (safe / 5) * 100;
  const star = (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <path fill="currentColor" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  );
  return (
    <div className="flex items-center gap-1 text-[12px] text-neutral-600">
      <div className="relative inline-flex items-center">
        <div className="flex text-neutral-300">{[0,1,2,3,4].map((i) => <span key={`b-${i}`}>{star}</span>)}</div>
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
          <div className="flex text-yellow-500">{[0,1,2,3,4].map((i) => <span key={`f-${i}`}>{star}</span>)}</div>
        </div>
      </div>
      <span className="ml-1">{safe.toFixed(1)}</span>
    </div>
  );
}

function ConnectingOverlay({ id }) {
  return (
    <div className="absolute inset-0 z-[1200] bg-white/95 backdrop-blur-sm grid place-items-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="text-[28px] font-semibold text-neutral-800">
            <span className="text-neutral-500">Re</span>
            <span className="border-b-4 border-[#D8B25E] pb-1">VOLT</span>
          </div>
          <div className="flex items-end gap-1">
            {[0,1,2,3,4].map((i) => (
              <span key={i} className="inline-block w-2.5 h-2.5 rounded-full bg-[#EACB69] animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
          <img src="https://images.unsplash.com/photo-1601924582971-b0f8f1a2d3bc?q=80&w=120&auto=format&fit=crop" alt="borne" className="h-14 w-10 object-cover rounded" />
        </div>
        <p className="mt-6 text-[15px] font-medium text-[#C79E4F]">Connexion à la borne</p>
        <p className="mt-3 text-[14px] text-neutral-700">Id: {id || "343A4Z5"}</p>
      </div>
    </div>
  );
}

// Tests utilitaires (dev-only)
try {
  const a = [48.20, 2.24];
  const b = [48.852, 2.345];
  const r = makeFakeRoute(a, b);
  console.assert(Array.isArray(r) && r.length === 3, "makeFakeRoute: 3 points attendus");
  console.assert(r[0] !== r[1] && r[1] !== r[2], "makeFakeRoute: milieu distinct");
} catch (e) {
  console.warn("[tests MapScreen]", e);
}


