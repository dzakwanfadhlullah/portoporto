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
    resetIconLayout: () => void;
    selectIcon: (appId: AppId) => void;
    toggleSelectIcon: (appId: AppId) => void;
    deselectAll: () => void;
    setWallpaper: (wallpaper: string) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GRID_GAP = 100;
const GRID_PADDING = 24;

/** Default icon positions on the desktop grid (Aligned for Right-Side Grid) */
const defaultIcons: DesktopIcon[] = [
    {
        appId: "projects",
        label: "LiftNode",
        position: { x: 0, y: 72 }, // Rightmost column
    },
    {
        appId: "about",
        label: "LuminaCal",
        position: { x: 0, y: 72 + 130 },
    },
    {
        appId: "lab",
        label: "Archive",
        position: { x: 0, y: 72 + 130 * 2 },
    },
    {
        appId: "contact",
        label: "Music",
        position: { x: 120, y: 72 }, // Second column from the right
    },
    {
        appId: "settings",
        label: "Settings",
        position: { x: 120, y: 72 + 130 },
    },
];

const DEFAULT_WALLPAPER = 'url("/macos-big.jpg")';

type PersistedDesktopState = Partial<Pick<DesktopState, "icons" | "wallpaper">>;

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

            resetIconLayout: () => {
                set({ icons: defaultIcons });
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
            version: 4,
            migrate: (persistedState) => {
                const state = persistedState as PersistedDesktopState;
                const icons = Array.isArray(state.icons) ? state.icons : defaultIcons;
                const mergedIcons = [
                    ...icons,
                    ...defaultIcons.filter(
                        (defaultIcon) => !icons.some((icon) => icon.appId === defaultIcon.appId)
                    ),
                ];

                return {
                    ...state,
                    icons: mergedIcons,
                    wallpaper: state.wallpaper ?? DEFAULT_WALLPAPER,
                };
            },
            partialize: (state) => ({
                icons: state.icons,
                wallpaper: state.wallpaper,
            }),
        }
    )
);
