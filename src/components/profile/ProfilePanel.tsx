import type { Pin } from "../../features/pins/pins.types";

type ProfilePanelProps = {
  name: string;
  mode: "guest" | "user";
  pins: Pin[];
  onClose: () => void;
  onLogout: () => void;
};

export default function ProfilePanel({
  name,
  mode,
  pins,
  onClose,
  onLogout,
}: ProfilePanelProps) {
  const userPins = pins.filter((pin) => pin.createdBy === name);

  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        right: "12px",
        width: "240px",
        background: "white",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 1000,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Profil</h3>

      <p>
        <strong>Namn:</strong> {name}
      </p>

      <p>
        <strong>Typ:</strong> {mode === "guest" ? "Gäst" : "Användare"}
      </p>

      <p>
        <strong>Rapporter skapade:</strong> {userPins.length}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button onClick={onClose}>Stäng</button>
        <button onClick={onLogout}>Logga ut</button>
      </div>
    </div>
  );
}