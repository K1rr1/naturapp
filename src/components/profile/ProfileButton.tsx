type ProfileButtonProps = {
  name: string;
  onOpenProfile: () => void;
};

export default function ProfileButton({
  name,
  onOpenProfile,
}: ProfileButtonProps) {
  return (
    <button
      onClick={onOpenProfile}
      className="absolute top-3 right-3 z-1100 flex items-center gap-2 rounded-full border border-black/5 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm transition hover:bg-white"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm">
        👤
      </span>

      <span className="max-w-22.5 truncate text-sm font-medium text-stone-800">
        {name}
      </span>
    </button>
  );
}