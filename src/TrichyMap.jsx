import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom HTML pin generator for Leaflet
function createCustomIcon(color, textSymbol) {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 5px rgba(0,0,0,0.35);
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 13px;
          font-weight: bold;
          line-height: 1;
        ">${textSymbol}</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

const hostelIcon = createCustomIcon("#0F7A72", "⌂");
const transitIcon = createCustomIcon("#2563EB", "🚌");
const foodIcon = createCustomIcon("#D97706", "🍴");
const laundryIcon = createCustomIcon("#7C3AED", "🧺");

export default function TrichyMap({ listings, amenities = [], activeLayers = { food: true, transit: true, laundry: true }, onSelectListing }) {
  const trichyCenter = [10.8200, 78.7100];

  return (
    <div style={{ 
      height: "380px", 
      width: "100%", 
      borderRadius: "16px", 
      overflow: "hidden", 
      marginBottom: "24px", 
      border: "1px solid #2A3241",
      touchAction: "none" /* CRITICAL FIX: Stops Chrome from hijacking trackpad */
    }}>
      <MapContainer 
        center={trichyCenter} 
        zoom={11} 
        style={{ height: "100%", width: "100%" }}
        dragging={true}
        tap={false} /* CRITICAL FIX: Disables phantom mobile taps on Mac trackpads */
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render Hostel & PG Markers */}
        {listings.map((l) =>
          l.lat && l.lng ? (
            <Marker key={l.id} position={[l.lat, l.lng]} icon={hostelIcon}>
              <Popup>
                <div style={{ fontFamily: "sans-serif", padding: "2px" }}>
                  <strong style={{ fontSize: "14px", color: "#171B26" }}>{l.name}</strong>
                  <p style={{ margin: "4px 0", color: "#666", fontSize: "12px" }}>{l.area}, {l.city}</p>
                  <p style={{ margin: "2px 0 6px", fontWeight: "bold", color: "#E7522F" }}>₹{l.price.toLocaleString()}/mo</p>
                  <button
                    onClick={() => onSelectListing && onSelectListing(l)}
                    style={{ background: "#00F2FE", color: "#0B0E14", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}

        {/* Render Amenity Markers based on active toggle */}
        {amenities.map((a) => {
          if (!activeLayers[a.type]) return null;
          let icon = transitIcon;
          if (a.type === "food") icon = foodIcon;
          if (a.type === "laundry") icon = laundryIcon;

          return (
            <Marker key={a.id} position={[a.lat, a.lng]} icon={icon}>
              <Popup>
                <div style={{ fontFamily: "sans-serif", padding: "2px" }}>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "700", color: "#6B7280" }}>{a.subType}</span>
                  <h4 style={{ margin: "2px 0 4px", fontSize: "13px", color: "#171B26" }}>{a.name}</h4>
                  <p style={{ margin: 0, fontSize: "11.5px", color: "#4B5563" }}>{a.details}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}