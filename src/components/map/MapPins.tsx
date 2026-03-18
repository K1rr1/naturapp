import { CircleMarker, Popup } from "react-leaflet";
import type { Pin, PinCategory } from "../../features/pins/pins.types";

type Props = {
  pins: Pin[];
  currentUserName: string;
  onCleanPin: (id: number) => void;
};

export default function MapPins({
  pins,
  currentUserName,
  onCleanPin,
}: Props) {
  const getMarkerColor = (category: PinCategory) => {
    switch (category) {
      case "skräp":
        return "#2e7d32";
      case "trasigt":
        return "#d84315";
      case "belysning":
        return "#f9a825";
      case "övrigt":
        return "#616161";
      default:
        return "#1976d2";
    }
  };

  return (
    <>
      {pins.map((pin) => {
        const isOwner = pin.createdBy === currentUserName;
        const markerColor = getMarkerColor(pin.category);

        return (
          <CircleMarker
            key={pin.id}
            center={[pin.lat, pin.lng]}
            radius={10}
            pathOptions={{
              color: markerColor,
              fillColor: markerColor,
              fillOpacity: 0.9,
            }}
          >
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
                    onClick={() => onCleanPin(pin.id)}
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
    </>
  );
}