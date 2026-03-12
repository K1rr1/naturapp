import { useState } from "react";
import MapView from "./components/map/MapView";
import StartScreen from "./components/auth/StartScreen";
import type { User } from "./features/auth/auth.types";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState("");

  const handleLogin = () => {
    const trimmedName = nameInput.trim();

    if (!trimmedName) return;

    setCurrentUser({
      mode: "user",
      name: trimmedName,
    });

    setNameInput("");
  };

  const handleContinueAsGuest = () => {
    setCurrentUser({
      mode: "guest",
      name: "Gäst",
    });
  };

  if (!currentUser) {
    return (
      <StartScreen
        nameInput={nameInput}
        onNameChange={setNameInput}
        onLogin={handleLogin}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return <MapView />;
}