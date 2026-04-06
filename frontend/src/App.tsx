import { useEffect, useState } from "react";
import MapView from "./components/map/MapView";
import StartScreen from "./components/auth/StartScreen";
import ProfileButton from "./components/profile/ProfileButton";
import ProfilePanel from "./components/profile/ProfilePanel";
import SplashScreen from "./components/ui/SplashScreen";
import Onboarding from "./components/ui/Onboarding";
import NotificationsPanel from "./components/notifications/NotificationsPanel";
import CommunityFeed from "./features/community/CommunityFeed";
import MapActionBar from "./components/layout/MapActionBar";

import { useAuth } from "./features/auth/useAuth";
import { usePinStore } from "./features/pins/usePinStore";
import { useNotifications } from "./features/notifications/useNotifications";
import { useCommunityFeed } from "./features/community/useCommunityFeed";

const ONBOARDING_STORAGE_KEY = "naturapp-onboarding-done";

export default function App() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    currentUser,
    
    usernameInput,
    passwordInput,
   
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

  const { notifications, markAsRead, markAllAsRead } = useNotifications();
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

  const closeAllPanels = () => {
    setNotificationsOpen(false);
    setCommunityOpen(false);
    setFiltersOpen(false);
  };

  const handleToggleNotifications = () => {
    if (notificationsOpen) {
      setNotificationsOpen(false);
      return;
    }

    setCommunityOpen(false);
    setFiltersOpen(false);
    setNotificationsOpen(true);
  };

  const handleToggleCommunity = () => {
    if (communityOpen) {
      setCommunityOpen(false);
      return;
    }

    setNotificationsOpen(false);
    setFiltersOpen(false);
    setCommunityOpen(true);
  };

  const handleToggleFilters = () => {
    if (filtersOpen) {
      setFiltersOpen(false);
      return;
    }

    setNotificationsOpen(false);
    setCommunityOpen(false);
    setFiltersOpen(true);
  };

  const handleOpenProfile = () => {
    closeAllPanels();
    setProfileOpen(true);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    closeAllPanels();
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
    return <Onboarding onFinish={() => setShowOnboarding(false)} />;
  }

  if (!currentUser) {
    return (
      <StartScreen
        
        usernameInput={usernameInput}
        passwordInput={passwordInput}
        authError={authError}
        isAuthLoading={isAuthLoading}
        authMode={authMode}
        
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
    <div className="relative h-screen w-full overflow-hidden">
      <MapView
        currentUserName={currentUser.name}
        currentUsername={currentUser.username}
        pins={pins}
        setPins={setPins}
        filtersOpen={filtersOpen}
        onCloseFilters={() => setFiltersOpen(false)}
        onToggleFilters={handleToggleFilters}
      />

      {!profileOpen && (
        <>
          <ProfileButton
            name={currentUser.name}
            onOpenProfile={handleOpenProfile}
          />

          <MapActionBar
            onOpenNotifications={handleToggleNotifications}
            onOpenCommunity={handleToggleCommunity}
            onOpenFilters={handleToggleFilters}
          />
        </>
      )}

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

