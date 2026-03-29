type StartScreenProps = {
  usernameInput: string;
  passwordInput: string;
  authError: string;
  isAuthLoading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  onContinueAsGuest: () => void;
};


export default function StartScreen({
  usernameInput,
  passwordInput,
  authError,
  isAuthLoading,
  onUsernameChange,
  onPasswordChange,
  onLogin,
  onContinueAsGuest,
}: StartScreenProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-stone-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white/95 shadow-2xl border border-black/5 p-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700 mb-2">
            Naturappen
          </p>

          <h1 className="text-3xl font-bold leading-tight text-stone-900 mb-3">
            Hjälp till att hålla naturen ren
          </h1>

          <p className="text-sm text-stone-600 leading-6">
            Rapportera skräp, trasiga saker och problem direkt på kartan.
            Logga in med namn eller fortsätt som gäst.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Användarnamn"
            value={usernameInput}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white"
          />
          <input
            type="password"
            placeholder="lösenord"
            value={passwordInput}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white"
          />

            {authError && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {authError}
            </div>
            )}

          <button
            onClick={onLogin}
            disabled={isAuthLoading}
            className="w-full rounded-2xl bg-green-700 text-white py-3 font-medium shadow-sm transition hover:bg-green-800"
          >
            {isAuthLoading ? "Loggar in..." : "Logga in"} 
          </button>

          <button
            onClick={onContinueAsGuest}
            className="w-full rounded-2xl bg-stone-200 text-stone-800 py-3 font-medium transition hover:bg-stone-300"
          >
            Fortsätt som gäst
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-green-50 px-4 py-3">
          <p className="text-xs text-green-800 leading-5">
Testlogin just nu: användarnamn <strong>user-456</strong> och lösenord <strong>mypassword123</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}