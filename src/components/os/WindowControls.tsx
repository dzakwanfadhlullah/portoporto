"use client";

import { useCallback, useState } from "react";
import { X, Minus, Maximize2 } from "lucide-react";

import { useWindowStore } from "@/stores/useWindowStore";
import type { WindowId } from "@/types/window";

// ─── Props ───────────────────────────────────────────────────────────────────

interface WindowControlsProps {
    windowId: WindowId;
    title: string;
    isMaximized: boolean;
    headerActions?: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const WindowControls = ({
    windowId,
    title,
    isMaximized,
    headerActions,
}: WindowControlsProps) => {
    const closeWindow = useWindowStore((s) => s.closeWindow);
    const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
    const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
    const restoreWindow = useWindowStore((s) => s.restoreWindow);

    const [isHovering, setIsHovering] = useState(false);

    const handleClose = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            closeWindow(windowId);
        },
        [closeWindow, windowId]
    );

    const handleMinimize = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            minimizeWindow(windowId);
        },
        [minimizeWindow, windowId]
    );

    const handleMaximizeToggle = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isMaximized) {
                restoreWindow(windowId);
            } else {
                maximizeWindow(windowId);
            }
        },
        [isMaximized, maximizeWindow, restoreWindow, windowId]
    );

    return (
        <div
            className="flex items-center h-10 px-3.5 select-none shrink-0
                 bg-card/80 border-b border-border/40"
            // Prevent drag from being triggered by clicking controls
            onMouseDown={(e) => e.stopPropagation()}
        >
            {/* ── Traffic Light Buttons ──────────────────────────────────── */}
            <div
                className="flex items-center gap-[7px]"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Close */}
                <button
                    onClick={handleClose}
                    className="group w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF4136]
                     flex items-center justify-center transition-colors duration-100"
                    aria-label="Close"
                >
                    {isHovering && (
                        <X
                            size={8}
                            strokeWidth={2.5}
                            className="text-[#4A0002] opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    )}
                </button>

                {/* Minimize */}
                <button
                    onClick={handleMinimize}
                    className="group w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#F5A623]
                     flex items-center justify-center transition-colors duration-100"
                    aria-label="Minimize"
                >
                    {isHovering && (
                        <Minus
                            size={8}
                            strokeWidth={2.5}
                            className="text-[#6B3A00] opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    )}
                </button>

                {/* Maximize / Restore */}
                <button
                    onClick={handleMaximizeToggle}
                    className="group w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#1AAB29]
                     flex items-center justify-center transition-colors duration-100"
                    aria-label={isMaximized ? "Restore" : "Maximize"}
                >
                    {isHovering && (
                        <Maximize2
                            size={7}
                            strokeWidth={2.5}
                            className="text-[#0A5600] opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    )}
                </button>
            </div>

            {/* ── Window Title ───────────────────────────────────────────── */}
            <div className="flex-1 flex justify-center">
                <span className="text-xs font-semibold text-foreground/70 truncate max-w-[200px]">
                    {title}
                </span>
            </div>

            {/* ── Header Actions (Slot for Sub-apps) ────────────────────────── */}
            <div className="flex items-center gap-1.5 min-w-[52px] justify-end">
                {headerActions}
            </div>
        </div>
    );
};
