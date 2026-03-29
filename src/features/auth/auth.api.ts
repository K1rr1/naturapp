import type { LoginCredentials, LoginResponse } from "./auth.types";

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (
    credentials.username === "user-456" &&
    credentials.password === "mypassword123"
  ) {
    return {
      token: "mock-jwt-token-123",
      user: {
        id: "user-456",
        username: "user-456",
        name: "Testanvändare",
        mode: "user",
      },
    };
  }

  throw new Error("Fel användarnamn eller lösenord.");
}