type ProfileButtonProps = {
  name: string;
  onOpenProfile: () => void;
};

export default function ProfileButton({ name, onOpenProfile }: ProfileButtonProps) {
  return (
    <button
      onClick={onOpenProfile}
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        padding: "8px 12px",
        borderRadius: "20px",
        border: "none",
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 1000,
        cursor: "pointer",
      }}
    >
      👤 {name}
    </button>
  );
}

