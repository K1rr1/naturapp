import type {
  Pin,
  CategoryFilter,
  OwnerFilter,
  EventFilter,
  StatusFilter,
} from "./pins.types";

type UseFiltersParams = {
  pins: Pin[];
  categoryFilter: CategoryFilter;
  ownerFilter: OwnerFilter;
  currentUserName: string;
  eventFilter: EventFilter;
  statusFilter: StatusFilter;
};

export function useFilters({// funktioner för att filtrera pins baserat på kategori, ägare och eventstatus
  pins,
  categoryFilter,
  ownerFilter,
  currentUserName,
  eventFilter,
  statusFilter,
}: UseFiltersParams) {
  const filteredPins = pins.filter((pin) => {
    const matchesCategory =
      categoryFilter === "alla" || pin.category === categoryFilter;

    const matchesOwner =
      ownerFilter === "alla" ||
      (ownerFilter === "mina" && pin.createdBy === currentUserName) ||
      (ownerFilter === "andras" && pin.createdBy !== currentUserName);

    const participants = pin.cleanupEvent?.participants || [];
    const matchesEvent =
      eventFilter === "alla" ||
      (eventFilter === "medEvent" && pin.cleanupEvent) ||
      (eventFilter === "utanEvent" && !pin.cleanupEvent) ||
      (eventFilter === "deltar" && participants.includes(currentUserName));

    const isOpen = pin.status !== "åtgärdad";
    const matchesStatus =
      statusFilter === "öppna" ? isOpen : pin.status === "åtgärdad";

    return matchesCategory && matchesOwner && matchesEvent && matchesStatus;

  });

  return {
    filteredPins,
  };
}