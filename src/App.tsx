import { useMemo, useState } from "react";
import MapView from "./components/map/MapView";
import StartScreen from "./components/auth/StartScreen";
import ProfileButton from "./components/profile/ProfileButton";
import ProfilePanel from "./components/profile/ProfilePanel";
import SplashScreen from "./components/ui/SplashScreen";

import { useAuth } from "./features/auth/useAuth";
import { usePinStore } from "./features/pins/usePinStore";

export default function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const {
    currentUser,
    usernameInput,
    setUsernameInput,
    passwordInput,
    setPasswordInput,
    login,
    continueAsGuest,
    logout,
    hasLoadedUser,
    isAuthLoading,
    authError,  
  } = useAuth();

  const { pins, setPins, hasLoadedPins } = usePinStore();

  const isAppReady = hasLoadedUser && hasLoadedPins;


  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  if (showSplash) {
    return (
      <SplashScreen
        isReady={isAppReady}
        onFinished={() => setShowSplash(false)}
      />
    );
  }

  if (!hasLoadedUser || !hasLoadedPins) {
    return null;
  }

  if (!currentUser) {
    return (
      <StartScreen
        usernameInput={usernameInput}
        passwordInput={passwordInput}
        authError={authError}
        isAuthLoading={isAuthLoading}
        onUsernameChange={setUsernameInput}
        onPasswordChange={setPasswordInput}
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