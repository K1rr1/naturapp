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
  const handleAddPin = (): Pin | null => {
    if (!pendingPosition) return null;

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

    return newPin;
  };

  const handleCleanPin = (id: number) => {
    setPins((prev) => prev.filter((pin) => pin.id !== id));
  };

  const handleCreateEvent = (
    pinId: number,
    cleanupEvent: Omit<CleanupEvent, "participants">
  ) => {
    setPins((prev) =>
      prev.map((pin) =>
        pin.id === pinId
          ? {
              ...pin,
              cleanupEvent: {
                ...cleanupEvent,
                participants: [],
              },
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

  const handleJoinEvent = (pinId: number) => {
    setPins((prev) =>
      prev.map((pin) => {
        if (pin.id !== pinId || !pin.cleanupEvent) return pin;

        const participants = pin.cleanupEvent.participants || [];
        const alreadyJoined = participants.includes(currentUserName);

        if (alreadyJoined) return pin;

        return {
          ...pin,
          cleanupEvent: {
            ...pin.cleanupEvent,
            participants: [...participants, currentUserName],
          },
        };
      })
    );
  };

  const handleLeaveEvent = (pinId: number) => {
    setPins((prev) =>
      prev.map((pin) => {
        if (pin.id !== pinId || !pin.cleanupEvent) return pin;

        const participants = pin.cleanupEvent.participants || [];

        return {
          ...pin,
          cleanupEvent: {
            ...pin.cleanupEvent,
            participants: participants.filter(
              (participant) => participant !== currentUserName
            ),
          },
        };
      })
    );
  };

  return {
    handleAddPin,
    handleCleanPin,
    handleCreateEvent,
    handleRemoveEvent,
    handleJoinEvent,
    handleLeaveEvent,
  };
}