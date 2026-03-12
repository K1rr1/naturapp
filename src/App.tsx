import { useState } from "react";
import MapView from "./components/map/MapView";
import StartScreen from "./components/auth/StartScreen";
import ProfileButton from "./components/profile/ProfileButton";
import ProfilePanel from "./components/profile/ProfilePanel";

import type { User } from "./features/auth/auth.types";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

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

  const handleLogout = () => {
    setCurrentUser(null);
    setProfileOpen(false);
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

  return (
    <div style={{ position: "relative" }}>
      <MapView />

      <ProfileButton
        name={currentUser.name}
        onOpenProfile={() => setProfileOpen(true)}
      />

      {profileOpen && (
        <ProfilePanel
          name={currentUser.name}
          mode={currentUser.mode}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}