import type {
  Pin,
  CategoryFilter,
  OwnerFilter,
  EventFilter,
} from "./pins.types";

type UseFiltersParams = {
  pins: Pin[];
  categoryFilter: CategoryFilter;
  ownerFilter: OwnerFilter;
  currentUserName: string;
  eventFilter: EventFilter;
};

export function useFilters({// funktioner för att filtrera pins baserat på kategori, ägare och eventstatus
  pins,
  categoryFilter,
  ownerFilter,
  currentUserName,
  eventFilter,
}: UseFiltersParams) {
  const filteredPins = pins.filter((pin) => {
    const matchesCategory =
      categoryFilter === "alla" || pin.category === categoryFilter;

    const matchesOwner =
      ownerFilter === "alla" ||
      (ownerFilter === "mina" && pin.createdBy === currentUserName) ||
      (ownerFilter === "andras" && pin.createdBy !== currentUserName);
    const matchesEvent =
      eventFilter === "alla" ||
      (eventFilter === "medEvent" && pin.cleanupEvent);
    return matchesCategory && matchesOwner && matchesEvent;

  });

  return {
    filteredPins,
  };
}