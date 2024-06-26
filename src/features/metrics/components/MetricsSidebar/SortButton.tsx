import React, { useMemo } from "react";
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from "lucide-react";

type SortButtonProps = {
  onClick: () => void;
  sortAscending: boolean;
};

export function SortButton({ onClick, sortAscending }: SortButtonProps) {
  const Icon = useMemo(
    () => (sortAscending ? ArrowUpWideNarrow : ArrowDownNarrowWide),
    [sortAscending],
  );
  const text = useMemo(
    () => (sortAscending ? "Ascending" : "Descending"),
    [sortAscending],
  );

  return (
    <button
      onClick={onClick}
      className="
        ring-offset-background 
        focus-visible:ring-ring 
        hover:bg-accent 
        hover:text-accent-foreground 
        min-w-2/5 
        inline-flex 
        h-8 
        items-center 
        justify-center 
        whitespace-nowrap 
        rounded-md 
        px-2  
        text-xs 
        font-medium 
        transition-colors 
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-offset-2 
        disabled:pointer-events-none 
        disabled:opacity-50
      "
    >
      <>
        {text}
        {<Icon className="ml-2 size-4" />}
      </>
    </button>
  );
}
