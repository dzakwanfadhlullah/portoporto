"use client";

import { useCallback, Suspense } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { useZIndex } from "@/hooks/useZIndex";
import { useWindowSnap } from "@/hooks/useWindowSnap";
import { WindowControls } from "./WindowControls";
import { WindowContext } from "./WindowContext";
import type { WindowId } from "@/types/window";
import type { AppId } from "@/types/app";
import { useState, type ReactNode } from "react";

// ─── Props ───────────────────────────────────────────────────────────────────

interface WindowProps {
    windowId: WindowId;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Window = ({ windowId }: WindowProps) => {
    const win = useWindowStore((s) => s.windows[windowId]);
    const focusWindow = useWindowStore((s) => s.focusWindow);
    const moveWindow = useWindowStore((s) => s.moveWindow);
    const resizeWindow = useWindowStore((s) => s.resizeWindow);
    const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
    const restoreWindow = useWindowStore((s) => s.restoreWindow);

    const getApp = useAppRegistry((s) => s.getApp);
    const { getWindowZIndex } = useZIndex();
    const { handleDrag, handleDragStop } = useWindowSnap(windowId);

    const [headerActions, setHeaderActions] = useState<ReactNode>(null);

    if (!win) return null;

    const app = getApp(win.appId as AppId);
    if (!app) return null;

    const AppComponent = app.component;
    const config = app.defaultWindowConfig;

    const handleFocus = () => {
        focusWindow(windowId);
    };

    const handleDoubleClickTitle = () => {
        if (win.isMaximized) {
            restoreWindow(windowId);
        } else {
            maximizeWindow(windowId);
        }
    };

    return (
        <WindowContext.Provider value={{ setHeaderActions, metadata: win.metadata }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: getWindowZIndex(win.zIndex),
                    pointerEvents: "none",
                }}
            >
                <Rnd
                    position={{ x: win.position.x, y: win.position.y }}
                    size={{ width: win.size.w, height: win.size.h }}
                    minWidth={config.minWidth}
                    minHeight={config.minHeight}
                    maxWidth={config.maxWidth}
                    maxHeight={config.maxHeight}
                    dragHandleClassName="window-drag-handle"
                    enableResizing={config.resizable && !win.isMaximized}
                    disableDragging={!config.draggable || win.isMaximized}
                    bounds="parent"
                    style={{
                        pointerEvents: "auto",
                    }}
                    onMouseDown={handleFocus}
                    onDrag={handleDrag}
                    onDragStop={(_e: any, d: any) => {
                        moveWindow(windowId, { x: d.x, y: d.y });
                        handleDragStop();
                    }}
                    onResizeStop={(_e: any, _dir: any, ref: any, _delta: any, position: any) => {
                        resizeWindow(windowId, {
                            w: parseInt(ref.style.width, 10),
                            h: parseInt(ref.style.height, 10),
                        });
                        moveWindow(windowId, { x: position.x, y: position.y });
                    }}
                    className={`
                    rounded-[16px] overflow-hidden flex flex-col
                    border border-border/40
                    bg-card
                    transition-all duration-300
                    ${win.isFocused
                            ? "shadow-os-window scale-[1.002]"
                            : "shadow-os-medium opacity-90 scale-100"
                        }
                `}
                    resizeHandleStyles={{
                        top: { cursor: "n-resize" },
                        right: { cursor: "e-resize" },
                        bottom: { cursor: "s-resize" },
                        left: { cursor: "w-resize" },
                        topRight: { cursor: "ne-resize" },
                        topLeft: { cursor: "nw-resize" },
                        bottomRight: { cursor: "se-resize" },
                        bottomLeft: { cursor: "sw-resize" },
                    }}
                >
                    {/* ── Title Bar ───────────────────────────────────────────────── */}
                    {!config.hideTitleBar && (
                        <div
                            className="window-drag-handle cursor-grab active:cursor-grabbing"
                            onDoubleClick={handleDoubleClickTitle}
                        >
                            <WindowControls
                                windowId={windowId}
                                title={win.title}
                                isMaximized={win.isMaximized}
                                headerActions={headerActions}
                            />
                        </div>
                    )}

                    {/* ── Content Area ────────────────────────────────────────────── */}
                    <div className="flex-1 overflow-auto">
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    Loading...
                                </div>
                            }
                        >
                            <AppComponent />
                        </Suspense>
                    </div>
                </Rnd>
            </motion.div>
        </WindowContext.Provider>
    );
};
