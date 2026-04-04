import { useMapEvents } from "react-leaflet";

type AddMarkerOnClickProps = {
  onMapClick: (lat: number, lng: number) => void;
};

export default function AddMarkerOnClick({
  onMapClick,
}: AddMarkerOnClickProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}