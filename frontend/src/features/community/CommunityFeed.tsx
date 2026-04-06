import type { FeedItem } from "./community.types";

type CommunityFeedProps = {
  feedItems: FeedItem[];
  totalReports: number;
  totalEvents: number;
  totalParticipants: number;
  onClose: () => void;
};

function getTypeStyle(type: FeedItem["type"]) {
  switch (type) {
    case "report":
      return {
        icon: "📍",
        badge: "Rapport",
        badgeClass: "bg-green-100 text-green-700",
      };
    case "event":
      return {
        icon: "📅",
        badge: "Event",
        badgeClass: "bg-amber-100 text-amber-700",
      };
    case "join":
      return {
        icon: "🙋",
        badge: "Community",
        badgeClass: "bg-blue-100 text-blue-700",
      };
  }
}

function formatRelative(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "Nyss";
  if (minutes < 60) return `${minutes} min sedan`;
  if (hours < 24) return `${hours} h sedan`;

  return date.toLocaleDateString("sv-SE");
}

export default function CommunityFeed({
  feedItems,
  totalReports,
  totalEvents,
  totalParticipants,
  onClose,
}: CommunityFeedProps) {
  return (
    <>
      <div
       className=" fixed inset-0 z-11 bg-black/30 backdrop-blur-1px"
        onClick={onClose}
      />

      <div className="fixed inset-3 z-1100 overflow-y-auto rounded-2rem border border-black/5 bg-[#f7f7ec] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-[#f7f7ec]/95 px-5 py-4 backdrop-blur-sm">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
              Gemenskap
            </p>
            <h2 className="text-lg font-semibold text-stone-900">
              Community-flöde
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm transition hover:bg-stone-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          <section className="overflow-hidden rounded-[2rem]backdrop-blur-1px p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-700/70">
              Gemenskapens påverkan
            </p>

            <div className="mt-2 flex items-end gap-2">
              <h3 className="text-4xl font-extrabold tracking-tight text-stone-900">
                {totalReports}
              </h3>
              <span className="pb-1 text-sm font-medium text-stone-700">
                rapporter totalt
              </span>
            </div>

            <p className="mt-3 max-w-[240px] text-sm leading-6 text-stone-700">
              Naturappen växer genom rapporter, städevent och deltagande från
              communityn.
            </p>
          </section>

          <section className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-black/5 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">
                📅
              </div>

              <div>
                <p className="text-base font-bold text-stone-900">
                  Aktiva event i appen
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-stone-500">
                  {totalEvents} event • {totalParticipants} deltagare
                </p>
              </div>
            </div>

            <div className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white">
              Live
            </div>
          </section>

          <section className="space-y-5">
            {feedItems.length > 0 ? (
              feedItems.map((item) => {
                const style = getTypeStyle(item.type);

                return (
                  <article
                    key={item.id}
                    className="group rounded-[2rem] bg-white p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-lg">
                        {style.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-stone-900">
                          {item.actorName}{" "}
                          <span className="font-normal text-stone-600">
                            {item.title}
                          </span>
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          {formatRelative(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 overflow-hidden rounded-[1.5rem] bg-stone-100">
                      <div className="flex aspect-[16/10] items-end bg-gradient-to-br from-green-200 via-stone-100 to-amber-100 p-4">
                        <div>
                          <p className="text-lg font-bold text-stone-900">
                            {item.description}
                          </p>
                          <p className="mt-1 text-xs text-stone-600">
                            {item.locationLabel}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badgeClass}`}
                      >
                        {style.badge}
                      </span>

                      {item.statLabel && item.statValue && (
                        <div className="rounded-2xl bg-stone-100 px-3 py-2 text-right">
                          <p className="text-sm font-bold text-stone-900">
                            {item.statValue}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-stone-500">
                            {item.statLabel}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 px-1">
                      <button className="text-sm font-medium text-stone-700 transition hover:text-green-700">
                        👏 High five
                      </button>
                      <button className="text-sm font-medium text-stone-700 transition hover:text-green-700">
                        💬 Kommentar
                      </button>
                      <button className="ml-auto text-sm font-medium text-stone-500 transition hover:text-stone-700">
                        ↗ Dela
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[2rem] bg-white p-5 text-sm text-stone-500 shadow-sm">
                Inget community-flöde ännu. Skapa rapporter och event för att
                bygga upp flödet.
              </div>
            )}
          </section>

          <section className="relative overflow-hidden rounded-[2rem] bg-[#dde7c2] p-6 shadow-sm">
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-stone-900">
                Bjud in en vän,
                <br />
                bygg communityn.
              </h3>

              <p className="mt-2 max-w-[220px] text-sm leading-6 text-stone-700">
                Nästa steg är att låta användare bjuda in fler till insatser och
                få community-badges.
              </p>

              <button className="mt-5 rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800">
                Kommer snart
              </button>
            </div>

            <div className="absolute -bottom-6 -right-6 text-8xl opacity-10">
              🌿
            </div>
          </section>
        </div>
      </div>
    </>
  );
}