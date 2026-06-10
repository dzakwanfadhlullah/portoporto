const prefetchedImages = new Set<string>();

export const runWhenIdle = (callback: () => void) => {
    if (typeof window === "undefined") return;

    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(callback, { timeout: 2000 });
        return;
    }

    globalThis.setTimeout(callback, 250);
};

export const preloadImage = (src?: string, fetchPriority: "high" | "low" | "auto" = "low") => {
    if (typeof document === "undefined" || !src || prefetchedImages.has(src)) return;

    prefetchedImages.add(src);

    if (fetchPriority === "high") {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        link.setAttribute("fetchpriority", fetchPriority);
        document.head.appendChild(link);
    }

    const image = new Image();
    image.decoding = "async";
    image.src = src;
};

export const preloadImages = (sources: Array<string | undefined>, fetchPriority: "high" | "low" | "auto" = "low") => {
    sources.forEach((src) => preloadImage(src, fetchPriority));
};
