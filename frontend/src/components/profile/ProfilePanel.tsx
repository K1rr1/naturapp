import type { Pin } from "../../features/pins/pins.types";

type ProfilePanelProps = {
  name: string;
  mode: "guest" | "user";
  pins: Pin[];
  onClose: () => void;
  onLogout: () => void;
};

type ActivityItem = {
  id: string;
  type: "created-pin" | "created-event" | "joined-event";
  title: string;
  description: string;
  sortValue: number;
};

type ScrollSectionProps = {
  title: string;
  subtitle: string;
  emptyText: string;
  children: React.ReactNode;
  hasItems: boolean;
};

function ScrollSection({
  title,
  subtitle,
  emptyText,
  children,
  hasItems,
}: ScrollSectionProps) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-sm">
      <h4 className="mb-1 text-lg font-semibold text-green-900">{title}</h4>
      <p className="mb-4 text-sm text-stone-500">{subtitle}</p>

      {hasItems ? (
        <div className="relative">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-12 scrollbar-none">
            {children}
          </div>

          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent" />
        </div>
      ) : (
        <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
          {emptyText}
        </div>
      )}
    </div>
  );
}

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
  const latestUserPins = sortedUserPins.slice(0, 6);

  const categoryCounts = userPins.reduce<Record<string, number>>((acc, pin) => {
    acc[pin.category] = (acc[pin.category] || 0) + 1;
    return acc;
  }, {});

  const favoriteCategory =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Ingen ännu";

  const eventsUserParticipatesIn = pins
    .filter((pin) => pin.cleanupEvent?.participants?.includes(name))
    .sort((a, b) => {
      if (!a.cleanupEvent || !b.cleanupEvent) return 0;

      const aDate = new Date(`${a.cleanupEvent.date}T${a.cleanupEvent.time}`);
      const bDate = new Date(`${b.cleanupEvent.date}T${b.cleanupEvent.time}`);

      return aDate.getTime() - bDate.getTime();
    });

  const createdEvents = userPins
    .filter((pin) => pin.cleanupEvent)
    .sort((a, b) => {
      if (!a.cleanupEvent || !b.cleanupEvent) return 0;

      const aDate = new Date(`${a.cleanupEvent.date}T${a.cleanupEvent.time}`);
      const bDate = new Date(`${b.cleanupEvent.date}T${b.cleanupEvent.time}`);

      return aDate.getTime() - bDate.getTime();
    });

  const getEventStatus = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    const now = new Date();

    const todayString = now.toDateString();
    const eventDayString = eventDate.toDateString();

    if (eventDayString === todayString) {
      return {
        label: "Idag",
        className: "bg-amber-100 text-amber-700",
      };
    }

    if (eventDate.getTime() > now.getTime()) {
      return {
        label: "Kommande",
        className: "bg-green-100 text-green-700",
      };
    }

    return {
      label: "Passerat",
      className: "bg-stone-200 text-stone-600",
    };
  };

  const createdPinsCount = userPins.length;
  const createdEventsCount = createdEvents.length;
  const joinedEventsCount = eventsUserParticipatesIn.length;

  const totalActivityScore =
    createdPinsCount + createdEventsCount * 2 + joinedEventsCount;

  const getUserRank = () => {
    if (totalActivityScore >= 10) {
      return {
        title: "Naturväktare",
        min: 10,
        max: 18,
      };
    }

    if (totalActivityScore >= 5) {
      return {
        title: "Naturspanare",
        min: 5,
        max: 10,
      };
    }

    return {
      title: "Nybörjare",
      min: 0,
      max: 5,
    };
  };

  const currentRank = getUserRank();

  const progressWithinRank = Math.min(
    ((totalActivityScore - currentRank.min) /
      (currentRank.max - currentRank.min)) *
      100,
    100
  );

  const badges = [
    {
      label: "Första rapporten",
      unlocked: createdPinsCount >= 1,
    },
    {
      label: "Eventskapare",
      unlocked: createdEventsCount >= 1,
    },
    {
      label: "Deltar i städning",
      unlocked: joinedEventsCount >= 1,
    },
    {
      label: "Aktiv användare",
      unlocked: totalActivityScore >= 5,
    },
  ];

  const activityFeed: ActivityItem[] = [
    ...userPins.map((pin) => ({
      id: `pin-${pin.id}`,
      type: "created-pin" as const,
      title: "Rapport skapad",
      description: pin.text,
      sortValue: pin.id,
    })),
    ...createdEvents.map((pin) => ({
      id: `created-event-${pin.id}`,
      type: "created-event" as const,
      title: "Event skapat",
      description: `${pin.text}${
        pin.cleanupEvent ? ` • ${pin.cleanupEvent.date} ${pin.cleanupEvent.time}` : ""
      }`,
      sortValue: pin.cleanupEvent
        ? new Date(`${pin.cleanupEvent.date}T${pin.cleanupEvent.time}`).getTime()
        : pin.id,
    })),
    ...eventsUserParticipatesIn.map((pin) => ({
      id: `joined-event-${pin.id}`,
      type: "joined-event" as const,
      title: "Gått med i event",
      description: `${pin.text}${
        pin.cleanupEvent ? ` • ${pin.cleanupEvent.date} ${pin.cleanupEvent.time}` : ""
      }`,
      sortValue: pin.cleanupEvent
        ? new Date(`${pin.cleanupEvent.date}T${pin.cleanupEvent.time}`).getTime()
        : pin.id,
    })),
  ]
    .sort((a, b) => b.sortValue - a.sortValue)
    .slice(0, 6);

  const getActivityStyle = (type: ActivityItem["type"]) => {
    switch (type) {
      case "created-pin":
        return {
          icon: "📍",
          className: "bg-green-100 text-green-700",
        };
      case "created-event":
        return {
          icon: "📅",
          className: "bg-blue-100 text-blue-700",
        };
      case "joined-event":
        return {
          icon: "🙋",
          className: "bg-amber-100 text-amber-700",
        };
    }
  };

  return (
    <>
      <div
       className=" fixed inset-0 z-1100 bg-black/30 backdrop-blur-1px"
        onClick={onClose}
      />

      <div className="fixed inset-3 z-1100 overflow-y-auto rounded-4xl border border-black/5 bg-stone-100 shadow-2xl">
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
          <div className="rounded-4xl bg-white p-5 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-700 bg-orange-100 text-4xl shadow-sm">
              👤
            </div>

            <div className="mb-2 inline-flex rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold text-white">
              {mode === "guest" ? "Gästläge" : "Naturprofil"}
            </div>

            <h3 className="text-2xl font-bold text-green-800">{name}</h3>

            <p className="mt-1 text-sm text-stone-500">
              {mode === "guest"
                ? "Utforskar appen som gäst"
                : "Aktiv användare i naturappen"}
            </p>
          </div>

          <div className="rounded-4xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-green-900">Status</h4>
                <p className="text-sm text-stone-500">
                  Din aktivitet i appen just nu.
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {currentRank.title}
              </span>
            </div>

            <div className="mb-3 rounded-2xl bg-stone-50 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-stone-800">
                  Aktivitetspoäng
                </span>
                <span className="text-stone-500">{totalActivityScore}</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-green-600 transition-all"
                  style={{ width: `${progressWithinRank}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-stone-500">
                Byggs upp genom rapporter, skapade event och deltagande i event.
              </p>
            </div>
          </div>

          <div className="rounded-4xl bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-green-900">Badges</h4>

            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`rounded-full px-3 py-2 text-xs font-medium ${
                    badge.unlocked
                      ? "bg-green-100 text-green-700"
                      : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {badge.unlocked ? "🏅" : "🔒"} {badge.label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-4xl bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-green-900">Statistik</h4>

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

              <div className="col-span-2 rounded-2xl bg-stone-50 p-4">
                <p className="text-xs text-stone-500">Deltar i event</p>
                <p className="mt-1 text-xl font-bold text-stone-900">
                  {eventsUserParticipatesIn.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl bg-white p-5 shadow-sm">
            <h4 className="mb-1 text-lg font-semibold text-green-900">
              Nästa event
            </h4>
            <p className="mb-4 text-sm text-stone-500">
              Det närmaste planerade städeventet i appen.
            </p>

            {nextEvent && nextEvent.cleanupEvent ? (
              <div className="rounded-2xl bg-green-50 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-stone-900">
                    {nextEvent.text}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      getEventStatus(
                        nextEvent.cleanupEvent.date,
                        nextEvent.cleanupEvent.time
                      ).className
                    }`}
                  >
                    {
                      getEventStatus(
                        nextEvent.cleanupEvent.date,
                        nextEvent.cleanupEvent.time
                      ).label
                    }
                  </span>
                </div>

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

          <ScrollSection
            title="Aktivitet"
            subtitle="Dina senaste handlingar i appen."
            emptyText="Ingen aktivitet ännu. Skapa en rapport eller gå med i ett event för att komma igång."
            hasItems={activityFeed.length > 0}
          >
            {activityFeed.map((item) => {
              const activityStyle = getActivityStyle(item.type);

              return (
                <div
                  key={item.id}
                  className="min-w-[82%] snap-start rounded-2xl bg-stone-50 p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm ${activityStyle.className}`}
                    >
                      {activityStyle.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-stone-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollSection>

          <ScrollSection
            title="Mina skapade event"
            subtitle="Event du själv organiserar via dina rapporter."
            emptyText="Du har inte skapat några event ännu."
            hasItems={createdEvents.length > 0}
          >
            {createdEvents.map((pin) => (
              <div
                key={pin.id}
                className="min-w-[82%] snap-start rounded-2xl bg-stone-50 p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-stone-900">
                    {pin.text}
                  </p>

                  {pin.cleanupEvent && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        getEventStatus(
                          pin.cleanupEvent.date,
                          pin.cleanupEvent.time
                        ).className
                      }`}
                    >
                      {
                        getEventStatus(
                          pin.cleanupEvent.date,
                          pin.cleanupEvent.time
                        ).label
                      }
                    </span>
                  )}
                </div>

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
          </ScrollSection>

          <ScrollSection
            title="Senaste rapporter"
            subtitle="Dina senaste skapade rapporter."
            emptyText="Du har inte skapat några rapporter ännu."
            hasItems={latestUserPins.length > 0}
          >
            {latestUserPins.map((pin) => (
              <div
                key={pin.id}
                className="min-w-[82%] snap-start rounded-2xl bg-stone-50 p-4 shadow-sm"
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
          </ScrollSection>

          <div className="rounded-4xl bg-white p-5 shadow-sm">
            <h4 className="mb-1 text-lg font-semibold text-green-900">
              Event du deltar i
            </h4>
            <p className="mb-4 text-sm text-stone-500">
              Event där du har valt att vara med som deltagare.
            </p>

            {eventsUserParticipatesIn.length > 0 ? (
              <div className="space-y-3">
                {eventsUserParticipatesIn.map((pin) => (
                  <div key={pin.id} className="rounded-2xl bg-stone-50 p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-stone-900">
                        {pin.text}
                      </p>

                      {pin.cleanupEvent && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            getEventStatus(
                              pin.cleanupEvent.date,
                              pin.cleanupEvent.time
                            ).className
                          }`}
                        >
                          {
                            getEventStatus(
                              pin.cleanupEvent.date,
                              pin.cleanupEvent.time
                            ).label
                          }
                        </span>
                      )}
                    </div>

                    {pin.cleanupEvent && (
                      <>
                        <p className="mt-1 text-xs text-stone-500">
                          {pin.cleanupEvent.date} • {pin.cleanupEvent.time}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          Skapad av: {pin.createdBy}
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
                Du deltar inte i några event ännu.
              </div>
            )}
          </div>

          <div className="rounded-4xl bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-green-900">Konto</h4>

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