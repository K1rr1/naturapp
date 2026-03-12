import type { Pin } from "./pins.types";

const STORAGE_KEY = "naturapp-pins";

export function loadPins(): Pin[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function savePins(pins: Pin[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
}