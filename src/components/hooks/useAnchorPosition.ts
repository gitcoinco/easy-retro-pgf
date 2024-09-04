import { useState, useEffect, MutableRefObject, use } from "react";
import { useEvent } from "react-use";

const useAnchorPosition = (anchorEl: MutableRefObject<HTMLElement | null>) => {
  const [position, setPosition] = useState<
    | {
        top: number;
        left: number;
      }
    | undefined
  >(undefined);

  const updatePosition = () => {
    if (anchorEl.current) {
      const rect = anchorEl.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    updatePosition();
  }, [anchorEl.current]);

  useEvent("resize", updatePosition);
  useEvent("scroll", updatePosition);
  useEvent("mousemove", updatePosition);
  

  return position;
};

export default useAnchorPosition;
