import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import AddMarkerOnClick from "./AddMarkerOnClick";
import AddPinForm from "./AddPinForm";

import type { Pin, PinCategory } from "../../features/pins/pins.types";
import { loadPins, savePins } from "../../features/pins/pins.storage";

const center: [number, number] = [57.7089, 11.9746];

export default function MapView() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [pendingPosition, setPendingPosition] = useState<[number, number] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PinCategory>("skräp");
  const [hasLoadedPins, setHasLoadedPins] = useState(false);

  useEffect(() => {
    const savedPins = loadPins();

    if (savedPins.length > 0) {
      setPins(savedPins);
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
    savePins(pins);
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

  const handleCleanPin = (pinId: number) => {
    setPins((prev) => prev.filter((pin) => pin.id !== pinId));
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
      </MapContainer>

      {pendingPosition && (
        <AddPinForm
          textInput={textInput}
          selectedCategory={selectedCategory}
          onTextChange={setTextInput}
          onCategoryChange={setSelectedCategory}
          onAddPin={handleAddPin}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}