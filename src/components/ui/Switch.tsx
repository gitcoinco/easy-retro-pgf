import React from "react";
import { Check, X } from "lucide-react";

export const Switch = ({
  isOn,
  setIsOn,
}: {
  isOn: boolean;
  setIsOn: () => void;
}) => {
  return (
    <div
      onClick={setIsOn}
      className={` relative flex h-8 w-14 cursor-pointer items-center rounded-full ${!isOn ? "border-2 border-outline-dark bg-background-dark" : "bg-primary-dark"}  p-1 transition`}
    >
      <div
        className={` absolute flex h-6 w-6 items-center justify-center rounded-full  transition-transform ${
          isOn
            ? " right-7 h-7 w-7 translate-x-6 bg-primaryContainer-dark"
            : " bg-outline-dark"
        }`}
      >
        {isOn ? (
          <Check className=" h-4 w-4" />
        ) : (
          <X className=" h-4 w-4 stroke-surfaceContainerHigh-dark" />
        )}
      </div>
    </div>
  );
};
