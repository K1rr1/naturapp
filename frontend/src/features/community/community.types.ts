export type FeedItemType = "report" | "event" | "join";

export type FeedItem = {
  id: string;
  type: FeedItemType;
  actorName: string;
  title: string;
  description: string;
  locationLabel: string;
  createdAt: string;
  statLabel?: string;
  statValue?: string;
};