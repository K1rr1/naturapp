import type { Pin } from "../../features/pins/pins.types";
import type { FeedItem } from "./community.types";

type UseCommunityFeedParams = {
  pins: Pin[];
};

export function useCommunityFeed({ pins }: UseCommunityFeedParams) {
  const feedItems: FeedItem[] = pins.flatMap((pin) => {
    const items: FeedItem[] = [];

    items.push({
      id: `report-${pin.id}`,
      type: "report",
      actorName: pin.createdBy,
      title: "rapporterade ett område",
      description: pin.text,
      locationLabel: "Naturappen karta",
      createdAt: new Date(Number(pin.id) || Date.now()).toISOString(),
    });

    if (pin.cleanupEvent) {
      items.push({
        id: `event-${pin.id}`,
        type: "event",
        actorName: pin.createdBy,
        title: "skapade ett städevent",
        description: pin.cleanupEvent.note || pin.text,
        locationLabel: pin.cleanupEvent.date,
        createdAt: new Date(
          `${pin.cleanupEvent.date}T${pin.cleanupEvent.time}`
        ).toISOString(),
        statLabel: "Deltagare",
        statValue: String(pin.cleanupEvent.participants.length),
      });

      if (pin.cleanupEvent.participants.length > 0) {
        items.push({
          id: `join-${pin.id}`,
          type: "join",
          actorName: `${pin.cleanupEvent.participants.length} personer`,
          title: "har gått med i ett event",
          description: pin.text,
          locationLabel: pin.cleanupEvent.date,
          createdAt: new Date(
            `${pin.cleanupEvent.date}T${pin.cleanupEvent.time}`
          ).toISOString(),
          statLabel: "Team",
          statValue: `${pin.cleanupEvent.participants.length} st`,
        });
      }
    }

    return items;
  });

  const sortedFeed = [...feedItems]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 12);

  const totalParticipants = pins.reduce((sum, pin) => {
    return sum + (pin.cleanupEvent?.participants.length || 0);
  }, 0);

  const totalEvents = pins.filter((pin) => pin.cleanupEvent).length;

  return {
    feedItems: sortedFeed,
    communityStats: {
      totalReports: pins.length,
      totalEvents,
      totalParticipants,
    },
  };
}