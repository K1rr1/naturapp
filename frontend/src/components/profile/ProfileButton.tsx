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
      className="absolute right-0 top-4 z-[1001] flex items-center gap-2 rounded-l-full bg-[#f4f3df]/95 pl-4 pr-3 py-3 shadow-lg backdrop-blur-sm transition hover:bg-[#f0efd8]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 text-sm">
        👤
      </div>
      <span className="max-w-[7rem] truncate text-sm font-medium text-stone-800">
        {name}
      </span>
    </button>
  );
}