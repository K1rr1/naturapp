import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

type Pin = {
  id: number;
  lat: number;
  lng: number;
  text: string;
};

const center: [number, number] = [57.7089, 11.9746];

function AddMarkerOnClick({
  onAddPin,
}: {
  onAddPin: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onAddPin(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function MapView() {
  const [pins, setPins] = useState<Pin[]>([
    {
      id: 1,
      lat: 57.7089,
      lng: 11.9746,
      text: "Skräp hittat här!",
    },
  ]);

  const handleAddPin = (lat: number, lng: number) => {
    const newPin: Pin = {
      id: Date.now(),
      lat,
      lng,
      text: "Ny rapporterad plats",
    };

    setPins((prevPins) => [...prevPins, newPin]);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <AddMarkerOnClick onAddPin={handleAddPin} />

        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>{pin.text}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}