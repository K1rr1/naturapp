type MapActionBarProps = {
  onOpenNotifications: () => void;
  onOpenCommunity: () => void;
  onOpenFilters: () => void;
};

export default function MapActionBar({
  onOpenNotifications,
  onOpenCommunity,
  onOpenFilters,
}: MapActionBarProps) {
  return (
    <div className="pointer-events-none absolute right-4 top-1/2 z-1105 -translate-y-1/2">
      <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-3xl bg-[#f4f3df]/95 shadow-lg backdrop-blur-sm">
        <button
          onClick={onOpenNotifications}
          className="flex min-w-1  flex-col items-center rounded-full px-2 py-2 text-black transition hover:bg-white/10"
        >
          <span className="text-lg">🔔</span>
          <span className="text-[11px] font-medium">Notiser</span>
        </button>

        <button
          onClick={onOpenCommunity}
          className="flex min-w-1 flex-col items-center rounded-full px-2 py-2 text-black transition hover:bg-white/10"
        >
          <span className="text-lg">📰</span>
          <span className="text-[11px] font-medium">Flöde</span>
        </button>

        <button
          onClick={onOpenFilters}
          className="flex min-w-1 flex-col items-center rounded-full px-2 py-2 text-black transition hover:bg-white/10"
        >
          <span className="text-lg">🗺️</span>
          <span className="text-[11px] font-medium">Filter</span>
        </button>
      </div>
    </div>
  );
}