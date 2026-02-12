"use client";

import { useCallback, useMemo } from "react";

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

// ─── Desktop Component ──────────────────────────────────────────────────────

export const Desktop = () => {
    const icons = useDesktopStore((s) => s.icons);
    const deselectAll = useDesktopStore((s) => s.deselectAll);
    const wallpaper = useDesktopStore((s) => s.wallpaper);
    const windows = useWindowStore((s) => s.windows);

    const visibleWindows = useMemo(
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
            className="relative h-screen w-screen overflow-hidden select-none"
            style={{ zIndex: Z_LAYERS.DESKTOP }}
        >
            {/* ── Wallpaper Background ─────────────────────────────────────── */}
            <div
                className="absolute inset-0"
                style={{ background: wallpaper }}
            />

            {/* ── Warm Wave Gradient Layers ─────────────────────────────────── */}
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    background:
                        "radial-gradient(ellipse 120% 80% at 20% 80%, rgba(198, 123, 92, 0.08) 0%, transparent 60%)",
                }}
            />
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background:
                        "radial-gradient(ellipse 100% 60% at 80% 20%, rgba(124, 156, 181, 0.06) 0%, transparent 50%)",
                }}
            />
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 80% at 60% 60%, rgba(139, 158, 126, 0.05) 0%, transparent 50%)",
                }}
            />

            {/* ── Grain Texture Overlay ─────────────────────────────────────── */}
            <div className="absolute inset-0 grain pointer-events-none" />

            {/* ── Desktop Icon Area ─────────────────────────────────────────── */}
            <div
                className="absolute inset-0"
                style={{
                    zIndex: Z_LAYERS.DESKTOP_ICONS,
                    paddingTop: 56,
                    paddingBottom: 80,
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
        </div>
    );
};

