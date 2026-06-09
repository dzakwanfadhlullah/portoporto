"use client";

import { useEffect } from "react";
import type { ElementType } from "react";
import {
    Brush,
    FolderPlus,
    Info,
    LayoutGrid,
    Maximize2,
    Monitor,
    RotateCcw,
    Search,
    Settings,
} from "lucide-react";

import { Z_LAYERS } from "@/hooks/useZIndex";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { useDesktopStore } from "@/stores/useDesktopStore";
import { useSpotlightStore } from "@/stores/useSpotlightStore";
import { useWindowStore } from "@/stores/useWindowStore";
import type { AppId } from "@/types/app";

type DesktopContextMenuTarget =
    | { type: "desktop" }
    | { type: "icon"; appId: AppId; label: string };

interface DesktopContextMenuProps {
    x: number;
    y: number;
    target: DesktopContextMenuTarget;
    onClose: () => void;
}

const WALLPAPERS = [
    'url("/macos-big.jpg")',
    'linear-gradient(135deg, #17203f 0%, #784ba0 46%, #d85454 100%)',
    'radial-gradient(circle at 18% 18%, rgba(124,156,181,0.95), transparent 34%), radial-gradient(circle at 78% 28%, rgba(198,123,92,0.9), transparent 32%), linear-gradient(135deg, #1d2248 0%, #5f477f 52%, #b74754 100%)',
];

export const ContextMenu = ({ x, y, target, onClose }: DesktopContextMenuProps) => {
    const getApp = useAppRegistry((s) => s.getApp);
    const openWindow = useWindowStore((s) => s.openWindow);
    const minimizeAll = useWindowStore((s) => s.minimizeAll);
    const closeAll = useWindowStore((s) => s.closeAll);
    const resetIconLayout = useDesktopStore((s) => s.resetIconLayout);
    const setWallpaper = useDesktopStore((s) => s.setWallpaper);
    const toggleSpotlight = useSpotlightStore((s) => s.toggle);

    useEffect(() => {
        const handlePointerDown = () => onClose();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const openTargetApp = () => {
        if (target.type !== "icon") return;

        const app = getApp(target.appId);
        if (!app) return;

        openWindow(
            app.id,
            app.name,
            app.defaultWindowConfig.defaultWidth,
            app.defaultWindowConfig.defaultHeight
        );
        onClose();
    };

    const rotateWallpaper = () => {
        const next = WALLPAPERS[Math.floor(Math.random() * WALLPAPERS.length)];
        if (next) setWallpaper(next);
        onClose();
    };

    return (
        <div
            className="fixed min-w-[220px] overflow-hidden rounded-xl border border-white/30 bg-white/70 p-1.5 text-[13px] font-medium text-black/80 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
            style={{
                left: x,
                top: y,
                zIndex: Z_LAYERS.CONTEXT_MENU,
            }}
            onPointerDown={(event) => event.stopPropagation()}
        >
            {target.type === "icon" ? (
                <>
                    <MenuItem icon={Maximize2} label={`Open ${target.label}`} onClick={openTargetApp} />
                    <MenuItem icon={Info} label="Get Info" onClick={openTargetApp} />
                    <MenuSeparator />
                    <MenuItem icon={Search} label="Reveal in Spotlight" onClick={() => { toggleSpotlight(); onClose(); }} />
                </>
            ) : (
                <>
                    <MenuItem icon={FolderPlus} label="New Folder" disabled />
                    <MenuItem icon={LayoutGrid} label="Clean Up Icons" onClick={() => { resetIconLayout(); onClose(); }} />
                    <MenuItem icon={Brush} label="Change Wallpaper" onClick={rotateWallpaper} />
                    <MenuSeparator />
                    <MenuItem icon={Search} label="Spotlight Search" onClick={() => { toggleSpotlight(); onClose(); }} />
                    <MenuItem icon={Monitor} label="Minimize All Windows" onClick={() => { minimizeAll(); onClose(); }} />
                    <MenuItem icon={RotateCcw} label="Close All Windows" onClick={() => { closeAll(); onClose(); }} />
                    <MenuSeparator />
                    <MenuItem icon={Settings} label="Desktop View Options" disabled />
                </>
            )}
        </div>
    );
};

type MenuItemProps = {
    icon: ElementType;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
};

function MenuItem({ icon: Icon, label, onClick, disabled }: MenuItemProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/70 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
        >
            <Icon size={15} strokeWidth={2.2} className="text-black/45" />
            <span className="flex-1 truncate">{label}</span>
        </button>
    );
}

function MenuSeparator() {
    return <div className="my-1 h-px bg-black/10" />;
}
