import { useState, useEffect } from "react";

const useAnchorPosition = (anchorEl: any) => {
  const [position, setPosition] = useState<
    | {
        top: number;
        left: number;
      }
    | undefined
  >(undefined);

  const updatePosition = () => {
    if (anchorEl) {
      const rect = anchorEl.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [anchorEl]);

  return position;
};

export default useAnchorPosition;