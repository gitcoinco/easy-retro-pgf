import { useState, useEffect } from "react";

const useIsMobile = (
  // Defaults at md: 768px
  breakpoint = 768,
  onChange?: (isMobile: boolean) => void,
) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth < breakpoint;
      setIsMobile(isCurrentlyMobile);
      if (onChange) {
        onChange(isCurrentlyMobile);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint, onChange]);

  return isMobile;
};

export default useIsMobile;
