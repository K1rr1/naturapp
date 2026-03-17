import { useEffect, useState } from "react";
import MapView from "./components/map/MapView";
import StartScreen from "./components/auth/StartScreen";
import ProfileButton from "./components/profile/ProfileButton";
import ProfilePanel from "./components/profile/ProfilePanel";

import type { User } from "./features/auth/auth.types";
import type { Pin } from "./features/pins/pins.types";
import { loadPins, savePins } from "./features/pins/pins.storage";

const USER_STORAGE_KEY = "naturapp-user";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const [pins, setPins] = useState<Pin[]>([]);
  const [hasLoadedUser, setHasLoadedUser] = useState(false);
  const [hasLoadedPins, setHasLoadedPins] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
    }

    setHasLoadedUser(true);
  }, []);

  useEffect(() => {
    const savedPins = loadPins();

    if (savedPins.length > 0) {
      setPins(savedPins);
    } else {
      const defaultPins: Pin[] = [
        {
          id: 1,
          lat: 57.7089,
          lng: 11.9746,
          text: "Exempel: skräp hittat här",
          category: "skräp",
          createdBy: "System",
        },
      ];

      setPins(defaultPins);
    }

    setHasLoadedPins(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedUser) return;

    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser, hasLoadedUser]);

  useEffect(() => {
    if (!hasLoadedPins) return;
    savePins(pins);
  }, [pins, hasLoadedPins]);

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

  if (!hasLoadedUser || !hasLoadedPins) {
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
      <MapView
        currentUserName={currentUser.name}
        pins={pins}
        setPins={setPins}
      />

      <ProfileButton
        name={currentUser.name}
        onOpenProfile={() => setProfileOpen(true)}
      />

      {profileOpen && (
        <ProfilePanel
          name={currentUser.name}
          mode={currentUser.mode}
          pins={pins}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}