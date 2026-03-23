import { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";

import MapFilters from "./MapFilters";
import MapPins from "./MapPins";
import AddPinForm from "./AddPinForm";

import type {
  Pin,
  PinCategory,
  CategoryFilter,
  OwnerFilter,
} from "../../features/pins/pins.types";

import { usePins } from "../../features/pins/usePins";
import { useFilters } from "../../features/pins/useFilters";

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

  const {  handleAddPin,
  handleCleanPin,
  handleCreateEvent,
  handleRemoveEvent,} = usePins({
    currentUserName,
    pendingPosition,
    textInput,
    selectedCategory,
    setPins,
    setPendingPosition,
    setTextInput,
    setSelectedCategory,
  });



  const { filteredPins } = useFilters({
    pins,
    categoryFilter,
    ownerFilter,
    currentUserName,
  });

  const handleResetFilters = () => {
    setCategoryFilter("alla");
    setOwnerFilter("alla");
  };

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

        <MapPins
          pins={filteredPins}
          currentUserName={currentUserName}
          onCleanPin={handleCleanPin}
          onCreateEvent={handleCreateEvent}
          onRemoveEvent={handleRemoveEvent}
/>

        {pendingPosition && (
          <AddPinForm
            pendingPosition={pendingPosition}
            textInput={textInput}
            selectedCategory={selectedCategory}
            onTextChange={setTextInput}
            onCategoryChange={setSelectedCategory}
            onAddPin={handleAddPin}
          />
        )}
      </MapContainer>

      <MapFilters
        categoryFilter={categoryFilter}
        ownerFilter={ownerFilter}
        setCategoryFilter={setCategoryFilter}
        setOwnerFilter={setOwnerFilter}
        onReset={handleResetFilters}
      />

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