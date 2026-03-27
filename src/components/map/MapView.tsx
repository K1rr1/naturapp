import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";

import MapFilters from "./MapFilters";
import MapPins from "./MapPins";
import AddPinForm from "./AddPinForm";
import PostPinEventPrompt from "./PostPinEventPrompt";

import type {
  Pin,
  PinCategory,
  CategoryFilter,
  OwnerFilter,
  EventFilter,
} from "../../features/pins/pins.types";

import { usePins } from "../../features/pins/usePins";
import { useFilters } from "../../features/pins/useFilters";

type MapViewProps = {
  currentUserName: string;
  pins: Pin[];
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
};

const HIDE_EVENT_PROMPT_KEY = "naturapp-hide-event-prompt";

export default function MapView({
  currentUserName,
  pins,
  setPins,
}: MapViewProps) {
  const [pendingPosition, setPendingPosition] = useState<[number, number] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PinCategory>("skräp");

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("alla");
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("alla");
  const [eventFilter, setEventFilter] = useState<EventFilter>("alla");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [postPinPrompt, setPostPinPrompt] = useState<{
    pinId: number;
    pinText: string;
  } | null>(null);

  const [dontShowEventPrompt, setDontShowEventPrompt] = useState<boolean>(() => {
    return localStorage.getItem(HIDE_EVENT_PROMPT_KEY) === "true";
  });

  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        setPendingPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return null;
  }

  const {
    handleAddPin,
    handleCleanPin,
    handleCreateEvent,
    handleRemoveEvent,
    handleJoinEvent,
    handleLeaveEvent,
  } = usePins({
    currentUserName,
    pendingPosition,
    textInput,
    selectedCategory,
    setPins,
    setPendingPosition,
    setTextInput,
    setSelectedCategory,
  });

  const { filteredPins } = useFilters({
    pins,
    categoryFilter,
    ownerFilter,
    eventFilter,
    currentUserName,
  });

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const handleResetFilters = () => {
    setCategoryFilter("alla");
    setOwnerFilter("alla");
    setEventFilter("alla");
  };

  const handleAddPinWithPrompt = () => {
    const newPin = handleAddPin();

    if (!newPin) return;

    if (!dontShowEventPrompt) {
      setPostPinPrompt({
        pinId: newPin.id,
        pinText: newPin.text,
      });
    } else {
      setToastMessage("Rapport skapad.");
    }
  };

  const handlePromptCreateEvent = (eventData: {
    date: string;
    time: string;
    note: string;
  }) => {
    if (!postPinPrompt) return;

    handleCreateEvent(postPinPrompt.pinId, eventData);
    setPostPinPrompt(null);
    setToastMessage("Rapport och event skapade.");
  };

  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowEventPrompt(checked);
    localStorage.setItem(HIDE_EVENT_PROMPT_KEY, String(checked));
  };

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={[57.7089, 11.9746]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AddMarkerOnClick />

        <MapPins
          pins={filteredPins}
          currentUserName={currentUserName}
          onCleanPin={handleCleanPin}
          onCreateEvent={handleCreateEvent}
          onRemoveEvent={handleRemoveEvent}
          onJoinEvent={handleJoinEvent}
          onLeaveEvent={handleLeaveEvent}
          onShowToast={setToastMessage}
        />

        {pendingPosition && (
          <AddPinForm
            pendingPosition={pendingPosition}
            textInput={textInput}
            selectedCategory={selectedCategory}
            onTextChange={setTextInput}
            onCategoryChange={setSelectedCategory}
            onAddPin={handleAddPinWithPrompt}
          />
        )}
      </MapContainer>

      <MapFilters
        categoryFilter={categoryFilter}
        ownerFilter={ownerFilter}
        eventFilter={eventFilter}
        isOpen={filtersOpen}
        onToggleOpen={() => setFiltersOpen((prev) => !prev)}
        setCategoryFilter={setCategoryFilter}
        setOwnerFilter={setOwnerFilter}
        setEventFilter={setEventFilter}
        onReset={handleResetFilters}
      />

      {filteredPins.length === 0 && (
        <div className="absolute bottom-5 left-3 right-3 z-[1000] rounded-2xl bg-white/95 p-4 text-center shadow-xl backdrop-blur-sm">
          <p className="text-sm font-medium text-stone-800">
            Inga rapporter matchar filtret.
          </p>
        </div>
      )}

      {toastMessage && (
        <div className="absolute bottom-5 left-3 right-3 z-[1200] rounded-2xl bg-stone-900 px-4 py-3 text-center text-sm font-medium text-white shadow-2xl">
          {toastMessage}
        </div>
      )}

      {postPinPrompt && (
        <PostPinEventPrompt
          pinText={postPinPrompt.pinText}
          dontShowAgain={dontShowEventPrompt}
          onDontShowAgainChange={handleDontShowAgainChange}
          onClose={() => {
            setPostPinPrompt(null);
            setToastMessage("Rapport skapad.");
          }}
          onCreateEvent={handlePromptCreateEvent}
        />
      )}
    </div>
  );
}