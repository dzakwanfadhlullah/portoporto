"use client";

import { useCallback, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

import { useDesktopStore, type DesktopIcon as DesktopIconType } from "@/stores/useDesktopStore";
import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { AppleIcon } from "./AppleIcon";
import { projects } from "../apps/projects/data";

// ─── Props ───────────────────────────────────────────────────────────────────

interface DesktopIconProps {
    icon: DesktopIconType;
    desktopRef: React.RefObject<HTMLDivElement | null>;
    onContextMenu?: (event: React.MouseEvent, icon: DesktopIconType) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const DesktopIcon = ({ icon, desktopRef, onContextMenu }: DesktopIconProps) => {
    const { selectedIcons, selectIcon, toggleSelectIcon, deselectAll, moveIcon } = useDesktopStore();
    const { openWindow } = useWindowStore();
    const { getApp } = useAppRegistry();
    const lastClickTime = useRef(0);
    const iconRef = useRef<HTMLDivElement>(null);
    const ignoreNextClick = useRef(false);
    const dragX = useMotionValue(0);
    const dragY = useMotionValue(0);

    const app = icon.appId ? getApp(icon.appId) : undefined;
    const project = icon.projectId
        ? projects.find((item) => item.id === icon.projectId)
        : projects.find((item) => item.name === icon.label);
    const projectDetailApp = getApp("project-detail");
    const isSelected = selectedIcons.includes(icon.id);

    const iconConfig = project
        ? {
            ...projectDetailApp?.iconConfig,
            ...project.iconConfig,
            image: project.thumbnail,
            style: "photo" as const,
            color: "transparent",
        }
        : app?.iconConfig;

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (ignoreNextClick.current) {
                ignoreNextClick.current = false;
                return;
            }

            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime.current;
            lastClickTime.current = now;

            // Double-click detection (< 400ms)
            if (timeSinceLastClick < 400) {
                if (project && projectDetailApp) {
                    openWindow(
                        "project-detail",
                        `Information about: ${project.name}`,
                        projectDetailApp.defaultWindowConfig.defaultWidth,
                        projectDetailApp.defaultWindowConfig.defaultHeight,
                        { projectId: project.id }
                    );
                } else if (app && icon.appId) {
                    openWindow(
                        icon.appId,
                        app.name,
                        app.defaultWindowConfig.defaultWidth,
                        app.defaultWindowConfig.defaultHeight,
                    );
                }
                deselectAll();
                return;
            }

            if (e.metaKey || e.ctrlKey || e.shiftKey) {
                toggleSelectIcon(icon.id);
            } else {
                selectIcon(icon.id);
            }
        },
        [app, icon.appId, icon.id, openWindow, deselectAll, selectIcon, toggleSelectIcon, project, projectDetailApp]
    );

    const handleDragEnd = useCallback(
        (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
            if (Math.abs(info.offset.x) > 4 || Math.abs(info.offset.y) > 4) {
                ignoreNextClick.current = true;
            }

            const desktopBounds = desktopRef.current?.getBoundingClientRect();
            const iconBounds = iconRef.current?.getBoundingClientRect();
            if (!desktopBounds || !iconBounds) return;

            const nextX = Math.max(
                0,
                Math.min(desktopBounds.width - 124, desktopBounds.right - iconBounds.right - 48)
            );
            const nextY = Math.max(
                44,
                Math.min(desktopBounds.height - 150, iconBounds.top - desktopBounds.top)
            );

            dragX.set(0);
            dragY.set(0);
            moveIcon(icon.id, { x: Math.round(nextX), y: Math.round(nextY) });
        },
        [desktopRef, dragX, dragY, icon.id, moveIcon]
    );

    if (!iconConfig) return null;

    return (
        <motion.div
            ref={iconRef}
            className="absolute flex flex-col items-center gap-2 cursor-default group"
            style={{
                right: icon.position.x + 48, // Now relative to the right edge
                top: icon.position.y,
                width: 100,
                x: dragX,
                y: dragY,
            }}
            drag
            dragConstraints={desktopRef}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            onContextMenu={(event) => onContextMenu?.(event, icon)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            whileDrag={{ scale: 1.07 }}
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
                        {...iconConfig}
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
