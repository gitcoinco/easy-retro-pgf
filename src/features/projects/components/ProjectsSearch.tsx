import { useRef, useState } from "react";
import clsx from "clsx";
import { Command } from "cmdk";
import { useClickAway } from "react-use";

import { type Vote } from "~/features/ballot/types";
import { SearchInput } from "~/components/ui/Form";
import { useSearchProjects } from "~/features/projects/hooks/useProjects";
import { type Filter } from "~/features/filter/types";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";

type Props = {
  addedProjects: Vote[];
  onSelect: (path: string) => void;
};

export const ProjectsSearch = ({ addedProjects, onSelect }: Props) => {
  const searchRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  useClickAway(searchRef, () => setOpen(false));

  // Search does not use pagination, categories and always sorts A to Z
  const filter = {
    orderBy: "name",
    sortOrder: "asc",
    search,
    cursor: 0,
    limit: 10,
  } as Partial<Filter>;
  const projects = useSearchProjects(filter);

  const projectsData =
    (projects.data?.pages.flat() ?? []).filter(
      (project) => !addedProjects.find((p) => p.projectId === project.id),
    ) ?? [];

  return (
    <div className="flex-1">
      <Command
        ref={searchRef}
        className="flex-1 md:relative"
        shouldFilter={false}
        loop
      >
        <SearchInput
          as={Command.Input}
          value={search}
          onFocus={() => setOpen(true)}
          onKeyDown={() => setOpen(true)}
          onValueChange={setSearch}
          placeholder="Search projects..."
        />

        {projectsData.length ? (
          <Command.List
            className={clsx(
              "absolute left-0 z-10 mt-1 max-h-[300px] w-full overflow-y-scroll rounded-xl bg-gray-100 p-2 md:h-auto",
              { ["hidden"]: !isOpen },
              0,
            )}
          >
            {projects.isPending ? (
              <Command.Loading>Loading...</Command.Loading>
            ) : !projectsData.length ? null : (
              projectsData?.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg p-2 normal-case text-gray-900 hover:bg-gray-100"
                  onSelect={(id: string) => {
                    setSearch("");
                    setOpen(false);
                    onSelect(id);
                  }}
                >
                  <ProjectAvatar
                    className="h-6 w-6"
                    profileId={item.recipient}
                  />
                  {item.name}
                </Command.Item>
              ))
            )}
          </Command.List>
        ) : null}
      </Command>
    </div>
  );
};
