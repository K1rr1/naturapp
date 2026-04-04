import type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
} from "./auth.types";

const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Fel vid inloggning.");
  }

  return response.json();
}

export async function registerUser(
  data: RegisterData
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Fel vid registrering.");
  }

  return response.json();
}