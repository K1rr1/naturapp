import type { Pin, PinCategory, CleanupEvent } from "./pins.types";
import { createReport, updateReportStatus } from "./reports.api";

type UsePinsParams = {
  currentUserName: string;
  pendingPosition: [number, number] | null;
  textInput: string;
  selectedCategory: PinCategory;
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
  setPendingPosition: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
  setTextInput: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<PinCategory>>;
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
  const handleAddPin = async (): Promise<Pin | null> => {
    if (!pendingPosition || !textInput.trim()) return null;

    const createdReport = await createReport({
      lat: pendingPosition[0],
      lng: pendingPosition[1],
      text: textInput.trim(),
      category: selectedCategory,
    });

    const newPin: Pin = {
      id: createdReport.id,
      lat: createdReport.lat,
      lng: createdReport.lng,
      text: createdReport.text,
      category: createdReport.category,
      createdBy: createdReport.createdBy,
      createdAt: createdReport.createdAt,
      status: createdReport.status,
    };

    setPins((prev) => [newPin, ...prev.filter((pin) => pin.id !== newPin.id)]);

    setPendingPosition(null);
    setTextInput("");
    setSelectedCategory("skräp");

    return newPin;
  };

  const handleCleanPin = async (pinId: number) => {
    const updatedReport = await updateReportStatus(pinId, "åtgärdad");

    setPins((prev) =>
      prev.map((pin) =>
        pin.id === pinId
          ? {
              ...pin,
              status: updatedReport.status,
            }
          : pin
      )
    );
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
        if (pin.cleanupEvent.participants.includes(currentUserName)) return pin;

        return {
          ...pin,
          cleanupEvent: {
            ...pin.cleanupEvent,
            participants: [...pin.cleanupEvent.participants, currentUserName],
          },
        };
      })
    );
  };

  const handleLeaveEvent = (pinId: number) => {
    setPins((prev) =>
      prev.map((pin) => {
        if (pin.id !== pinId || !pin.cleanupEvent) return pin;

        return {
          ...pin,
          cleanupEvent: {
            ...pin.cleanupEvent,
            participants: pin.cleanupEvent.participants.filter(
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