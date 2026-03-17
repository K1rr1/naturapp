import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  useMapEvents,
 
  Marker,
} from "react-leaflet";

import type {
  Pin,
  PinCategory,
  CategoryFilter,
  OwnerFilter,
} from "../../features/pins/pins.types";
import MapFilters from "./MapFilters";
import MapPins from "./MapPins";


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
  const [selectedCategory, setSelectedCategory] = useState<PinCategory>("skräp");

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("alla");
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("alla");

  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        setPendingPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return null;
  }

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

  const handleCleanPin = (id: number) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
  };

  const handleResetFilters = () => {
    setCategoryFilter("alla");
    setOwnerFilter("alla");
  };



  const filteredPins = pins.filter((pin) => {
    const matchesCategory =
      categoryFilter === "alla" || pin.category === categoryFilter;

    const matchesOwner =
      ownerFilter === "alla" ||
      (ownerFilter === "mina" && pin.createdBy === currentUserName) ||
      (ownerFilter === "andras" && pin.createdBy !== currentUserName);

    return matchesCategory && matchesOwner;
  });

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <MapContainer
        center={[57.7089, 11.9746]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AddMarkerOnClick />

        {/* 🔹 Rendera pins */}
        <MapPins
          pins={filteredPins}
          currentUserName={currentUserName}
          onCleanPin={handleCleanPin}
        />

        {/* 🔹 Form för ny pin */}
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
                  <option value="skräp">🗑️ Skräp</option>
                  <option value="trasigt">🔧 Trasigt</option>
                  <option value="belysning">💡 Belysning</option>
                  <option value="övrigt">📦 Övrigt</option>
                </select>

                <button onClick={handleAddPin}>Lägg till</button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* 🔹 NY komponent istället för inline UI */}
      <MapFilters
        categoryFilter={categoryFilter}
        ownerFilter={ownerFilter}
        setCategoryFilter={setCategoryFilter}
        setOwnerFilter={setOwnerFilter}
        onReset={handleResetFilters}
      />

      {/* 🔹 Tom-state */}
      {filteredPins.length === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "12px",
            right: "12px",
            zIndex: 1000,
            background: "white",
            padding: "14px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            textAlign: "center",
          }}
        >
          Inga rapporter matchar filtret.
        </div>
      )}
    </div>
  );
}