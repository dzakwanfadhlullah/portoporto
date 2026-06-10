"use client";

import { useCallback, useMemo, useRef, useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import { useDesktopStore } from "@/stores/useDesktopStore";
import { useWindowStore } from "@/stores/useWindowStore";
import { Z_LAYERS } from "@/hooks/useZIndex";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { DesktopIcon } from "./DesktopIcon";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { InfoCard } from "./InfoCard";
import { Window } from "./Window";
import { SnapOverlay } from "./SnapOverlay";
import { Spotlight } from "./Spotlight";
import { ContextMenu } from "./ContextMenu";
import { ThemeBridge } from "./ThemeBridge";
import type { DesktopIcon as DesktopIconType } from "@/stores/useDesktopStore";

// ─── Desktop Component ──────────────────────────────────────────────────────

export const Desktop = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const iconLayerRef = useRef<HTMLDivElement>(null);
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        target: { type: "desktop" } | { type: "icon"; icon: DesktopIconType };
    } | null>(null);
    const icons = useDesktopStore((s) => s.icons);
    const deselectAll = useDesktopStore((s) => s.deselectAll);
    const wallpaper = useDesktopStore((s) => s.wallpaper);
    const windows = useWindowStore((s) => s.windows);
    const setDesktopSize = useWindowStore((s) => s.setDesktopSize);

    useKeyboardShortcuts();

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

    const allWindows = useMemo(
        () => Object.values(windows),
        [windows]
    );

    const handleDesktopClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                setContextMenu(null);
                deselectAll();
            }
        },
        [deselectAll]
    );

    const handleContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setContextMenu({
                x: e.clientX,
                y: e.clientY,
                target: { type: "desktop" },
            });
        },
        []
    );

    const handleIconContextMenu = useCallback(
        (e: React.MouseEvent, icon: DesktopIconType) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({
                x: e.clientX,
                y: e.clientY,
                target: { type: "icon", icon },
            });
        },
        []
    );

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full overflow-hidden select-none vibrant-wallpaper"
            style={{ zIndex: Z_LAYERS.DESKTOP, backgroundImage: wallpaper }}
        >
            <ThemeBridge />
            {/* ── Desktop Texture Overlay ─────────────────────────────────────── */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] grain pointer-events-none" />

            {/* ── Desktop Icon Area ─────────────────────────────────────────── */}
            <div
                ref={iconLayerRef}
                className="absolute inset-0"
                style={{
                    zIndex: Z_LAYERS.DESKTOP_ICONS,
                }}
                onClick={handleDesktopClick}
                onContextMenu={handleContextMenu}
            >
                {icons.map((icon) => (
                    <DesktopIcon
                        key={icon.id}
                        icon={icon}
                        desktopRef={iconLayerRef}
                        onContextMenu={handleIconContextMenu}
                    />
                ))}
            </div>

            {/* ── Windows Layer ─────────────────────────────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: Z_LAYERS.WINDOWS_BASE }}
            >
                <AnimatePresence>
                    {allWindows.map((win) => (
                        <div
                            key={win.id}
                            style={{
                                display: win.isMinimized ? "none" : "block",
                                pointerEvents: "none",
                            }}
                        >
                            <Window windowId={win.id} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            {/* ── Shell Components ─────────────────────────────────────────── */}
            <MenuBar />
            <InfoCard />
            <SnapOverlay />
            <Dock />
            <Spotlight />
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    target={contextMenu.target}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
};

