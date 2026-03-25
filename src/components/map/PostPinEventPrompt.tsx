import { useState } from "react";

type PostPinEventPromptProps = {
  pinText: string;
  dontShowAgain: boolean;
  onDontShowAgainChange: (checked: boolean) => void;
  onClose: () => void;
  onCreateEvent: (eventData: { date: string; time: string; note: string }) => void;
};

export default function PostPinEventPrompt({
  pinText,
  dontShowAgain,
  onDontShowAgainChange,
  onClose,
  onCreateEvent,
}: PostPinEventPromptProps) {
  const [showEventForm, setShowEventForm] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  const handleSave = () => {
    if (!dateInput || !timeInput) return;

    onCreateEvent({
      date: dateInput,
      time: timeInput,
      note: noteInput,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-1110 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="fixed left-3 right-3 top-1/2 z-1120 -translate-y-1/2 rounded-4xl bg-white p-5 shadow-2xl">
        {!showEventForm ? (
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
                Rapport skapad
              </p>
              <h3 className="mt-1 text-lg font-semibold text-stone-900">
                Vill du skapa ett städevent nu?
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                Rapport: <span className="font-medium">{pinText}</span>
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => onDontShowAgainChange(e.target.checked)}
              />
              Visa inte detta meddelande igen
            </label>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowEventForm(true)}
                className="w-full rounded-2xl bg-green-700 py-3 text-sm font-medium text-white transition hover:bg-green-800"
              >
                Skapa event nu
              </button>

              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-stone-200 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
              >
                Inte nu
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
                Städevent
              </p>
              <h3 className="mt-1 text-lg font-semibold text-stone-900">
                Skapa event för rapporten
              </h3>
            </div>

            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white"
            />

            <input
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white"
            />

            <input
              type="text"
              placeholder="Anteckning, t.ex. ta med handskar"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white"
            />

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSave}
                className="w-full rounded-2xl bg-green-700 py-3 text-sm font-medium text-white transition hover:bg-green-800"
              >
                Spara event
              </button>

              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-stone-200 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
              >
                Avbryt
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}