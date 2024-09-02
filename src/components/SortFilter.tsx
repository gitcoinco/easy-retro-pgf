import type { OrderBy, SortOrder } from "~/features/filter/types";
import SortByRoundDropdown from "./SortByRoundDropdown";
import SortByDropdown from "./SortByDropdown";
import { useFilter } from "~/features/filter/hooks/useFilter";
import { SearchInput } from "./ui/Form";
import { useDebounce } from "react-use";
import { useState } from "react";
import { roundsMap } from "~/config";

export const SortFilter = () => {
  const { orderBy, sortOrder, setFilter, round, isRandom } = useFilter();

  const [search, setSearch] = useState("");

  useDebounce(() => setFilter({ search }), 500, [search]);

  return (
    <div className="mb-2 flex flex-1 flex-col items-end gap-2 sm:flex-row">
      <SearchInput
        className="w-full rounded-full"
        placeholder="Search project names..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SortByDropdown
        options={[
          "time_random",
          "name_asc",
          "name_desc",
          "time_asc",
          "time_desc",
        ]}
        value={isRandom ? "time_random" : `${orderBy}_${sortOrder}`}
        onChange={async (sort) => {
          const [orderBy, sortOrder] = sort.split("_") as [OrderBy, SortOrder];

          await setFilter({ orderBy, sortOrder }).catch();
        }}
      />
      <SortByRoundDropdown
        options={Object.keys(roundsMap).map((option) => {
          return {
            value: option,
            label: `fil-rpgf-round #${option}`,
          };
        })}
        value={round}
        onChange={async (round) => {
          await setFilter({
            round,
          }).catch();
        }}
        placeholder="Round"
      />
    </div>
  );
};
