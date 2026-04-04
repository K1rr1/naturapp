import { useEffect, useState } from "react";
import MapView from "./components/map/MapView";
import StartScreen from "./components/auth/StartScreen";
import ProfileButton from "./components/profile/ProfileButton";
import ProfilePanel from "./components/profile/ProfilePanel";
import SplashScreen from "./components/ui/SplashScreen";
import Onboarding from "./components/ui/Onboarding";

import { useAuth } from "./features/auth/useAuth";
import { usePinStore } from "./features/pins/usePinStore";

const ONBOARDING_STORAGE_KEY = "naturapp-onboarding-done";

export default function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const {
    currentUser,
    nameInput,
    usernameInput,
    passwordInput,
    setNameInput,
    setUsernameInput,
    setPasswordInput,
    login,
    register,
    continueAsGuest,
    logout,
    hasLoadedUser,
    isAuthLoading,
    authError,
    authMode,
    setAuthMode,
  } = useAuth();

  const { pins, setPins, hasLoadedPins } = usePinStore();

  const isAppReady = hasLoadedUser && hasLoadedPins;

  useEffect(() => {
    if (!showSplash && isAppReady) {
      const hasSeenOnboarding = localStorage.getItem(ONBOARDING_STORAGE_KEY);

      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [showSplash, isAppReady]);

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

  if (showOnboarding) {
    return (
      <Onboarding
        onFinish={() => {
          setShowOnboarding(false);
        }}
      />
    );
  }

  if (!currentUser) {
    return (
      <StartScreen
        nameInput={nameInput}
        usernameInput={usernameInput}
        passwordInput={passwordInput}
        authError={authError}
        isAuthLoading={isAuthLoading}
        authMode={authMode}
        onNameChange={setNameInput}
        onUsernameChange={setUsernameInput}
        onPasswordChange={setPasswordInput}
        onLogin={login}
        onRegister={register}
        onContinueAsGuest={continueAsGuest}
        onAuthModeChange={setAuthMode}
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