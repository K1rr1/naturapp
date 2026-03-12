import type { PinCategory } from "../../features/pins/pins.types";

type AddPinFormProps = {
  textInput: string;
  selectedCategory: PinCategory;
  onTextChange: (value: string) => void;
  onCategoryChange: (value: PinCategory) => void;
  onAddPin: () => void;
  onCancel: () => void;
};

export default function AddPinForm({
  textInput,
  selectedCategory,
  onTextChange,
  onCategoryChange,
  onAddPin,
  onCancel,
}: AddPinFormProps) {
  return (
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
        onChange={(e) => onTextChange(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "12px",
          padding: "10px",
          boxSizing: "border-box",
        }}
      />

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as PinCategory)}
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
        <button onClick={onAddPin}>Lägg till</button>
        <button onClick={onCancel}>Avbryt</button>
      </div>
    </div>
  );
}