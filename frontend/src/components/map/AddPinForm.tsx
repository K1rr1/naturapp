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
        <div className="min-w-220px space-y-3">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
              Ny rapport
            </p>
            <h4 className="text-base font-semibold text-stone-900">
              Lägg till markör
            </h4>
          </div>

          <input
            type="text"
            placeholder="Beskrivning"
            value={textInput}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white"
          />

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as PinCategory)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white"
          >
            <option value="skräp">🗑️ Skräp</option>
            <option value="trasigt">🔧 Trasigt</option>
            <option value="belysning">💡 Belysning</option>
            <option value="övrigt">📦 Övrigt</option>
          </select>

          <button
            onClick={onAddPin}
            className="w-full rounded-2xl bg-green-700 py-3 text-sm font-medium text-white transition hover:bg-green-800"
          >
            Lägg till
          </button>
        </div>
      </Popup>
    </Marker>
  );
}