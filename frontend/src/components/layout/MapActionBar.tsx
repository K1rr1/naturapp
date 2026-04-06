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
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-1105 w-[calc(100%-2rem)] max-w-[24rem] -translate-x-1/2">
      <div className="pointer-events-auto flex items-center justify-between rounded-full bg-stone-900/90 px-3 py-2 shadow-2xl backdrop-blur-md">
        <button
          onClick={onOpenNotifications}
          className="flex min-w-[5.5rem] flex-col items-center rounded-full px-4 py-2 text-white transition hover:bg-white/10"
        >
          <span className="text-lg">🔔</span>
          <span className="text-[11px] font-medium">Notiser</span>
        </button>

        <button
          onClick={onOpenCommunity}
          className="flex min-w-[5.5rem] flex-col items-center rounded-full px-4 py-2 text-white transition hover:bg-white/10"
        >
          <span className="text-lg">📰</span>
          <span className="text-[11px] font-medium">Flöde</span>
        </button>

        <button
          onClick={onOpenFilters}
          className="flex min-w-[5.5rem] flex-col items-center rounded-full px-4 py-2 text-white transition hover:bg-white/10"
        >
          <span className="text-lg">🗺️</span>
          <span className="text-[11px] font-medium">Filter</span>
        </button>
      </div>
    </div>
  );
}