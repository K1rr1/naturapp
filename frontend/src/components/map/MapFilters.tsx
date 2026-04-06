import type {
  CategoryFilter,
  OwnerFilter,
  EventFilter,
} from "../../features/pins/pins.types";

type MapFiltersProps = {
  categoryFilter: CategoryFilter;
  ownerFilter: OwnerFilter;
  eventFilter: EventFilter;
  isOpen: boolean;
  onToggleOpen: () => void;
  setCategoryFilter: (value: CategoryFilter) => void;
  setOwnerFilter: (value: OwnerFilter) => void;
  setEventFilter: (value: EventFilter) => void;
  onReset: () => void;
};

export default function MapFilters({
  categoryFilter,
  ownerFilter,
  eventFilter,
  isOpen,
  onToggleOpen,
  setCategoryFilter,
  setOwnerFilter,
  setEventFilter,
  onReset,
}: MapFiltersProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-1/2 top-50 z-1000 w-[90%] max-w-sm -translate-x-1/2">
      <div className="rounded-2rem border border-black/5 p-5 shadow-2xl backdrop-blur-md">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
              Karta
            </p>
            <h2 className="mt-1 text-xl font-semibold text-stone-900">
              Filter
            </h2>
          </div>

          <button
            onClick={onToggleOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition hover:bg-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-800 outline-none transition focus:border-green-600 focus:bg-white"
          >
            <option value="alla">Alla kategorier</option>
            <option value="skräp">Skräp</option>
            <option value="farligt">Farligt</option>
            <option value="naturvård">Naturvård</option>
          </select>

          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value as EventFilter)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-800 outline-none transition focus:border-green-600 focus:bg-white"
          >
            <option value="alla">Alla eventlägen</option>
            <option value="medEvent">Endast event</option>
            <option value="utanEvent">Utan event</option>
            <option value="deltar">Jag deltar</option>
          </select>

          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value as OwnerFilter)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-800 outline-none transition focus:border-green-600 focus:bg-white"
          >
            <option value="alla">Alla rapporter</option>
            <option value="mina">Mina rapporter</option>
            <option value="andras">Andras rapporter</option>
          </select>

          <button
            onClick={onReset}
            className="mt-2 w-full rounded-2xl bg-stone-200 py-4 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
          >
            Återställ filter
          </button>
        </div>
      </div>
    </div>
  );
}