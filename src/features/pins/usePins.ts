import type { Pin, PinCategory } from "./pins.types";

type UsePinsParams = {
  currentUserName: string;
  pendingPosition: [number, number] | null;
  textInput: string;
  selectedCategory: PinCategory;
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
  setPendingPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
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

  return {
    handleAddPin,
    handleCleanPin,
  };
}