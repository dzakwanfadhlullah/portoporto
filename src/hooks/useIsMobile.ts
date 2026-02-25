import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 768) {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Only run on the client
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        // Set initial value
        setIsMobile(mediaQuery.matches);

        // Event listener for subsequent changes
        const handler = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        // Modern browser support (addEventListener) vs older browsers (addListener)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handler);
        } else {
            mediaQuery.addListener(handler);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handler);
            } else {
                mediaQuery.removeListener(handler);
            }
        };
    }, [breakpoint]);

    return isMobile;
}
