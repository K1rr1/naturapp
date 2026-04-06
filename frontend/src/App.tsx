import { useEffect, useState } from "react";
import MapView from "./components/map/MapView";
import StartScreen from "./components/auth/StartScreen";
import ProfileButton from "./components/profile/ProfileButton";
import ProfilePanel from "./components/profile/ProfilePanel";
import SplashScreen from "./components/ui/SplashScreen";
import Onboarding from "./components/ui/Onboarding";
import NotificationsPanel from "./components/notifications/NotificationsPanel";
import CommunityFeed from "./components/community/CommunityFeed";

import { useAuth } from "./features/auth/useAuth";
import { usePinStore } from "./features/pins/usePinStore";
import { useNotifications } from "./features/notifications/useNotifications";
import { useCommunityFeed } from "./components/community/useCommunityFeed";

const ONBOARDING_STORAGE_KEY = "naturapp-onboarding-done";

export default function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

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

  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const { feedItems, communityStats } = useCommunityFeed({ pins });

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
    setNotificationsOpen(false);
    setCommunityOpen(false);
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

      <button
        onClick={() => {
          addNotification(
            "event-join",
            "Någon gick med i ditt event",
            "2 personer har nu gått med i din städinsats."
          );
          setNotificationsOpen(true);
        }}
        style={{
          position: "absolute",
          top: "80px",
          right: "12px",
          zIndex: 1000,
          padding: "10px 14px",
          borderRadius: "12px",
          border: "none",
          background: "#1f2937",
          color: "white",
          cursor: "pointer",
        }}
      >
        Notiser
      </button>

      <button
        onClick={() => setCommunityOpen(true)}
        style={{
          position: "absolute",
          top: "132px",
          right: "12px",
          zIndex: 1000,
          padding: "10px 14px",
          borderRadius: "12px",
          border: "none",
          background: "#556B2F",
          color: "white",
          cursor: "pointer",
        }}
      >
        Flöde
      </button>

      {profileOpen && (
        <ProfilePanel
          name={currentUser.name}
          mode={currentUser.mode}
          pins={pins}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
        />
      )}

      {notificationsOpen && (
        <NotificationsPanel
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClose={() => setNotificationsOpen(false)}
        />
      )}

      {communityOpen && (
        <CommunityFeed
          feedItems={feedItems}
          totalReports={communityStats.totalReports}
          totalEvents={communityStats.totalEvents}
          totalParticipants={communityStats.totalParticipants}
          onClose={() => setCommunityOpen(false)}
        />
      )}
    </div>
  );
}