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
                right: icon.position.x + 48, // Now relative to the right edge
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
          w-[84px] h-[84px] rounded-xl
          transition-all duration-300
          ${isSelected
                        ? "bg-black/20"
                        : "group-hover:translate-y-[-2px]"
                    }
        `}
            >
                {/* Premium Project Card (Photo Frame style) */}
                <div className="w-[72px] h-[72px]">
                    <AppleIcon
                        {...app.iconConfig}
                        {...project?.iconConfig}
                        image={thumbnail}
                        style="photo"
                        color="transparent"
                        size={40}
                        isActive={isSelected}
                    />
                </div>
            </div>

            {/* Label */}
            <span
                className={`
          text-[13px] text-center tracking-tight
          max-w-[90px] truncate select-none leading-tight py-[1px] px-[4px]
          transition-colors duration-200 rounded-[4px] font-medium
          ${isSelected
                        ? "text-white bg-[#0B58DA]"
                        : "text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(0,0,0,0.5)]"
                    }
        `}
            >
                {icon.label}
            </span>
        </motion.div>
    );
};
