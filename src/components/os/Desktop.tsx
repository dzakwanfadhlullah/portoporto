"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";

import { AnimatePresence } from "framer-motion";
import { useDesktopStore } from "@/stores/useDesktopStore";
import { useWindowStore } from "@/stores/useWindowStore";
import { Z_LAYERS } from "@/hooks/useZIndex";
import { DesktopIcon } from "./DesktopIcon";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { InfoCard } from "./InfoCard";
import { Window } from "./Window";
import { SnapOverlay } from "./SnapOverlay";
import { Spotlight } from "./Spotlight";

// ─── Desktop Component ──────────────────────────────────────────────────────

export const Desktop = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const icons = useDesktopStore((s) => s.icons);
    const deselectAll = useDesktopStore((s) => s.deselectAll);
    const wallpaper = useDesktopStore((s) => s.wallpaper);
    const windows = useWindowStore((s) => s.windows);
    const setDesktopSize = useWindowStore((s) => s.setDesktopSize);

    // Sync container size with store
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDesktopSize({ w: width, h: height });
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [setDesktopSize]);

    const visibleWindows = useMemo(
        /* SAME */
        () => Object.values(windows).filter((w) => !w.isMinimized),
        [windows]
    );

    const handleDesktopClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                deselectAll();
            }
        },
        [deselectAll]
    );

    const handleContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
        },
        []
    );

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full overflow-hidden select-none vibrant-wallpaper"
            style={{ zIndex: Z_LAYERS.DESKTOP }}
        >
            {/* ── Desktop Texture Overlay ─────────────────────────────────────── */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] grain pointer-events-none" />

            {/* ── Desktop Icon Area ─────────────────────────────────────────── */}
            <div
                className="absolute inset-0"
                style={{
                    zIndex: Z_LAYERS.DESKTOP_ICONS,
                }}
                onClick={handleDesktopClick}
                onContextMenu={handleContextMenu}
            >
                {icons.map((icon) => (
                    <DesktopIcon key={icon.appId} icon={icon} />
                ))}
            </div>

            {/* ── Windows Layer ─────────────────────────────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: Z_LAYERS.WINDOWS_BASE }}
            >
                <AnimatePresence>
                    {visibleWindows.map((win) => (
                        <Window key={win.id} windowId={win.id} />
                    ))}
                </AnimatePresence>
            </div>

            {/* ── Shell Components ─────────────────────────────────────────── */}
            <MenuBar />
            <InfoCard />
            <SnapOverlay />
            <Dock />
            <Spotlight />
        </div>
    );
};

