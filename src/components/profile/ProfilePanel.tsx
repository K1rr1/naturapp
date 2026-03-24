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

  const userPinsWithEvents = userPins.filter((pin) => pin.cleanupEvent);

  const pinsWithEvents = pins.filter((pin) => pin.cleanupEvent);

  const sortedEvents = [...pinsWithEvents].sort((a, b) => {
    if (!a.cleanupEvent || !b.cleanupEvent) return 0;

    const aDate = new Date(`${a.cleanupEvent.date}T${a.cleanupEvent.time}`);
    const bDate = new Date(`${b.cleanupEvent.date}T${b.cleanupEvent.time}`);

    return aDate.getTime() - bDate.getTime();
  });

  const nextEvent = sortedEvents[0];

  const sortedUserPins = [...userPins].sort((a, b) => b.id - a.id);
  const latestUserPins = sortedUserPins.slice(0, 3);

  const categoryCounts = userPins.reduce<Record<string, number>>((acc, pin) =>
     {
    acc[pin.category] = (acc[pin.category] || 0) + 1;
    return acc;
  }, {});

  const favoriteCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "Ingen ännu";

  const eventsUserParticipatesIn = pins
    .filter((pin) => pin.cleanupEvent?.participants?.includes(name))
    .sort((a, b) => {
      if (!a.cleanupEvent || !b.cleanupEvent) return 0;

      const aDate = new Date(`${a.cleanupEvent.date}T${a.cleanupEvent.time}`);
      const bDate = new Date(`${b.cleanupEvent.date}T${b.cleanupEvent.time}`);

      return aDate.getTime() - bDate.getTime();
    });

     const createdEvents =  userPins
    .filter((pin) => pin.cleanupEvent)
    .sort((a, b) => {
      if (!a.cleanupEvent || !b.cleanupEvent) return 0;

      const aDate = new Date(`${a.cleanupEvent.date}T${a.cleanupEvent.time}`);
      const bDate = new Date(`${b.cleanupEvent.date}T${b.cleanupEvent.time}`);

      return aDate.getTime() - bDate.getTime();
    });
    

  return (
    <>
      <div
        className="fixed inset-0 z-[1090] bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="fixed inset-3 z-[1100] overflow-y-auto rounded-[2rem] border border-black/5 bg-stone-100 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-stone-100/95 px-5 py-4 backdrop-blur-sm">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
              Profil
            </p>
            <h2 className="text-lg font-semibold text-stone-900">{name}</h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-700 shadow"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="rounded-[2rem] bg-white p-5 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-700 bg-orange-100 text-4xl shadow-sm">
              👤
            </div>

            <div className="mb-2 inline-flex rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold text-white">
              {mode === "guest" ? "Gästläge" : "Naturväktare"}
            </div>

            <h3 className="text-2xl font-bold text-green-800">{name}</h3>

            <p className="mt-1 text-sm text-stone-500">
              {mode === "guest" ? "Utforskar appen som gäst" : "Aktiv användare i naturappen"}
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-green-900">
              Statistik
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs text-stone-500">Egna rapporter</p>
                <p className="mt-1 text-xl font-bold text-stone-900">
                  {userPins.length}
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs text-stone-500">Skapade event</p>
                <p className="mt-1 text-xl font-bold text-stone-900">
                  {userPinsWithEvents.length}
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs text-stone-500">Favoritkategori</p>
                <p className="mt-1 text-sm font-bold text-stone-900">
                  {favoriteCategory}
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs text-stone-500">Aktiva event</p>
                <p className="mt-1 text-xl font-bold text-stone-900">
                  {sortedEvents.length}
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4 col-span-2">
                <p className="text-xs text-stone-500">Deltar i event</p>
                <p className="mt-1 text-xl font-bold text-stone-900">
                  {eventsUserParticipatesIn.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-green-900">
              Nästa event
            </h4>

            {nextEvent && nextEvent.cleanupEvent ? (
              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm font-semibold text-stone-900">
                  {nextEvent.text}
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  {nextEvent.cleanupEvent.date} • {nextEvent.cleanupEvent.time}
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  Skapad av: {nextEvent.createdBy}
                </p>

                {nextEvent.cleanupEvent.note && (
                  <p className="mt-2 text-sm text-stone-800">
                    {nextEvent.cleanupEvent.note}
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                Inga kommande event ännu.
              </div>
            )}
          </div>
            <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-green-900">
              Mina skapade event
            </h4>

            {createdEvents.length > 0 ? (
              <div className="space-y-3">
                {createdEvents.map((pin) => (
                  <div key={pin.id} className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-900">
                      {pin.text}
                    </p>

                    {pin.cleanupEvent && (
                      <>
                        <p className="mt-1 text-xs text-stone-500">
                          {pin.cleanupEvent.date} • {pin.cleanupEvent.time}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          Deltagare: {pin.cleanupEvent.participants.length}
                        </p>

                        {pin.cleanupEvent.note && (
                          <p className="mt-2 text-sm text-stone-700">
                            {pin.cleanupEvent.note}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                Du har inte skapat några event ännu.
              </div>
            )}
          </div>
          <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-green-900">
              Event du deltar i
            </h4>

            {eventsUserParticipatesIn.length > 0 ? (
              <div className="space-y-3">
                {eventsUserParticipatesIn.map((pin) => (
                  <div key={pin.id} className="rounded-2xl bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-900">
                      {pin.text}
                    </p>

                    {pin.cleanupEvent && (
                      <>
                        <p className="mt-1 text-xs text-stone-500">
                          {pin.cleanupEvent.date} • {pin.cleanupEvent.time}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          Skapad av: {pin.createdBy}
                        </p>

                        {pin.cleanupEvent.note && (
                          <p className="mt-2 text-sm text-stone-700">
                            {pin.cleanupEvent.note}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                Du deltar inte i några event ännu.
              </div>
            )}
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-green-900">
              Senaste rapporter
            </h4>

            {latestUserPins.length > 0 ? (
              <div className="space-y-3">
                {latestUserPins.map((pin) => (
                  <div
                    key={pin.id}
                    className="rounded-2xl bg-stone-50 p-4"
                  >
                    <p className="text-sm font-semibold text-stone-900">
                      {pin.text}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      Kategori: {pin.category}
                    </p>
                    {pin.cleanupEvent && (
                      <p className="mt-1 text-xs text-green-700">
                        Har event kopplat
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                Du har inte skapat några rapporter ännu.
              </div>
            )}
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-green-900">
              Konto
            </h4>

            <div className="flex flex-col gap-3">
              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-stone-200 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-300"
              >
                Tillbaka till kartan
              </button>

              <button
                onClick={onLogout}
                className="w-full rounded-2xl bg-red-500 py-3 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Logga ut
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}