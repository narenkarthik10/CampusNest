import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Star, ShieldCheck, Heart, X, Plus, LogOut, User, Home, Navigation, Utensils, Bus, Shirt } from "lucide-react";
import TrichyMap from "./TrichyMap";
import { AMENITIES_DATA, calculateDistanceKm } from "./amenitiesData";

// --- HIGH-FIDELITY DARK PALETTE ---
const PALETTE = {
  background: "#0B0E14", 
  surface: "#151A23",    
  border: "#2A3241",     
  textMain: "#F8F9FA",   
  textMuted: "#9CA3AF",  
  accentPrimary: "#00F2FE", 
  accentSecondary: "#FE5196", 
  amber: "#F59E0B",      
};

// --- UPDATED LISTINGS WITH YOUR IMAGES ---
const SEED_LISTINGS = [
  {
    id: "l1",
    name: "White and Black Hostel",
    city: "Trichy",
    area: "Irungalur",
    lat: 10.9585,
    lng: 78.7420,
    price: 5500,
    gender: "Male",
    facilities: ["WiFi", "Meals", "Laundry", "Parking"],
    rating: 4.3,
    verified: true,
    images: ["/images/whiteandblack.jpeg"],
    desc: "Popular student hostel offering straightforward amenities, regular meals, and direct access to primary campus routes."
  },
  {
    id: "l2",
    name: "Vetri Boys Hostel",
    city: "Trichy",
    area: "Samayapuram",
    lat: 10.9550,
    lng: 78.7455,
    price: 5200,
    gender: "Male",
    facilities: ["WiFi", "Power Backup", "RO Water"],
    rating: 4.1,
    verified: false,
    images: ["/images/Vetri menns hostel.jpeg"],
    desc: "Budget-friendly student accommodation with reliable power backup and convenient transit access."
  },
  {
    id: "l3",
    name: "BEST Ladies Hostel",
    city: "Trichy",
    area: "Irungalur",
    lat: 10.9602,
    lng: 78.7395,
    price: 6500,
    gender: "Female",
    facilities: ["Security", "CCTV", "Meals", "Washing Machine"],
    rating: 4.6,
    verified: true,
    images: ["/images/best ladies hostel.jpeg", "/images/BLH-view.webp"],
    desc: "Secure women's hostel with biometric entry, round-the-clock CCTV surveillance, and hygienic mess facilities."
  },
  {
    id: "l4",
    name: "Murugaeswari PG",
    city: "Trichy",
    area: "Thuvakudi",
    lat: 10.7635,
    lng: 78.7847,
    price: 6000,
    gender: "Any",
    facilities: ["WiFi", "AC", "Meals", "TV"],
    rating: 4.5,
    verified: true,
    images: ["/images/Murugaeswari PG.avif"],
    desc: "Student accommodation situated along the Tanjore Highway with single and double occupancy options."
  },
  {
    id: "l5",
    name: "Cauvery Comfort PG",
    city: "Trichy",
    area: "Thillai Nagar",
    lat: 10.8284,
    lng: 78.6868,
    price: 7500,
    gender: "Male",
    facilities: ["WiFi", "AC", "Attached Bath", "Housekeeping"],
    rating: 4.7,
    verified: true,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800"], 
    desc: "Premium rooms situated in the heart of commercial and academic coaching districts."
  },
  {
    id: "l6",
    name: "Shalom Mansion Monthly Stay",
    city: "Trichy",
    area: "Cantonment",
    lat: 10.8035,
    lng: 78.6876,
    price: 5000,
    gender: "Female",
    facilities: ["CCTV", "Daily Cleaning", "24/7 Water"],
    rating: 4.8,
    verified: true,
    images: ["/images/shalom mansion.jpg", "/images/shalom masion1.webp"],
    desc: "Spacious, well-ventilated rooms for women in a safe, central neighborhood close to dining options."
  },
  {
    id: "l7",
    name: "Grace Tabernacle PG",
    city: "Trichy",
    area: "Edamalaipatti Pudur",
    lat: 10.7813,
    lng: 78.6750,
    price: 4000,
    gender: "Male",
    facilities: ["AC", "Power Backup", "TV"],
    rating: 4.2,
    verified: true,
    images: ["/images/Grace Tabernacle PG.jpg"],
    desc: "Managed male PG offering single, double, triple, and four-sharing occupancy choices."
  },
  {
    id: "l8",
    name: "Seetas Illam",
    city: "Trichy",
    area: "Kumaran Nagar",
    lat: 10.8351,
    lng: 78.6946,
    price: 5000,
    gender: "Any",
    facilities: ["WiFi", "AC", "Meals"],
    rating: 4.5,
    verified: true,
    images: ["/images/Seetha Illam.jpg", "/images/Seetha Illam1.avif"],
    desc: "Modern unisex stay close to primary educational and transport hubs with single rooms."
  }
];

