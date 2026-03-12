type StartScreenProps = {
  nameInput: string;
  onNameChange: (value: string) => void;
  onLogin: () => void;
  onContinueAsGuest: () => void;
};

export default function StartScreen({
  nameInput,
  onNameChange,
  onLogin,
  onContinueAsGuest,
}: StartScreenProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Naturappen</h1>
        <p style={{ marginTop: 0, marginBottom: "16px" }}>
          Logga in eller fortsätt som gäst
        </p>

        <input
          type="text"
          placeholder="Skriv ditt namn"
          value={nameInput}
          onChange={(e) => onNameChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={onLogin}>Logga in</button>
          <button onClick={onContinueAsGuest}>Fortsätt som gäst</button>
        </div>
      </div>
    </div>
  );
}