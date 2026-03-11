import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

type Pin = {
  id: number;
  lat: number;
  lng: number;
  text: string;
};

const center: [number, number] = [57.7089, 11.9746];
const STORAGE_KEY = "naturapp_pins";

function AddMarkerOnClick({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      console.log("Map clicked:", e.latlng.lat, e.latlng.lng);
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function MapView() {
  const [pins, setPins] = useState<Pin[]>([]);
  const[pendingPosition, setPendingPosition] = useState<[number, number] | null>(null);
  const [textInput, setTextInput] = useState("");
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
          text: "Göteborgs centrum",
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
    console.log("handleMapClick körs:)))))");
    setPendingPosition([lat, lng]);
  };

  const handleAddPin = () => {
    if (!pendingPosition) return;

    const newPin: Pin = {
      id: Date.now(),
      lat: pendingPosition[0],
      lng: pendingPosition[1],
      text: textInput || "Ingen beskrivning",
    };

    setPins((prev) => [...prev, newPin]);
    setPendingPosition(null);
    setTextInput("");
  };

   const handleCancel = () => {
    setPendingPosition(null);
    setTextInput("");
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
            <Popup>{pin.text}</Popup>
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
              padding: "8px",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleAddPin}>Lägg till</button>
            <button onClick={handleCancel}>Avbryt</button>
            
          </div>
        </div>
      )}
    </div>
  );
}