import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

import type { CleanupEvent, Pin } from "../../features/pins/pins.types";

type Props = {
  pins: Pin[];
  currentUserName: string;
  recentCreatedPinId: number | null;
  onCleanPin: (id: number) => void;
  onCreateEvent: (
    pinId: number,
    cleanupEvent: Omit<CleanupEvent, "participants">
  ) => void;
  onRemoveEvent: (pinId: number) => void;
  onJoinEvent: (pinId: number) => void;
  onLeaveEvent: (pinId: number) => void;
  onShowToast: (message: string) => void;
};

function getPinColor(category: string) {
  switch (category) {
    case "skräp":
      return "#22c55e";
    case "farligt":
      return "#ef4444";
    case "naturvård":
      return "#3b82f6";
    default:
      return "#6b7280";
  }
}

function getPinGlow(category: string) {
  switch (category) {
    case "skräp":
      return "0 10px 20px rgba(34,197,94,0.35)";
    case "farligt":
      return "0 10px 20px rgba(239,68,68,0.35)";
    case "naturvård":
      return "0 10px 20px rgba(59,130,246,0.35)";
    default:
      return "0 10px 20px rgba(107,114,128,0.35)";
  }
}

function getPinIcon(category: string) {
  switch (category) {
    case "skräp":
      return "🗑️";
    case "farligt":
      return "⚠️";
    case "naturvård":
      return "🌱";
    default:
      return "📍";
  }
}

function createCustomIcon(category: string, isNew: boolean) {
  const color = getPinColor(category);
  const glow = getPinGlow(category);
  const emoji = getPinIcon(category);

  return L.divIcon({
    className: "",
    html: `
      <div style="position: relative; width: 42px; height: 52px; display:flex; align-items:flex-start; justify-content:center;">
        <style>
          @keyframes naturapp-pin-pop {
            0% { transform: translateY(10px) scale(0.5); opacity: 0; }
            60% { transform: translateY(-6px) scale(1.08); opacity: 1; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
          }

          @keyframes naturapp-pin-pulse {
            0% { box-shadow: 0 0 0 0 ${color}55; }
            70% { box-shadow: 0 0 0 14px transparent; }
            100% { box-shadow: 0 0 0 0 transparent; }
          }
        </style>

        <div style="
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          background: ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          border: 3px solid white;
          box-shadow: ${glow};
          ${isNew ? "animation: naturapp-pin-pop 0.45s ease-out, naturapp-pin-pulse 1s ease-out 0.15s 1;" : ""}
        ">
          ${emoji}
        </div>

        <div style="
          position:absolute;
          top:30px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 14px solid ${color};
          filter: drop-shadow(0 3px 4px rgba(0,0,0,0.18));
        "></div>
      </div>
    `,
    iconSize: [42, 52],
    iconAnchor: [21, 50],
    popupAnchor: [0, -44],
  });
}

export default function MapPins({
  pins,
  currentUserName,
  recentCreatedPinId,
  onCleanPin,
  onCreateEvent,
  onRemoveEvent,
  onJoinEvent,
  onLeaveEvent,
  onShowToast,
}: Props) {
  return (
    <>
      {pins.map((pin) => {
        const hasEvent = !!pin.cleanupEvent;
        const participants = pin.cleanupEvent?.participants || [];
        const userHasJoined = participants.includes(currentUserName);

        return (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={createCustomIcon(pin.category, recentCreatedPinId === pin.id)}
          >
            <Popup>
              <div className="min-w-[220px] space-y-2">
                <h3 className="text-base font-semibold text-stone-900">
                  {pin.text}
                </h3>

                <div className="space-y-1 text-sm text-stone-600">
                  <p>
                    <span className="font-medium text-stone-800">Kategori:</span>{" "}
                    {pin.category}
                  </p>
                  <p>
                    <span className="font-medium text-stone-800">Skapad av:</span>{" "}
                    {pin.createdBy}
                  </p>
                  {"createdAt" in pin && pin.createdAt && (
                    <p>
                      <span className="font-medium text-stone-800">Tid:</span>{" "}
                      {new Date(pin.createdAt).toLocaleString("sv-SE")}
                    </p>
                  )}
                  {"status" in pin && pin.status && (
                    <p>
                      <span className="font-medium text-stone-800">Status:</span>{" "}
                      {pin.status}
                    </p>
                  )}
                </div>

                {hasEvent && pin.cleanupEvent ? (
                  <div className="rounded-2xl bg-stone-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
                      Event
                    </p>

                    <p className="mt-1 text-sm text-stone-700">
                      {pin.cleanupEvent.date} kl. {pin.cleanupEvent.time}
                    </p>

                    {pin.cleanupEvent.note && (
                      <p className="mt-1 text-sm text-stone-600">
                        {pin.cleanupEvent.note}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-stone-500">
                      Deltagare: {participants.length}
                    </p>

                    {userHasJoined ? (
                      <button
                        onClick={() => {
                          onLeaveEvent(pin.id);
                          onShowToast("Du lämnade eventet.");
                        }}
                        className="mt-3 w-full rounded-xl bg-stone-200 px-3 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
                      >
                        Lämna event
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onJoinEvent(pin.id);
                          onShowToast("Du gick med i eventet.");
                        }}
                        className="mt-3 w-full rounded-xl bg-green-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                      >
                        Gå med i event
                      </button>
                    )}

                    {pin.createdBy === currentUserName && (
                      <button
                        onClick={() => {
                          onRemoveEvent(pin.id);
                          onShowToast("Event borttaget.");
                        }}
                        className="mt-2 w-full rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
                      >
                        Ta bort event
                      </button>
                    )}
                  </div>
                ) : pin.createdBy === currentUserName ? (
                  <button
                    onClick={() =>
                      onCreateEvent(pin.id, {
                        date: new Date().toISOString().split("T")[0],
                        time: "10:00",
                        note: `Städinsats för: ${pin.text}`,
                      })
                    }
                    className="w-full rounded-xl bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-200"
                  >
                    Skapa event
                  </button>
                ) : (
                  <div className="rounded-xl bg-stone-100 px-3 py-2 text-sm font-medium text-red-800">
                    bara skaparen av rapporten kan skapa eller ändra event för denna plats
                  </div>
                )}
                

                {pin.createdBy === currentUserName && (
                  <button
                    onClick={() => {
                      onCleanPin(pin.id);
                      onShowToast("Rapport markerad som åtgärdad.");
                    }}
                    className="w-full rounded-xl bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                  >
                    Markera som åtgärdad
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}