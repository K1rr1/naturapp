import { useEffect, useState } from "react";
import type { User } from "./auth.types";
import { loginUser } from "./auth.api";


const USER_STORAGE_KEY = "naturapp-user";
const TOKEN_STORAGE_KEY = "naturapp-token";


export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [hasLoadedUser, setHasLoadedUser] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

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
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [currentUser, hasLoadedUser]);

  const login = async () => {
    const trimmedUsername = usernameInput.trim();
    const trimmedPassword = passwordInput.trim();


    if (!trimmedUsername || !trimmedPassword) {
      setAuthError("Användarnamn och lösenord får inte vara tomma.");

    return;
  }

  try {
      setIsAuthLoading(true);
      setAuthError("");

      const response = await loginUser({
        username: trimmedUsername,
        password: trimmedPassword,
      });

      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      setCurrentUser(response.user);

      setUsernameInput("");
      setPasswordInput("");
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Ett okänt fel inträffade.");
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const continueAsGuest = () => {
    setAuthError("");
    setCurrentUser({
      id: "guest-user",
      username: "guest",
      name: "Gäst",
      mode: "guest",
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthError("");
    setUsernameInput("");
    setPasswordInput("");
  };

  return {

    currentUser,
    usernameInput,
    passwordInput,
    setUsernameInput,
    setPasswordInput,
    login,
    continueAsGuest,
    logout,
    hasLoadedUser,
    isAuthLoading,
    authError,
  };
}
    