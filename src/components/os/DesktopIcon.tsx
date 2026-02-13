"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";

import { useDesktopStore, type DesktopIcon as DesktopIconType } from "@/stores/useDesktopStore";
import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { AppleIcon } from "./AppleIcon";
import { projects } from "../apps/projects/data";
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

    // Find matching project thumbnail for "photo" style
    const project = projects.find(p => p.name === icon.label);
    const thumbnail = project?.thumbnail;

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();

            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime.current;
            lastClickTime.current = now;

            // Double-click detection (< 400ms)
            if (timeSinceLastClick < 400) {
                if (app) {
                    openWindow(
                        icon.appId,
                        app.name,
                        app.defaultWindowConfig.defaultWidth,
                        app.defaultWindowConfig.defaultHeight,
                        project ? { projectId: project.id } : undefined
                    );
                }
                deselectAll();
                return;
            }

            selectIcon(icon.appId);
        },
        [app, icon.appId, openWindow, deselectAll, selectIcon, project]
    );

    if (!app) return null;

    return (
        <motion.div
            className="absolute flex flex-col items-center gap-2 cursor-pointer group"
            style={{
                left: icon.position.x + 48, // 48 is generic desktop padding
                top: icon.position.y,
                width: 100,
            }}
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Project Card Container */}
            <div
                className={`
          relative flex items-center justify-center
          w-[84px] h-[84px] rounded-lg
          transition-all duration-300
          ${isSelected
                        ? "shadow-[0_0_0_2px_rgba(255,255,255,0.8)] border-2 border-black/20"
                        : "group-hover:translate-y-[-2px]"
                    }
        `}
            >
                {/* Premium Project Card (Photo Frame style) */}
                <div className="w-[80px] h-[80px]">
                    <AppleIcon
                        {...app.iconConfig}
                        image={thumbnail}
                        style="photo"
                        size={40}
                    />
                </div>
            </div>

            {/* Label */}
            <span
                className={`
          text-[13px] text-center font-bold tracking-tight
          max-w-[90px] truncate select-none
          transition-colors duration-200
          ${isSelected
                        ? "text-white bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-md"
                        : "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] group-hover:text-white/90"
                    }
        `}
            >
                {icon.label}
            </span>
        </motion.div>
    );
};
