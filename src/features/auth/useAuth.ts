import { useEffect, useState } from "react";
import type { User } from "./auth.types";

const USER_STORAGE_KEY = "naturapp-user";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [hasLoadedUser, setHasLoadedUser] = useState(false);

  // 🔹 Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
    }

    setHasLoadedUser(true);
  }, []);

  // 🔹 Save user when it changes
  useEffect(() => {
    if (!hasLoadedUser) return;

    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser, hasLoadedUser]);

  const login = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    setCurrentUser({
      mode: "user",
      name: trimmedName,
    });

    setNameInput("");
  };

  const continueAsGuest = () => {
    setCurrentUser({
      mode: "guest",
      name: "Gäst",
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return {
    currentUser,
    nameInput,
    setNameInput,
    login,
    continueAsGuest,
    logout,
    hasLoadedUser,
  };
}