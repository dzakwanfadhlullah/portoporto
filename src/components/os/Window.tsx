"use client";

import { useCallback, Suspense } from "react";
import { Rnd } from "react-rnd";

import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { useZIndex } from "@/hooks/useZIndex";
import { WindowControls } from "./WindowControls";
import type { WindowId } from "@/types/window";
import type { AppId } from "@/types/app";

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
    const getApp = useAppRegistry((s) => s.getApp);
    const { getWindowZIndex } = useZIndex();

    if (!win) return null;

    const app = getApp(win.appId as AppId);
    if (!app) return null;

    const AppComponent = app.component;
    const config = app.defaultWindowConfig;

    const handleFocus = () => {
        focusWindow(windowId);
    };

    return (
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
                zIndex: getWindowZIndex(win.zIndex),
                pointerEvents: "auto",
            }}
            onMouseDown={handleFocus}
            onDragStop={(_e, d) => {
                moveWindow(windowId, { x: d.x, y: d.y });
            }}
            onResizeStop={(_e, _dir, ref, _delta, position) => {
                resizeWindow(windowId, {
                    w: parseInt(ref.style.width, 10),
                    h: parseInt(ref.style.height, 10),
                });
                moveWindow(windowId, { x: position.x, y: position.y });
            }}
            className={`
        rounded-[16px] overflow-hidden flex flex-col
        shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]
        border border-border/40
        transition-shadow duration-200
        ${win.isFocused
                    ? "shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)]"
                    : "shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.03)]"
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
            <div className="window-drag-handle cursor-grab active:cursor-grabbing">
                <WindowControls
                    windowId={windowId}
                    title={win.title}
                    isMaximized={win.isMaximized}
                />
            </div>

            {/* ── Content Area ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-auto bg-card">
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
    );
};
