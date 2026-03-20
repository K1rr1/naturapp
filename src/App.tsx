import { useState } from "react";
import MapView from "./components/map/MapView";
import StartScreen from "./components/auth/StartScreen";
import ProfileButton from "./components/profile/ProfileButton";
import ProfilePanel from "./components/profile/ProfilePanel";

import { useAuth } from "./features/auth/useAuth";
import { usePinStore } from "./features/pins/usePinStore";

export default function App() {
  const [profileOpen, setProfileOpen] = useState(false);

  const {
    currentUser,
    nameInput,
    setNameInput,
    login,
    continueAsGuest,
    logout,
    hasLoadedUser,
  } = useAuth();

  const { pins, setPins, hasLoadedPins } = usePinStore();

  const handleLogout = () => {
    logout();
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
        onLogin={login}
        onContinueAsGuest={continueAsGuest}
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