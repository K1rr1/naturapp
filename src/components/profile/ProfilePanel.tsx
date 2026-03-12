type ProfilePanelProps = {
    name: string;
    mode: "guest" | "user";
    onClose: () => void;
    onLogout: () => void;
};

export default function ProfilePanel({ name, mode, onClose, onLogout }: 
    ProfilePanelProps) {
        return (
            <div
                style={{
                    position: "absolute",
                    top: "60px",
                    right: "12px",
                    width: "240px",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    zIndex: 1000,
                    padding: "16px",
                }}
            >
                <h3 style={{ marginTop: 0 }}>Profil!</h3>
            <p>
                <strong>
                Namn:</strong>
             {name}            </p>

            <p> <strong>typ: </strong> {mode === "guest" ? "Gäst" : "Användare"}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                    onClick={onClose} >stäng</button>
                <button
                    onClick={onLogout} >Logga ut</button>
            </div>
            </div>
        );
    }