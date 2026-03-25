import type {
  CategoryFilter,
  OwnerFilter,
  EventFilter,
} from "../../features/pins/pins.types";

type Props = {
  categoryFilter: CategoryFilter;
  ownerFilter: OwnerFilter;
  eventFilter: EventFilter;
  setCategoryFilter: (value: CategoryFilter) => void;
  setOwnerFilter: (value: OwnerFilter) => void;
  setEventFilter: (value: EventFilter) => void;
  onReset: () => void;
};

export default function MapFilters({
  categoryFilter,
  ownerFilter,
  eventFilter,
  setCategoryFilter,
  setOwnerFilter,
  setEventFilter,
  onReset,
}: Props) {
  const hasActiveFilters =
    categoryFilter !== "alla" ||
    ownerFilter !== "alla" ||
    eventFilter !== "alla";

  return (
    <div className="absolute top-3 left-3 z-[1000] w-[19rem] max-w-[calc(100%-5.5rem)] rounded-3xl border border-black/5 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
      <div className="mb-3">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
          Karta
        </p>
        <h2 className="text-base font-semibold text-stone-900">Filter</h2>
      </div>

      {hasActiveFilters && (
        <div className="mb-3 rounded-2xl bg-green-50 px-3 py-2">
          <p className="text-xs font-medium text-green-800">
            Filter är aktiva
          </p>
        </div>
      )}

      <div className="space-y-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-600 focus:bg-white"
        >
          <option value="alla">Alla kategorier</option>
          <option value="skräp">🗑️ Skräp</option>
          <option value="trasigt">🔧 Trasigt</option>
          <option value="belysning">💡 Belysning</option>
          <option value="övrigt">📦 Övrigt</option>
        </select>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value as EventFilter)}
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-600 focus:bg-white"
        >
          <option value="alla">Alla eventlägen</option>
          <option value="medEvent">📅 Endast event</option>
        </select>

        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value as OwnerFilter)}
          className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-green-600 focus:bg-white"
        >
          <option value="alla">Alla rapporter</option>
          <option value="mina">👤 Mina</option>
          <option value="andras">🌍 Andras</option>
        </select>

        <button
          onClick={onReset}
          className="w-full rounded-2xl bg-stone-200 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
        >
          Återställ filter
        </button>
      </div>
    </div>
  );
}