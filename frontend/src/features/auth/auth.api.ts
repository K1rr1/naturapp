import type { LoginCredentials, LoginResponse } from "./auth.types";

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