import type { OrderBy, SortOrder } from "~/features/filter/types";
import { SortByDropdown } from "./SortByDropdown";
import { useFilter } from "~/features/filter/hooks/useFilter";

export const SortFilter = () => {
  const { orderBy, sortOrder, setFilter } = useFilter();

  return (
    <div className="mb-2 flex gap-2">
      <SortByDropdown
        options={["name_asc", "name_desc", "time_asc", "time_desc"]}
        value={`${orderBy}_${sortOrder}`}
        onChange={async (sort) => {
          const [orderBy, sortOrder] = sort.split("_") as [OrderBy, SortOrder];

          await setFilter({ orderBy, sortOrder }).catch();
        }}
      />
    </div>
  );
};
