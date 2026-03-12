import { useEffect, useState } from "react";
import MapView from "./components/map/MapView";
import StartScreen from "./components/auth/StartScreen";
import ProfileButton from "./components/profile/ProfileButton";
import ProfilePanel from "./components/profile/ProfilePanel";

import type { User } from "./features/auth/auth.types";

const USER_STORAGE_KEY = "naturapp-user";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [hasLoadedUser, setHasLoadedUser] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
    }

    setHasLoadedUser(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedUser) return;

    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser, hasLoadedUser]);

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

  if (!hasLoadedUser) {
    return null;
  }

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