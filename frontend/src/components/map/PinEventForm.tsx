type PinEventFormProps = {
  dateInput: string;
  timeInput: string;
  noteInput: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function PinEventForm({
  dateInput,
  timeInput,
  noteInput,
  onDateChange,
  onTimeChange,
  onNoteChange,
  onSave,
  onCancel,
}: PinEventFormProps) {
  return (
    <div className="mt-3 space-y-3 rounded-2xl bg-stone-50 p-3">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
          Städevent
        </p>
        <h4 className="text-sm font-semibold text-stone-900">
          Skapa event
        </h4>
      </div>

      <input
        type="date"
        value={dateInput}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600"
      />

      <input
        type="time"
        value={timeInput}
        onChange={(e) => onTimeChange(e.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600"
      />

      <input
        type="text"
        placeholder="Anteckning, t.ex. ta med handskar"
        value={noteInput}
        onChange={(e) => onNoteChange(e.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600"
      />

      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 rounded-2xl bg-green-700 py-3 text-sm font-medium text-white transition hover:bg-green-800"
        >
          Spara event
        </button>

        <button
          onClick={onCancel}
          className="flex-1 rounded-2xl bg-stone-200 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}