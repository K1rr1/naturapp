import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker } from "react-leaflet";
import type { Pin, PinCategory } from "../../features/pins/pins.types";
import { useState } from "react";

type MapViewProps = {
  currentUserName: string;
  pins: Pin[];
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
};
type CategoryFilter = PinCategory | "alla";
type OwnerFilter = "alla" | "mina" | "andras";

export default function MapView({
  currentUserName,
  pins,
  setPins,
}: MapViewProps) {
  const [pendingPosition, setPendingPosition] = useState<[number, number] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PinCategory>("skräp");

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("alla");
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("alla");



  // 👉 Lyssnar på klick på kartan
  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        setPendingPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  }

  // 👉 Lägg till pin
  const handleAddPin = () => {
    if (!pendingPosition) return;

    const newPin: Pin = {
      id: Date.now(),
      lat: pendingPosition[0],
      lng: pendingPosition[1],
      text: textInput || "Ingen beskrivning",
      category: selectedCategory,
      createdBy: currentUserName,
    };

    setPins((prev) => [...prev, newPin]);
    setPendingPosition(null);
    setTextInput("");
    setSelectedCategory("skräp");
  };

  // 👉 Ta bort pin ("städat")
  const handleCleanPin = (id: number) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
  };

  const getMarkerColor = (category: PinCategory) => {
    switch (category) {
      case "skräp":
        return "red";
      case "trasigt":
        return "orange";
      case "belysning":
        return "yellow";
      case "övrigt":
        return "blue";
      default:
        return "gray";
    }
  };
  const filteredPins = pins.filter((pin) => {
    const matchesCategory =
      categoryFilter === "alla" || pin.category === categoryFilter;
    const matchesOwner =
      ownerFilter === "alla" || (ownerFilter === "mina" && pin.createdBy === currentUserName) || (ownerFilter === "andras" && pin.createdBy !== currentUserName);

    return matchesCategory && matchesOwner;
  });


  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[57.7089, 11.9746]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

    <AddMarkerOnClick />

        {filteredPins.map((pin) => {
          const isOwner = pin.createdBy === currentUserName;
          const markerColor = getMarkerColor(pin.category);

          return (
            <CircleMarker 
            key={pin.id} 
            center={[pin.lat, pin.lng]} 
            radius={10} 
            pathOptions={{ color: markerColor, fillColor: markerColor, fillOpacity: 0.5 }}>
              <Popup>
                <div>
                  <strong>Kategori:</strong> {pin.category}
                  <br />
                  <strong>Beskrivning:</strong> {pin.text}
                  <br />
                  <strong>Rapporterad av:</strong> {pin.createdBy}
                  <br />
                  <br />

                  {isOwner ? (
                    <button
                      onClick={() => handleCleanPin(pin.id)}
                      style={{
                        padding: "6px 10px",
                        background: "#2e7d32",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Städat
                    </button>
                  ) : (
                    <p style={{ margin: 0, fontSize: "14px" }}>
                      Bara skaparen kan markera denna som städad.
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {pendingPosition && (
          <Marker position={pendingPosition}>
            <Popup>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <input
                  type="text"
                  placeholder="Beskrivning"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />

                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as PinCategory)
                  }
                >
                  <option value="skräp">Skräp</option>
                  <option value="trasigt">Trasigt</option>
                  <option value="belysning">Belysning</option>
                  <option value="övrigt">Övrigt</option>
                </select>

                <button onClick={handleAddPin}>Lägg till</button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
<div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          zIndex: 1000,
          background: "white",
          padding: "12px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "160px",
        }}
      >
        <strong>Filter</strong>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
        >
          <option value="alla">Alla kategorier</option>
          <option value="skräp">Skräp</option>
          <option value="trasigt">Trasigt</option>
          <option value="belysning">Belysning</option>
          <option value="övrigt">Övrigt</option>
        </select>

        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value as OwnerFilter)}
        >
          <option value="alla">Alla rapporter</option>
          <option value="mina">Mina</option>
          <option value="andras">Andras</option>
        </select>
      </div>
    </div>
  );
}