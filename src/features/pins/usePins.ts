import type { Dispatch, SetStateAction } from "react";
import type { Pin, PinCategory, CleanupEvent } from "./pins.types";

type UsePinsParams = {
  currentUserName: string;
  pendingPosition: [number, number] | null;
  textInput: string;
  selectedCategory: PinCategory;
  setPins: Dispatch<SetStateAction<Pin[]>>;
  setPendingPosition: Dispatch<SetStateAction<[number, number] | null>>;
  setTextInput: Dispatch<SetStateAction<string>>;
  setSelectedCategory: Dispatch<SetStateAction<PinCategory>>;
};

export function usePins({
  currentUserName,
  pendingPosition,
  textInput,
  selectedCategory,
  setPins,
  setPendingPosition,
  setTextInput,
  setSelectedCategory,
}: UsePinsParams) {
  const handleAddPin = () => {
    if (!pendingPosition) return;

    const newPin: Pin = {
      id: Date.now(),
      lat: pendingPosition[0],
      lng: pendingPosition[1],
      text: textInput || "Ingen beskrivning",
      category: selectedCategory,
      createdBy: currentUserName,
    };

    setPins((prev) => [...prev, newPin]);
    setPendingPosition(null);
    setTextInput("");
    setSelectedCategory("skräp");
  };

  const handleCleanPin = (id: number) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
  };

  const handleCreateEvent = (pinId: number, cleanupEvent: CleanupEvent) => {
    setPins((prev) =>
      prev.map((pin) =>
        pin.id === pinId
          ? {
              ...pin,
              cleanupEvent,
            }
          : pin
      )
    );
  };

  const handleRemoveEvent = (pinId: number) => {
    setPins((prev) =>
      prev.map((pin) =>
        pin.id === pinId
          ? {
              ...pin,
              cleanupEvent: undefined,
            }
          : pin
      )
    );
  };

  return {
    handleAddPin,
    handleCleanPin,
    handleCreateEvent,
    handleRemoveEvent,
  };
}