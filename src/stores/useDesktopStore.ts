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

/** Default icon positions on the desktop grid */
const defaultIcons: DesktopIcon[] = [
    {
        appId: "projects",
        label: "Projects",
        position: { x: GRID_PADDING, y: GRID_PADDING + 48 },
    },
    {
        appId: "about",
        label: "About Me",
        position: { x: GRID_PADDING, y: GRID_PADDING + 48 + GRID_GAP },
    },
    {
        appId: "lab",
        label: "Lab",
        position: { x: GRID_PADDING, y: GRID_PADDING + 48 + GRID_GAP * 2 },
    },
    {
        appId: "leadership",
        label: "Leadership",
        position: { x: GRID_PADDING, y: GRID_PADDING + 48 + GRID_GAP * 3 },
    },
    {
        appId: "contact",
        label: "Contact",
        position: { x: GRID_PADDING, y: GRID_PADDING + 48 + GRID_GAP * 4 },
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
            name: "dzakos-desktop-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                icons: state.icons,
                wallpaper: state.wallpaper,
            }),
        }
    )
);
