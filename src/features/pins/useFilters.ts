import type {
  Pin,
  CategoryFilter,
  OwnerFilter,
} from "./pins.types";

type UseFiltersParams = {
  pins: Pin[];
  categoryFilter: CategoryFilter;
  ownerFilter: OwnerFilter;
  currentUserName: string;
};

export function useFilters({
  pins,
  categoryFilter,
  ownerFilter,
  currentUserName,
}: UseFiltersParams) {
  const filteredPins = pins.filter((pin) => {
    const matchesCategory =
      categoryFilter === "alla" || pin.category === categoryFilter;

    const matchesOwner =
      ownerFilter === "alla" ||
      (ownerFilter === "mina" && pin.createdBy === currentUserName) ||
      (ownerFilter === "andras" && pin.createdBy !== currentUserName);

    return matchesCategory && matchesOwner;
  });

  return {
    filteredPins,
  };
}