"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";

import { useDesktopStore, type DesktopIcon as DesktopIconType } from "@/stores/useDesktopStore";
import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import type { AppId } from "@/types/app";

// ─── Props ───────────────────────────────────────────────────────────────────

interface DesktopIconProps {
    icon: DesktopIconType;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const DesktopIcon = ({ icon }: DesktopIconProps) => {
    const { selectedIcons, selectIcon, deselectAll } = useDesktopStore();
    const { openWindow } = useWindowStore();
    const { getApp } = useAppRegistry();
    const lastClickTime = useRef(0);

    const app = getApp(icon.appId);
    const isSelected = selectedIcons.includes(icon.appId);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();

            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime.current;
            lastClickTime.current = now;

            // Double-click detection (< 400ms)
            if (timeSinceLastClick < 400) {
                // Open the app window
                if (app) {
                    openWindow(
                        icon.appId,
                        app.name,
                        app.defaultWindowConfig.defaultWidth,
                        app.defaultWindowConfig.defaultHeight
                    );
                }
                deselectAll();
                return;
            }

            // Single click — select
            if (e.ctrlKey || e.metaKey) {
                // Multi-select with Ctrl/Cmd
                useDesktopStore.getState().toggleSelectIcon(icon.appId);
            } else {
                selectIcon(icon.appId);
            }
        },
        [app, icon.appId, openWindow, deselectAll, selectIcon]
    );

    if (!app) return null;

    return (
        <motion.div
            className="absolute flex flex-col items-center gap-1.5 cursor-pointer group"
            style={{
                left: icon.position.x,
                top: icon.position.y,
                width: 80,
            }}
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Icon Container */}
            <div
                className={`
          relative flex items-center justify-center
          w-14 h-14 rounded-os-md
          transition-all duration-200 ease-out
          ${isSelected
                        ? "bg-accent-terracotta/15 shadow-os-medium ring-1 ring-accent-terracotta/30"
                        : "bg-card/60 shadow-os-soft hover:shadow-os-medium hover:bg-card/80"
                    }
        `}
            >
                <div className="text-foreground/80 group-hover:text-foreground transition-colors">
                    {app.icon}
                </div>
            </div>

            {/* Label */}
            <span
                className={`
          text-[11px] leading-tight text-center font-medium
          max-w-[76px] truncate select-none
          transition-colors duration-200
          ${isSelected
                        ? "text-foreground"
                        : "text-foreground/70 group-hover:text-foreground/90"
                    }
        `}
            >
                {icon.label}
            </span>

            {/* Selected indicator dot */}
            {isSelected && (
                <motion.div
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-accent-terracotta"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
        </motion.div>
    );
};
