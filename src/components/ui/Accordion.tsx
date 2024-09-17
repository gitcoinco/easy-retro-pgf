import React, { useState, ReactNode } from 'react';
import { Button } from './Button'; // Adjust the import path as needed
import { ChevronUp, ChevronDown } from 'lucide-react'; // Adjust the icon library as needed

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded border-gray-400">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-between gap-3 rounded py-2 px-3 hover:bg-gray-100"
      >
        <div>{title}</div>
        <div className="flex items-center">
          <Button variant="ghost" icon={isOpen ? ChevronUp : ChevronDown} />
        </div>
      </div>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
}