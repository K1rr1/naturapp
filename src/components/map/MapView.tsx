import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import type { Pin } from "../../features/pins/pins.types";
import { useState } from "react";

type MapViewProps = {
  currentUserName: string;
  pins: Pin[];
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
};

export default function MapView({
  currentUserName,
  pins,
  setPins,
}: MapViewProps) {
  const [pendingPosition, setPendingPosition] = useState<[number, number] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Pin["category"]>("skräp");

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
  };

  // 👉 Ta bort pin ("städat")
  const handleCleanPin = (id: number) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
  };

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

        {/* 🔹 Rendera alla pins */}
        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <div>
                <strong>Kategori:</strong> {pin.category}
                <br />
                <strong>Beskrivning:</strong> {pin.text}
                <br />
                <strong>Rapporterad av:</strong> {pin.createdBy}
                <br />
                <br />
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
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 🔹 Form när man klickat på kartan */}
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
                    setSelectedCategory(e.target.value as Pin["category"])
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
    </div>
  );
}