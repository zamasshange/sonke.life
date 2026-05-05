import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * A hook that detects if the current viewport is mobile-sized.
 * Returns true if the screen width is less than 768px.
 * Handles SSR by returning false on the server and updating after mount.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Only run on client
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set initial value
    checkMobile();

    // Listen for resize events
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      // Debounce resize events for performance
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return isMobile;
}