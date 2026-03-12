import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

type PinCategory = "skräp" | "trasigt" | "belysning" | "övrigt";

type Pin = {
  id: number;
  lat: number;
  lng: number;
  text: string;
  category: PinCategory;
};

const center: [number, number] = [57.7089, 11.9746];
const STORAGE_KEY = "naturapp-pins";

function AddMarkerOnClick({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function MapView() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [pendingPosition, setPendingPosition] = useState<[number, number] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PinCategory>("skräp");
  const [hasLoadedPins, setHasLoadedPins] = useState(false);

  useEffect(() => {
    const savedPins = localStorage.getItem(STORAGE_KEY);

    if (savedPins) {
      const parsedPins: Pin[] = JSON.parse(savedPins);
      setPins(parsedPins);
    } else {
      const defaultPins: Pin[] = [
        {
          id: 1,
          lat: 57.7089,
          lng: 11.9746,
          text: "Exempel: skräp hittat här",
          category: "skräp",
        },
      ];

      setPins(defaultPins);
    }

    setHasLoadedPins(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPins) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
  }, [pins, hasLoadedPins]);

  const handleMapClick = (lat: number, lng: number) => {
    setPendingPosition([lat, lng]);
  };

  const handleAddPin = () => {
    if (!pendingPosition) return;

    const newPin: Pin = {
      id: Date.now(),
      lat: pendingPosition[0],
      lng: pendingPosition[1],
      text: textInput || "Ingen beskrivning",
      category: selectedCategory,
    };

    setPins((prev) => [...prev, newPin]);
    setPendingPosition(null);
    setTextInput("");
    setSelectedCategory("skräp");
  };

  const handleCancel = () => {
    setPendingPosition(null);
    setTextInput("");
    setSelectedCategory("skräp");
  };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <AddMarkerOnClick onMapClick={handleMapClick} />

        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <div>
                <strong>Kategori:</strong> {pin.category}
                <br />
                <strong>Beskrivning:</strong> {pin.text}

                <br />
                <br />

                <button
                  onClick={() => {
                    setPins((prev) => prev.filter((p) => p.id !== pin.id));
                  }}
                  style={{
                    backgroundColor: "#3ce761",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Städat!
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {pendingPosition && (
        <div
          style={{
            position: "absolute",
            left: "12px",
            right: "12px",
            bottom: "12px",
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            zIndex: 1000,
          }}
        >
          <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>Ny markör</p>

          <input
            type="text"
            placeholder="Beskriv platsen"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as PinCategory)}
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <option value="skräp">Skräp</option>
            <option value="trasigt">Trasigt</option>
            <option value="belysning">Belysning</option>
            <option value="övrigt">Övrigt</option>
          </select>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleAddPin}>Lägg till</button>
            <button onClick={handleCancel}>Avbryt</button>
          </div>
        </div>
      )}
    </div>
  );
}