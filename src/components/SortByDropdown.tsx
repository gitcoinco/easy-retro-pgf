import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/Button";
import { ArrowUpDown, Check } from "lucide-react";
import { type SortType, sortLabels } from "~/features/filter/hooks/useFilter";
import dynamic from "next/dynamic";

type Props = {
  value: SortType;
  onChange: (value: string) => void;
  options: SortType[];
};

const SortByDropdown = ({ value, onChange, options = [] }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="outline-none">
        <Button
          icon={ArrowUpDown}
          variant="outline"
          aria-label="Sort by"
          className="w-48 justify-center"
        >
          Sort by: {value && sortLabels[value]}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 w-[200px] font-kumbhSans rounded-xl border border-gray-300 bg-white p-2 dark:border-onSurfaceVariant-dark dark:bg-surfaceContainerLow-dark dark:text-white"
          sideOffset={5}
        >
          <DropdownMenu.Label className="dark:gray-500 p-2 text-xs font-semibold uppercase text-onSurfaceVariant-dark">
            Sort By
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={(v) => onChange(v)}
          >
            {options.map((value) => (
              <RadioItem key={value} value={value} label={sortLabels[value]} />
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const RadioItem = ({ value = "", label = "" }) => (
  <DropdownMenu.RadioItem
    className="cursor-pointer rounded p-2 pl-8 text-sm text-gray-900 outline-none hover:bg-gray-100 focus-visible:ring-0 dark:text-gray-300 dark:hover:bg-surfaceContainerLow-dark"
    value={value}
  >
    <DropdownMenu.ItemIndicator className="absolute left-4">
      <Check className="h-4 w-4" />
    </DropdownMenu.ItemIndicator>
    {label}
  </DropdownMenu.RadioItem>
);

export default dynamic(async () => await SortByDropdown, { ssr: false });
