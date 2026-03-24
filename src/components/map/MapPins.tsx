import { useState } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import type {
  Pin,
  PinCategory,
  CleanupEvent,
} from "../../features/pins/pins.types";
import PinEventForm from "./PinEventForm";

type Props = {
  pins: Pin[];
  currentUserName: string;
  onCleanPin: (id: number) => void;
  onCreateEvent: (
    pinId: number,
    cleanupEvent: Omit<CleanupEvent, "participants">
  ) => void;
  onRemoveEvent: (pinId: number) => void;
  onJoinEvent: (pinId: number) => void;
  onLeaveEvent: (pinId: number) => void;
};

export default function MapPins({
  pins,
  currentUserName,
  onCleanPin,
  onCreateEvent,
  onRemoveEvent,
  onJoinEvent,
  onLeaveEvent,
}: Props) {
  const [eventPinId, setEventPinId] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  const getMarkerColor = (category: PinCategory) => {
    switch (category) {
      case "skräp":
        return "#2e7d32";
      case "trasigt":
        return "#d84315";
      case "belysning":
        return "#f9a825";
      case "övrigt":
        return "#616161";
      default:
        return "#1976d2";
    }
  };

  const resetEventForm = () => {
    setEventPinId(null);
    setDateInput("");
    setTimeInput("");
    setNoteInput("");
  };

  const handleSaveEvent = (pinId: number) => {
    if (!dateInput || !timeInput) return;

    onCreateEvent(pinId, {
      date: dateInput,
      time: timeInput,
      note: noteInput,
    });

    resetEventForm();
  };

  return (
    <>
      {pins.map((pin) => {
        const isOwner = pin.createdBy === currentUserName;
        const markerColor = getMarkerColor(pin.category);
        const isEditingEvent = eventPinId === pin.id;
        const hasEvent = !!pin.cleanupEvent;
        const participants = pin.cleanupEvent?.participants || [];
        const isParticipant = participants.includes(currentUserName);

        return (
          <CircleMarker
            key={pin.id}
            center={[pin.lat, pin.lng]}
            radius={10}
            pathOptions={{
              color: markerColor,
              fillColor: markerColor,
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <div className="min-w-[240px] space-y-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
                    Rapport
                  </p>
                  <h4 className="text-base font-semibold text-stone-900">
                    {pin.category}
                  </h4>
                </div>

                <div className="space-y-1 text-sm text-stone-800">
                  <p>
                    <span className="font-medium">Beskrivning:</span> {pin.text}
                  </p>
                  <p>
                    <span className="font-medium">Rapporterad av:</span>{" "}
                    {pin.createdBy}
                  </p>
                </div>

                {pin.cleanupEvent && (
                  <div className="rounded-2xl bg-green-50 p-3">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
                      Städevent
                    </p>
                    <p className="text-sm text-stone-900">
                      <span className="font-medium">Datum:</span>{" "}
                      {pin.cleanupEvent.date}
                    </p>
                    <p className="text-sm text-stone-900">
                      <span className="font-medium">Tid:</span>{" "}
                      {pin.cleanupEvent.time}
                    </p>
                    {pin.cleanupEvent.note && (
                      <p className="text-sm text-stone-900">
                        <span className="font-medium">Info:</span>{" "}
                        {pin.cleanupEvent.note}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-stone-900">
                      <span className="font-medium">Deltagare:</span>{" "}
                      {participants.length}
                    </p>
                  </div>
                )}

                {isOwner ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => onCleanPin(pin.id)}
                      className="w-full rounded-2xl bg-green-700 py-3 text-sm font-medium text-white transition hover:bg-green-800"
                    >
                      Städat
                    </button>

                    {!pin.cleanupEvent && !isEditingEvent && (
                      <button
                        onClick={() => setEventPinId(pin.id)}
                        className="w-full rounded-2xl bg-stone-200 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
                      >
                        Skapa event
                      </button>
                    )}

                    {pin.cleanupEvent && (
                      <button
                        onClick={() => onRemoveEvent(pin.id)}
                        className="w-full rounded-2xl bg-red-500 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Ta bort event
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-amber-700">
                      Bara skaparen kan markera denna som städad eller hantera
                      event.
                    </p>

                    {pin.cleanupEvent && !isParticipant && (
                      <button
                        onClick={() => onJoinEvent(pin.id)}
                        className="w-full rounded-2xl bg-blue-500 py-3 text-sm font-medium text-white transition hover:bg-blue-600"
                      >
                        Delta i event
                      </button>
                    )}

                    {pin.cleanupEvent && isParticipant && (
                      <button
                        onClick={() => onLeaveEvent(pin.id)}
                        className="w-full rounded-2xl bg-stone-200 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
                      >
                        Lämna event
                      </button>
                    )}
                  </div>
                )}

                {isOwner && isEditingEvent && (
                  <PinEventForm
                    dateInput={dateInput}
                    timeInput={timeInput}
                    noteInput={noteInput}
                    onDateChange={setDateInput}
                    onTimeChange={setTimeInput}
                    onNoteChange={setNoteInput}
                    onSave={() => handleSaveEvent(pin.id)}
                    onCancel={resetEventForm}
                  />
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}