import { useEffect, useState } from "react";
import type { User } from "./auth.types";
import { loginUser, registerUser } from "./auth.api";

const USER_STORAGE_KEY = "naturapp-user";
const TOKEN_STORAGE_KEY = "naturapp-token";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [hasLoadedUser, setHasLoadedUser] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

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
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [currentUser, hasLoadedUser]);

  const login = async () => {
    const trimmedUsername = usernameInput.trim();
    const trimmedPassword = passwordInput.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setAuthError("Fyll i både användarnamn och lösenord.");
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
      setNameInput("");
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Något gick fel vid inloggning.");
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async () => {
    const trimmedName = nameInput.trim();
    const trimmedUsername = usernameInput.trim();
    const trimmedPassword = passwordInput.trim();

    if (!trimmedName || !trimmedUsername || !trimmedPassword) {
      setAuthError("Fyll i namn, användarnamn och lösenord.");
      return;
    }

    try {
      setIsAuthLoading(true);
      setAuthError("");

      const response = await registerUser({
        name: trimmedName,
        username: trimmedUsername,
        password: trimmedPassword,
      });

      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      setCurrentUser(response.user);

      setNameInput("");
      setUsernameInput("");
      setPasswordInput("");
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Något gick fel vid registrering.");
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
    setNameInput("");
    setUsernameInput("");
    setPasswordInput("");
  };

  return {
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
  };
}