import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AppId } from "@/types/app";
import type { Position } from "@/types/window";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DesktopIcon {
    appId: AppId;
    position: Position;
    label: string;
}

interface DesktopState {
    icons: DesktopIcon[];
    selectedIcons: AppId[];
    wallpaper: string;

    // Actions
    moveIcon: (appId: AppId, position: Position) => void;
    selectIcon: (appId: AppId) => void;
    toggleSelectIcon: (appId: AppId) => void;
    deselectAll: () => void;
    setWallpaper: (wallpaper: string) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GRID_GAP = 100;
const GRID_PADDING = 24;

/** Default icon positions on the desktop grid (Aligned for Right Sidebar as per Safari Chrome Ref) */
const defaultIcons: DesktopIcon[] = [
    {
        appId: "projects",
        label: "LiftNode",
        position: { x: 0, y: 72 }, // Grid handled by Right Sidebar logic in DesktopIcon
    },
    {
        appId: "about",
        label: "LuminaCal",
        position: { x: 0, y: 72 + 110 },
    },
    {
        appId: "lab",
        label: "Archive",
        position: { x: 0, y: 72 + 110 * 2 },
    },
    {
        appId: "leadership",
        label: "KPI Dashboard",
        position: { x: 0, y: 72 + 110 * 3 },
    },
    {
        appId: "contact",
        label: "Maqdis System",
        position: { x: 0, y: 72 + 110 * 4 },
    },
];

const DEFAULT_WALLPAPER =
    "linear-gradient(135deg, #F5EFE6 0%, #EDE4D3 50%, #E8DFD1 100%)";

// ─── Store ───────────────────────────────────────────────────────────────────

export const useDesktopStore = create<DesktopState>()(
    persist(
        (set, get) => ({
            icons: defaultIcons,
            selectedIcons: [],
            wallpaper: DEFAULT_WALLPAPER,

            moveIcon: (appId, position) => {
                set({
                    icons: get().icons.map((icon) =>
                        icon.appId === appId ? { ...icon, position } : icon
                    ),
                });
            },

            selectIcon: (appId) => {
                set({ selectedIcons: [appId] });
            },

            toggleSelectIcon: (appId) => {
                const current = get().selectedIcons;
                if (current.includes(appId)) {
                    set({ selectedIcons: current.filter((id) => id !== appId) });
                } else {
                    set({ selectedIcons: [...current, appId] });
                }
            },

            deselectAll: () => {
                set({ selectedIcons: [] });
            },

            setWallpaper: (wallpaper) => {
                set({ wallpaper });
            },
        }),
        {
            name: "dzakos-desktop-v2",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                icons: state.icons,
                wallpaper: state.wallpaper,
            }),
        }
    )
);
