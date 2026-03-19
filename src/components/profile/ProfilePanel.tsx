import type { Pin } from "../../features/pins/pins.types";

type ProfilePanelProps = {
  name: string;
  mode: "guest" | "user";
  pins: Pin[];
  onClose: () => void;
  onLogout: () => void;
};

export default function ProfilePanel({
  name,
  mode,
  pins,
  onClose,
  onLogout,
}: ProfilePanelProps) {
  const userPins = pins.filter((pin) => pin.createdBy === name);

  return (
    <div className="absolute top-16 right-3 z-1100 w-64 rounded-3xl border border-black/5 bg-white/95 p-5 shadow-2xl backdrop-blur-sm">
      <div className="mb-4">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
          Profil
        </p>

        <h3 className="text-lg font-semibold text-stone-900">{name}</h3>
      </div>

      <div className="mb-5 space-y-3">
        <div className="rounded-2xl bg-stone-50 px-4 py-3">
          <p className="text-xs text-stone-500">Typ</p>
          <p className="text-sm font-medium text-stone-900">
            {mode === "guest" ? "Gäst" : "Användare"}
          </p>
        </div>

        <div className="rounded-2xl bg-stone-50 px-4 py-3">
          <p className="text-xs text-stone-500">Rapporter skapade</p>
          <p className="text-sm font-medium text-stone-900">
            {userPins.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-stone-200 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
        >
          Stäng
        </button>

        <button
          onClick={onLogout}
          className="w-full rounded-2xl bg-red-500 py-3 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Logga ut
        </button>
      </div>
    </div>
  );
}