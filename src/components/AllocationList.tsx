import clsx from "clsx";
import {
  createElement,
  type ForwardRefExoticComponent,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
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
import { type Vote } from "../features/ballot/types";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { FormControl, Input } from "~/components/ui/Form";
import { NumberInput } from "./NumberInput";
import { ProjectsSearch } from "~/features/projects/components/ProjectsSearch";

const AllocationListWrapper = createComponent(
  "div",
  tv({ base: "flex flex-col gap-2 flex-1" }),
);

export const AllocationList = ({
  allocations,
}: {
  allocations?: Allocation[];
}) => {
  return (
    <AllocationListWrapper>
      <Table>
        <Tbody>
          {allocations?.map((alloc) => (
            <Tr key={alloc.id}>
              <Td className={"w-full"}>
                <ProjectAvatarWithName link id={alloc.id} />
              </Td>
              <Td className="whitespace-nowrap text-right">
                {formatNumber(alloc.amount)}
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
  input?: ForwardRefExoticComponent<
    ComponentPropsWithoutRef<typeof NumberInput>
  >;
  disabled?: boolean;
  projectIsLink?: boolean;
  onSave?: (v: { votes: Vote[] }) => void;
};

function AllocationFormWrapper({
  input = NumberInput,
  disabled,
  projectIsLink,
  renderHeader,
  renderExtraColumn,
  onSave,
}: AllocationFormProps) {
  const form = useFormContext<{ votes: Vote[] }>();

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
                  {createElement(input, {
                    name: `votes.${idx}.amount`,
                    disabled,
                    onBlur: () => onSave?.(form.getValues()),
                  })}
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
                      onSave?.(form.getValues());
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
export function AllocationForm({ ...props }: AllocationFormProps) {
  return <AllocationFormWrapper {...props} input={AllocationInput} />;
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
