type CategoryFilter = "alla" | "skräp" | "trasigt" | "belysning" | "övrigt";
type OwnerFilter = "alla" | "mina" | "andras";

type Props = {
  categoryFilter: CategoryFilter;
  ownerFilter: OwnerFilter;
  setCategoryFilter: (value: CategoryFilter) => void;
  setOwnerFilter: (value: OwnerFilter) => void;
  onReset: () => void;
};

export default function MapFilters({
  categoryFilter,
  ownerFilter,
  setCategoryFilter,
  setOwnerFilter,
  onReset,
}: Props) {
  const hasActiveFilters =
    categoryFilter !== "alla" || ownerFilter !== "alla";

  return (
    <div
      style={{
        position: "absolute",
        top: "12px",
        left: "12px",
        right: "70px",
        zIndex: 1000,
        background: "white",
        padding: "12px",
        borderRadius: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <strong style={{ fontSize: "15px" }}>Filter</strong>

      {hasActiveFilters && (
        <div
          style={{
            fontSize: "13px",
            padding: "8px",
            background: "#f3f4f6",
            borderRadius: "8px",
          }}
        >
          Aktivt filter
        </div>
      )}

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
      >
        <option value="alla">Alla kategorier</option>
        <option value="skräp">🗑️ Skräp</option>
        <option value="trasigt">🔧 Trasigt</option>
        <option value="belysning">💡 Belysning</option>
        <option value="övrigt">📦 Övrigt</option>
      </select>

      <select
        value={ownerFilter}
        onChange={(e) => setOwnerFilter(e.target.value as OwnerFilter)}
      >
        <option value="alla">Alla rapporter</option>
        <option value="mina">👤 Mina</option>
        <option value="andras">🌍 Andras</option>
      </select>

      <button onClick={onReset}>Återställ filter</button>
    </div>
  );
}