import clsx from "clsx";
import { type ReactNode } from "react";
import { tv } from "tailwind-variants";
import Link from "next/link";
import { Trash } from "lucide-react";

import { createComponent } from "~/components/ui";
import { Table, Tbody, Tr, Td } from "~/components/ui/Table";
import { formatNumber } from "~/utils/formatNumber";
import { useProfileWithMetadata } from "~/hooks/useProfile";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AllocationInput } from "./AllocationInput";
import { IconButton } from "~/components/ui/Button";
import { type Vote } from "../types";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { SearchProjects } from "~/features/lists/components/SearchProjects";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";

const AllocationListWrapper = createComponent(
  "div",
  tv({ base: "flex flex-col gap-2 flex-1" }),
);

export const AllocationList = ({ votes }: { votes?: Vote[] }) => (
  <AllocationListWrapper>
    <Table>
      <Tbody>
        {votes?.map((project) => (
          <Tr key={project.projectId}>
            <Td className={"w-full"}>
              <ProjectAvatarWithName link id={project.projectId} />
            </Td>
            <Td className="whitespace-nowrap text-right">
              {formatNumber(project.amount)} OP
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </AllocationListWrapper>
);

export function AllocationForm({
  list,
  header,
  onSave,
}: {
  list?: Vote[];
  header?: ReactNode;
  onSave?: (v: { votes: Vote[] }) => void;
}) {
  const form = useFormContext<{ votes: Vote[] }>();

  const { fields, remove } = useFieldArray({
    name: "votes",
    keyName: "key",
    control: form.control,
  });

  return (
    <AllocationListWrapper>
      <Table>
        {header}
        <Tbody>
          {fields.map((project, i) => {
            const idx = i;
            // const idx = indexes.get(project.projectId)!;
            // TODO: Get allocated amount from list
            const listAllocation =
              list?.find((p) => p.projectId === project.projectId)?.amount ?? 0;

            return (
              <Tr key={project.projectId}>
                <Td className={"w-full"}>
                  <ProjectAvatarWithName link id={project.projectId} />
                </Td>
                <Td>
                  {listAllocation ? (
                    <AllocationInput
                      name="compareAmount"
                      defaultValue={listAllocation}
                      disabled={true}
                    />
                  ) : null}
                </Td>
                <Td>
                  <AllocationInput
                    name={`votes.${idx}.amount`}
                    onBlur={() => onSave?.(form.getValues())}
                  />
                </Td>
                <Td>
                  <IconButton
                    tabIndex={-1}
                    type="button"
                    variant="ghost"
                    icon={Trash}
                    onClick={() => {
                      remove(idx);
                      onSave?.(form.getValues());
                    }}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <button type="submit" className="hidden" />
    </AllocationListWrapper>
  );
}

export function AllocationFormWithSearch() {
  const form = useFormContext<{ projects: Vote[] }>();

  const { fields, append, remove } = useFieldArray({
    name: "projects",
    keyName: "key",
    control: form.control,
  });

  const { errors } = form.formState;

  return (
    <AllocationListWrapper>
      <SearchProjects
        addedProjects={fields}
        onSelect={(projectId) => append({ projectId, amount: 0 })}
      />
      <Table>
        <Tbody>
          {fields.length ? (
            fields.map((project, i) => {
              const error = errors.projects?.[i]?.amount?.message;
              return (
                <Tr key={project.key}>
                  <Td className={"w-full"}>
                    <ProjectAvatarWithName id={project.projectId} />
                    {error ? (
                      <div className="text-xs text-error-600">{error}</div>
                    ) : null}
                  </Td>

                  <Td>
                    <AllocationInput name={`projects.${i}.amount`} />
                  </Td>
                  <Td>
                    <IconButton
                      tabIndex={-1}
                      type="button"
                      variant="outline"
                      icon={Trash}
                      onClick={() => {
                        remove(i);
                      }}
                    />
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr>
              <Td
                colSpan={3}
                className="flex flex-1 items-center justify-center py-4"
              >
                <div className=" max-w-[360px] space-y-4">
                  <h3 className="text-center text-lg font-bold">
                    List is empty
                  </h3>
                  <p className="text-center text-sm text-gray-700">
                    Search projects to add them to the list.
                  </p>
                </div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <button type="submit" className="hidden" />
    </AllocationListWrapper>
  );
}

export const ProjectAvatarWithName = ({
  id,
  subtitle,
  link,
}: {
  id?: string;
  link?: boolean;
  subtitle?: string;
}) => {
  const { data: project } = useProjectById(id!);
  const { data: metadata } = useProfileWithMetadata(project?.recipient);
  const Component = link ? Link : "div";

  return (
    <Component
      tabIndex={-1}
      className={clsx("flex flex-1 items-center gap-2 py-1 ", {
        ["hover:underline"]: link,
      })}
      href={`/projects/${id}`}
    >
      <ProjectAvatar rounded="full" size="sm" profileId={project?.recipient} />
      <div>
        <div className="font-bold">{project?.name}</div>
        <div className="text-muted">{subtitle}</div>
      </div>
    </Component>
  );
};
