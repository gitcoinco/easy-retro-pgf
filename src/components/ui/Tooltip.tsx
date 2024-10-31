import { HelpIcon } from 'public/HelpIcon';
import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
  }

export const Tooltip: React.FC<Props> = ({ children }) => (
  <div className="relative group text-gray-600">
    <HelpIcon />
    <div className="absolute right-0 mt-2 w-80 p-6 text-sm bg-[#111f22] text-[#e1e9eb] rounded-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="font-normal font-['DM Sans'] leading-normal tracking-wide">
        {children}
      </p>
      <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-[#111f22] h-3 w-3 rotate-45"></div>
    </div>
  </div>
);