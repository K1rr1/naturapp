import type { Report } from "../types/report.types";

export const reports: Report[] = [
  {
    id: 1,
    lat: 57.7089,
    lng: 11.9746,
    text: "Skräp nära gångvägen.",
    category: "skräp",
    createdBy: "user-456",
    createdAt: new Date().toISOString(),
    status: "öppen",
  },
];