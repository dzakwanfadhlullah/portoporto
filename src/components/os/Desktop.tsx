"use client";

import { useCallback, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useDesktopStore } from "@/stores/useDesktopStore";
import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { useZIndex, Z_LAYERS } from "@/hooks/useZIndex";
import { DesktopIcon } from "./DesktopIcon";

// ─── Desktop Component ──────────────────────────────────────────────────────

export const Desktop = () => {
    const icons = useDesktopStore((s) => s.icons);
    const deselectAll = useDesktopStore((s) => s.deselectAll);
    const wallpaper = useDesktopStore((s) => s.wallpaper);
    const windows = useWindowStore((s) => s.windows);
    const getApp = useAppRegistry((s) => s.getApp);
    const { getWindowZIndex } = useZIndex();

    // Derive visible windows from raw state instead of calling a computed
    // function inside a selector (which creates new refs → infinite loop)
    const visibleWindows = useMemo(
        () => Object.values(windows).filter((w) => !w.isMinimized),
        [windows]
    );

    const handleDesktopClick = useCallback(
        (e: React.MouseEvent) => {
            // Only deselect if clicking empty desktop area
            if (e.target === e.currentTarget) {
                deselectAll();
            }
        },
        [deselectAll]
    );

    const handleContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            // Context menu will be handled in a later subphase
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
                    paddingTop: 56, // below menubar
                    paddingBottom: 80, // above dock
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
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Loading...
                        </div>
                    }
                >
                    <AnimatePresence>
                        {visibleWindows.map((win) => {
                            const app = getApp(win.appId as any);
                            if (!app) return null;

                            const AppComponent = app.component;
                            return (
                                <motion.div
                                    key={win.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute pointer-events-auto"
                                    style={{
                                        left: win.position.x,
                                        top: win.position.y,
                                        width: win.size.w,
                                        height: win.size.h,
                                        zIndex: getWindowZIndex(win.zIndex),
                                    }}
                                >
                                    {/* Window chrome will be added in Subphase 3.3 */}
                                    <div className="h-full w-full rounded-os-lg bg-card shadow-os-lifted border border-border overflow-hidden">
                                        <AppComponent />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </Suspense>
            </div>
        </div>
    );
};