function StampBadge({ verified }) {
  return (
    <span className="stamp-badge" style={{ color: verified ? PALETTE.accentPrimary : PALETTE.textMuted, borderColor: verified ? PALETTE.accentPrimary : PALETTE.border }}>
      {verified ? <><ShieldCheck size={12} /> VERIFIED</> : "PENDING"}
    </span>
  );
}

export default function App() {
  const [screen, setScreen] = useState("browse");
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showAddListing, setShowAddListing] = useState(false);

  const [mapLayers, setMapLayers] = useState({ food: true, transit: true, laundry: true });
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [filters, setFilters] = useState({ q: "", gender: "All", maxPrice: 12000, sort: "rating" });

  useEffect(() => {
    const storedListings = localStorage.getItem("cn_listings");
    setListings(storedListings ? JSON.parse(storedListings) : SEED_LISTINGS);
    const storedReviews = localStorage.getItem("cn_reviews");
    if (storedReviews) setReviews(JSON.parse(storedReviews));

    const storedUser = localStorage.getItem("cn_current_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setCurrentUser(u);
      const favs = localStorage.getItem(`cn_favs_${u.email}`);
      if (favs) setFavorites(JSON.parse(favs));
    }
    setLoading(false);
  }, []);

  function toggleMapLayer(layer) {
    setMapLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }

  function handleAuth(e, type) {
    e.preventDefault();
    setError("");
    const { name, email, password, role } = authForm;
    if (type === "register" && (!name.trim() || !email.trim() || !password.trim())) {
      return setError("Fill in all fields.");
    }
    
    let user = { name, email, password, role };
    if (type === "login") {
      const stored = localStorage.getItem(`cn_user_${email}`);
      if (!stored) return setError("Account not found.");
      user = JSON.parse(stored);
      if (user.password !== password) return setError("Wrong password.");
    } else {
      localStorage.setItem(`cn_user_${email}`, JSON.stringify(user));
    }

    localStorage.setItem("cn_current_user", JSON.stringify(user));
    setCurrentUser(user);
    const favs = localStorage.getItem(`cn_favs_${email}`);
    setFavorites(favs ? JSON.parse(favs) : []);
    setScreen("browse");
  }

  function handleLogout() {
    localStorage.removeItem("cn_current_user");
    setCurrentUser(null);
    setFavorites([]);
  }

  function toggleFavorite(id) {
    if (!currentUser) return setScreen("auth");
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem(`cn_favs_${currentUser.email}`, JSON.stringify(next));
  }

  const filtered = useMemo(() => {
    let out = listings.filter((l) => {
      if (filters.q && !`${l.name} ${l.area} ${l.city}`.toLowerCase().includes(filters.q.toLowerCase())) return false;
      if (filters.gender !== "All" && l.gender !== filters.gender && l.gender !== "Any") return false;
      if (l.price > filters.maxPrice) return false;
      return true;
    });
    out.sort((a, b) => (filters.sort === "rating" ? b.rating - a.rating : a.price - b.price));
    return out;
  }, [listings, filters]);

  const nearbyAmenities = useMemo(() => {
    if (!selected || !selected.lat || !selected.lng) return [];
    return AMENITIES_DATA.map((a) => ({
      ...a, distance: calculateDistanceKm(selected.lat, selected.lng, a.lat, a.lng),
    })).sort((a, b) => a.distance - b.distance);
  }, [selected]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: PALETTE.background, minHeight: "100vh", color: PALETTE.textMain }}>
      
      <style>{`
        body { background-color: ${PALETTE.background}; margin: 0; }
        .glass-nav { 
          background: rgba(11, 14, 20, 0.7); 
          backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid ${PALETTE.border}; 
          position: sticky; top: 0; z-index: 100; 
        }
        .listing-card { 
          background: ${PALETTE.surface}; 
          border: 1px solid ${PALETTE.border}; 
          border-radius: 16px; 
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          position: relative;
        }
        .listing-card:hover { 
          transform: translateY(-6px); 
          box-shadow: 0 12px 24px rgba(0, 242, 254, 0.08); 
          border-color: ${PALETTE.accentPrimary}; 
        }
        .custom-input { 
          background: ${PALETTE.background}; 
          border: 1px solid ${PALETTE.border}; 
          color: ${PALETTE.textMain}; 
          padding: 12px 16px; 
          border-radius: 10px; 
          outline: none; 
          transition: border 0.2s; 
          box-sizing: border-box;
          width: 100%;
        }
        .custom-input:focus { border-color: ${PALETTE.accentPrimary}; }
        .btn-primary { 
          background: linear-gradient(135deg, ${PALETTE.accentPrimary}, #0088cc); 
          color: #0B0E14; 
          font-weight: 700; 
          border: none; 
          border-radius: 8px; 
          padding: 10px 18px; 
          cursor: pointer; 
          transition: transform 0.2s; 
        }
        .btn-primary:hover { transform: scale(1.03); }
        .btn-outline {
          background: transparent;
          border: 1px solid ${PALETTE.border};
          color: ${PALETTE.textMain};
          border-radius: 8px;
          padding: 8px 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-outline:hover { background: ${PALETTE.surface}; border-color: ${PALETTE.textMuted}; }
        .stamp-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700;
          border: 1px dashed; border-radius: 999px;
          padding: 4px 10px; letter-spacing: 0.5px;
        }
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 999;
        }
        .modal-content {
          background: ${PALETTE.surface}; border: 1px solid ${PALETTE.border};
          border-radius: 20px; max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${PALETTE.background}; }
        ::-webkit-scrollbar-thumb { background: ${PALETTE.border}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${PALETTE.textMuted}; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Navbar */}
      <nav className="glass-nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setScreen("browse")}>
          <div style={{ background: PALETTE.accentPrimary, padding: "8px", borderRadius: "10px", color: PALETTE.background }}>
            <Home size={18} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>CampusNest</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {currentUser ? (
            <>
              {currentUser.role === "admin" && (
                <button className="btn-primary" onClick={() => setShowAddListing(true)} style={{ display: "flex", gap: 6 }}>
                  <Plus size={16} /> Add Listing
                </button>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 8, color: PALETTE.textMuted, fontSize: 14 }}>
                <User size={16} /> {currentUser.name}
              </span>
              <button className="btn-outline" onClick={handleLogout} style={{ display: "flex", gap: 6 }}>
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setScreen("auth")}>Log in / Register</button>
          )}
        </div>
      </nav>

      {/* Auth Screen */}
      {screen === "auth" && (
        <div style={{ maxWidth: 420, margin: "80px auto", padding: 32, background: PALETTE.surface, borderRadius: 20, border: `1px solid ${PALETTE.border}` }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button onClick={() => { setAuthMode("login"); setError(""); }} className="btn-outline" style={{ flex: 1, borderColor: authMode === "login" ? PALETTE.accentPrimary : PALETTE.border, color: authMode === "login" ? PALETTE.accentPrimary : PALETTE.textMain }}>Login</button>
            <button onClick={() => { setAuthMode("register"); setError(""); }} className="btn-outline" style={{ flex: 1, borderColor: authMode === "register" ? PALETTE.accentPrimary : PALETTE.border, color: authMode === "register" ? PALETTE.accentPrimary : PALETTE.textMain }}>Register</button>
          </div>
          <form onSubmit={(e) => handleAuth(e, authMode)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {authMode === "register" && (
              <input className="custom-input" placeholder="Full name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
            )}
            <input className="custom-input" placeholder="Email address" type="email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
            <input className="custom-input" placeholder="Password" type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
            {authMode === "register" && (
              <select className="custom-input" value={authForm.role} onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="admin">Platform Admin</option>
              </select>
            )}
            {error && <div style={{ color: PALETTE.accentSecondary, fontSize: 13, fontWeight: 600 }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ padding: "14px", marginTop: 8, fontSize: 15 }}>
              {authMode === "login" ? "Access Account" : "Create Account"}
            </button>
          </form>
        </div>
      )}

      {/* Browse Screen */}
      {screen === "browse" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-1px" }}>Discover Trichy Stays</h1>
              <p style={{ color: PALETTE.textMuted, fontSize: 15, margin: 0 }}>Showing {filtered.length} verified accommodations in your area</p>
            </div>
            
            <div style={{ display: "flex", gap: 10 }}>
              {['transit', 'food', 'laundry'].map(layer => (
                <button key={layer} onClick={() => toggleMapLayer(layer)} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 6, borderColor: mapLayers[layer] ? PALETTE.accentPrimary : PALETTE.border, color: mapLayers[layer] ? PALETTE.accentPrimary : PALETTE.textMuted }}>
                  {layer === 'transit' ? <Bus size={14}/> : layer === 'food' ? <Utensils size={14}/> : <Shirt size={14}/>} 
                  <span style={{ textTransform: "capitalize" }}>{layer}</span>
                </button>
              ))}
            </div>
          </div>

          <TrichyMap listings={filtered} amenities={AMENITIES_DATA} activeLayers={mapLayers} onSelectListing={(l) => setSelected(l)} />

          <div style={{ display: "flex", gap: 12, margin: "32px 0 24px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 250px" }}>
              <Search size={18} style={{ position: "absolute", left: 14, top: 12, color: PALETTE.textMuted }} />
              <input className="custom-input" placeholder="Search by area (e.g. Samayapuram)" value={filters.q} onChange={e => setFilters({ ...filters, q: e.target.value })} style={{ paddingLeft: 42 }} />
            </div>
            <select className="custom-input" value={filters.gender} onChange={e => setFilters({ ...filters, gender: e.target.value })} style={{ width: 160 }}>
              <option value="All">All Genders</option><option value="Male">Male</option><option value="Female">Female</option>
            </select>
            <select className="custom-input" value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })} style={{ width: 180 }}>
              <option value="rating">Top Rated</option><option value="price">Lowest Price</option>
            </select>
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {filtered.map((l) => (
              <div key={l.id} className="listing-card" onClick={() => setSelected(l)} style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ position: "relative", height: "200px", width: "100%" }}>
                  <img 
                    src={(l.images && l.images.length > 0) ? l.images[0] : "https://via.placeholder.com/400x200?text=No+Image"} 
                    alt={l.name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(l.id); }} style={{ position: "absolute", top: 12, right: 12, background: "rgba(11, 14, 20, 0.6)", backdropFilter: "blur(4px)", borderRadius: "50%", padding: 8, border: "none", cursor: "pointer", display: "flex" }}>
                    <Heart size={18} fill={favorites.includes(l.id) ? PALETTE.accentSecondary : "none"} color={favorites.includes(l.id) ? PALETTE.accentSecondary : PALETTE.textMain} />
                  </button>
                </div>

                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: 18, margin: "0 0 10px", paddingRight: 40, fontWeight: 700 }}>{l.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: PALETTE.textMuted, fontSize: 13, marginBottom: 16 }}>
                    <MapPin size={14} color={PALETTE.accentPrimary} /> {l.area}, {l.city} <span style={{ opacity: 0.5 }}>|</span> {l.gender}
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: `1px solid ${PALETTE.border}`, paddingTop: 16 }}>
                    <div>
                      <span style={{ display: "block", fontSize: 11, color: PALETTE.textMuted, marginBottom: 2 }}>Monthly Rent</span>
                      <span style={{ fontWeight: 800, fontSize: 20, color: PALETTE.textMain }}>₹{l.price.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 600 }}><Star size={14} fill={PALETTE.amber} color={PALETTE.amber} /> {l.rating.toFixed(1)}</span>
                      <StampBadge verified={l.verified} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 0, overflow: "hidden" }}>
            
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }} className="hide-scrollbar">
                {selected.images && selected.images.length > 0 ? (
                  selected.images.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`${selected.name} - View ${index + 1}`} 
                      style={{ width: "100%", height: "280px", objectFit: "cover", flexShrink: 0, scrollSnapAlign: "start" }} 
                    />
                  ))
                ) : (
                  <img 
                    src="https://via.placeholder.com/800x400?text=No+Image" 
                    alt="Placeholder" 
                    style={{ width: "100%", height: "280px", objectFit: "cover", flexShrink: 0, scrollSnapAlign: "start" }} 
                  />
                )}
              </div>
              <button onClick={() => setSelected(null)} className="btn-outline" style={{ position: "absolute", top: 16, right: 16, background: "rgba(11,14,20,0.7)", border: "none", padding: 8, backdropFilter: "blur(4px)", zIndex: 10 }}>
                <X size={20} color="#fff" />
              </button>
              {selected.images && selected.images.length > 1 && (
                <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(11,14,20,0.7)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#fff", zIndex: 10 }}>
                  Swipe for more ({selected.images.length})
                </div>
              )}
            </div>

            <div style={{ padding: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 24, margin: "0 0 6px", fontWeight: 800 }}>{selected.name}</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: PALETTE.textMuted, fontSize: 14 }}>
                    <MapPin size={14} /> {selected.area}, {selected.city}
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px", background: PALETTE.background, borderRadius: 12, marginBottom: 20 }}>
                <span style={{ fontWeight: 800, fontSize: 22, color: PALETTE.accentSecondary }}>₹{selected.price.toLocaleString()}<span style={{ fontSize: 14, color: PALETTE.textMuted, fontWeight: 500 }}>/mo</span></span>
                <StampBadge verified={selected.verified} />
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 13 }}>
                  <Navigation size={14} /> Navigate
                </a>
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.6, color: PALETTE.textMuted, marginBottom: 24 }}>{selected.desc}</p>

              <h4 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "1px", color: PALETTE.textMuted, marginBottom: 12 }}>Facilities</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {selected.facilities.map((f) => (
                  <span key={f} style={{ fontSize: 13, background: PALETTE.background, border: `1px solid ${PALETTE.border}`, borderRadius: 8, padding: "6px 12px", color: PALETTE.textMain }}>{f}</span>
                ))}
              </div>

              <h4 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "1px", color: PALETTE.textMuted, marginBottom: 12 }}>Proximity Matrix</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {nearbyAmenities.slice(0, 3).map((a) => (
                  <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: PALETTE.background, padding: "12px 16px", borderRadius: 10, border: `1px solid ${PALETTE.border}` }}>
                    <div>
                      <strong style={{ display: "block", fontSize: 14, marginBottom: 2 }}>{a.name}</strong>
                      <span style={{ color: PALETTE.textMuted, fontSize: 12 }}>{a.subType}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: PALETTE.accentPrimary }}>{a.distance} km</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}