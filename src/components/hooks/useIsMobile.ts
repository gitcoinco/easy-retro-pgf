import { useMemo } from "react";
import { useWindowSize } from "react-use";

const useIsMobile = (
  // Defaults at md: 768px
  breakpoint = 768,
  onChange?: (isMobile: boolean) => void,
) => {
  const { width } = useWindowSize();

  const isMobile = useMemo(() => {
    const isCurrentlyMobile = width < breakpoint;
    if (onChange) {
      onChange(isCurrentlyMobile);
    }
    return isCurrentlyMobile;
  }, [width]);

  return isMobile;
};

export default useIsMobile;
