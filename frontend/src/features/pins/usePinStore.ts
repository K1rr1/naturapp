import { useEffect, useState } from "react";
import type { Pin } from "./pins.types";
import { getReports } from "./reports.api";

const PINS_STORAGE_KEY = "naturapp-pins";

export function usePinStore() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [hasLoadedPins, setHasLoadedPins] = useState(false);

  useEffect(() => {
    const loadPins = async () => {
      const savedPins = localStorage.getItem(PINS_STORAGE_KEY);
      const localPins: Pin[] = savedPins ? JSON.parse(savedPins) : [];

      try {
        const backendReports = await getReports();
        console.log("Hämtade rapporter från backend:", backendReports);

        const backendPins: Pin[] = backendReports.map((report) => {
          const matchingLocalPin = localPins.find((pin) => pin.id === report.id);

          return {
            id: report.id,
            lat: report.lat,
            lng: report.lng,
            text: report.text,
            category: report.category,
            createdBy: report.createdBy,
            createdAt: report.createdAt,
            status: report.status,
            cleanupEvent: matchingLocalPin?.cleanupEvent,
          };
        });

        const localOnlyPins = localPins.filter(
          (localPin) =>
            !backendPins.some((backendPin) => backendPin.id === localPin.id)
        );

        setPins([...backendPins, ...localOnlyPins]);
      } catch (error) {
        console.error("Kunde inte hämta backend-rapporter, använder lokal data:", error);
        setPins(localPins);
      } finally {
        setHasLoadedPins(true);
      }
    };

    loadPins();
  }, []);

  useEffect(() => {
    if (!hasLoadedPins) return;
    localStorage.setItem(PINS_STORAGE_KEY, JSON.stringify(pins));
  }, [pins, hasLoadedPins]);

  return {
    pins,
    setPins,
    hasLoadedPins,
  };
}