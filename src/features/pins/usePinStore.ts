import { useEffect, useState } from "react";
import type { Pin } from "./pins.types";
import { loadPins, savePins } from "./pins.storage";

export function usePinStore() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [hasLoadedPins, setHasLoadedPins] = useState(false);

  useEffect(() => {
    const savedPins = loadPins();

    if (savedPins.length > 0) {
      setPins(savedPins);
    } else {
      const defaultPins: Pin[] = [
        {
          id: 1,
          lat: 57.7089,
          lng: 11.9746,
          text: "Exempel: skräp hittat här",
          category: "skräp",
          createdBy: "System",
        },
      ];

      setPins(defaultPins);
    }

    setHasLoadedPins(true);
  }, []);

  // 🔹 spara automatiskt när pins ändras
  useEffect(() => {
    if (hasLoadedPins) {
      savePins(pins);
    }
  }, [pins, hasLoadedPins]);

  return {
    pins,
    setPins,
    hasLoadedPins,
  };
}















/*   useEffect(() => {
    const savedPins = loadPins();

    if (savedPins.length > 0) {
      setPins(savedPins);
    } else {
      const defaultPins: Pin[] = [
        {
          id: 1,
          lat: 57.7089,
          lng: 11.9746,
          text: "Exempel: skräp hittat här",
          category: "skräp",
          createdBy: "System",
        },
      ];

      setPins(defaultPins);
    }

    setHasLoadedPins(true);
  }, []); */