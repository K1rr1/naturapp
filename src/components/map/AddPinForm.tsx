import { Marker, Popup } from "react-leaflet";
import type { PinCategory } from "../../features/pins/pins.types";

type AddPinFormProps = {
  pendingPosition: [number, number];
  textInput: string;
  selectedCategory: PinCategory;
  onTextChange: (value: string) => void;
  onCategoryChange: (value: PinCategory) => void;
  onAddPin: () => void;
};

export default function AddPinForm({
  pendingPosition,
  textInput,
  selectedCategory,
  onTextChange,
  onCategoryChange,
  onAddPin,
}: AddPinFormProps) {
  return (
    <Marker position={pendingPosition}>
      <Popup>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <input
            type="text"
            placeholder="Beskrivning"
            value={textInput}
            onChange={(e) => onTextChange(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as PinCategory)}
          >
            <option value="skräp">🗑️ Skräp</option>
            <option value="trasigt">🔧 Trasigt</option>
            <option value="belysning">💡 Belysning</option>
            <option value="övrigt">📦 Övrigt</option>
          </select>

          <button onClick={onAddPin}>Lägg till</button>
        </div>
      </Popup>
    </Marker>
  );
}