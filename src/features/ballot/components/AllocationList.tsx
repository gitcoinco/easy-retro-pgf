import clsx from "clsx";
import type { ReactNode } from "react";
import { tv } from "tailwind-variants";
import Link from "next/link";
import { Trash } from "lucide-react";

import { createComponent } from "~/components/ui";
import { Table, Tbody, Tr, Td } from "~/components/ui/Table";
import { formatNumber } from "~/utils/formatNumber";
import {
  type UseFormReturn,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { AllocationInput } from "./AllocationInput";
import { IconButton } from "~/components/ui/Button";
import { type Vote } from "../types";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { FormControl, Input } from "~/components/ui/Form";
import { useMaci } from "~/contexts/Maci";
import { useBallot } from "~/contexts/Ballot";
import { config } from "~/config";

const AllocationListWrapper = createComponent(
  "div",
  tv({ base: "flex flex-col gap-2 flex-1" }),
);

export const AllocationList = ({ votes }: { votes?: Vote[] }) => {
  return (
    <AllocationListWrapper>
      <Table>
        <Tbody>
          {votes?.map((project) => (
            <Tr key={project.projectId}>
              <Td className={"w-full"}>
                <ProjectAvatarWithName link id={project.projectId} />
              </Td>
              <Td className="whitespace-nowrap text-right">
                {formatNumber(project.amount)} {config.tokenName}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </AllocationListWrapper>
  );
};

type AllocationFormProps = {
  renderHeader?: () => ReactNode;
  renderExtraColumn?: (
    {
      form,
      project,
    }: { form: UseFormReturn<{ votes: Vote[] }>; project: Vote },
    i: number,
  ) => ReactNode;
  disabled?: boolean;
  projectIsLink?: boolean;
};

export function AllocationFormWrapper({
  disabled,
  projectIsLink,
  renderHeader,
  renderExtraColumn,
}: AllocationFormProps) {
  const form = useFormContext<{ votes: Vote[] }>();
  const { initialVoiceCredits, pollId } = useMaci();
  const { addToBallot: onSave, removeFromBallot: onRemove } = useBallot();

  const { fields, remove } = useFieldArray({
    name: "votes",
    keyName: "key",
    control: form.control,
  });

  return (
    <AllocationListWrapper>
      <Table>
        {renderHeader?.()}
        <Tbody>
          {fields.map((project, i) => {
            const idx = i;

            return (
              <Tr key={project.projectId}>
                <Td className={"w-full"}>
                  <ProjectAvatarWithName
                    link={projectIsLink}
                    id={project.projectId}
                  />
                </Td>
                <Td>{renderExtraColumn?.({ project, form }, i)}</Td>
                <Td>
                  <AllocationInput
                    name={`votes.${idx}.amount`}
                    disabled={disabled}
                    defaultValue={project.amount}
                    votingMaxProject={initialVoiceCredits}
                    onBlur={() => onSave?.(form.getValues().votes, pollId)}
                  />
                </Td>
                <Td>
                  <IconButton
                    tabIndex={-1}
                    type="button"
                    variant="ghost"
                    icon={Trash}
                    disabled={disabled}
                    onClick={() => {
                      remove(idx);
                      onRemove?.(project.projectId);
                    }}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </AllocationListWrapper>
  );
}

export function DistributionForm(props: AllocationFormProps) {
  return (
    <AllocationFormWrapper
      {...props}
      renderExtraColumn={({}, i) => (
        <FormControl className="mb-0" name={`votes.${i}.payoutAddress`}>
          <Input className="min-w-64 font-mono" />
        </FormControl>
      )}
    />
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
