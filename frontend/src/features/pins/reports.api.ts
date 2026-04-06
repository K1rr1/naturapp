import type { PinCategory } from "./pins.types";

const API_URL = import.meta.env.VITE_API_URL;

export type BackendReport = {
  id: number;
  lat: number;
  lng: number;
  text: string;
  category: PinCategory;
  createdBy: string;
  createdAt: string;
  status: "öppen" | "åtgärdad";
};

type CreateReportInput = {
  lat: number;
  lng: number;
  text: string;
  category: PinCategory;
};

function getToken() {
  return localStorage.getItem("naturapp-token");
}

export async function getReports(): Promise<BackendReport[]> {
  const response = await fetch(`${API_URL}/reports`);

  if (!response.ok) {
    throw new Error("Kunde inte hämta rapporter från backend.");
  }

  return response.json();
}

export async function createReport(
  input: CreateReportInput
): Promise<BackendReport> {
  const token = getToken();

  if (!token) {
    throw new Error("Du måste vara inloggad för att skapa en rapport.");
  }

  const response = await fetch(`${API_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Kunde inte skapa rapport.");
  }

  return data;
}

export async function updateReportStatus(
  reportId: number,
  status: "öppen" | "åtgärdad"
): Promise<BackendReport> {
  const token = getToken();

  if (!token) {
    throw new Error("Du måste vara inloggad för att ändra rapportstatus.");
  }

  const response = await fetch(`${API_URL}/reports/${reportId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Kunde inte uppdatera rapportstatus.");
  }

  return data;
}