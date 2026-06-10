import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AppId } from "@/types/app";
import type { Position } from "@/types/window";
import { projects } from "@/components/apps/projects/data";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DesktopIcon {
    id: string;
    kind: "app" | "project" | "folder";
    appId?: AppId;
    projectId?: string;
    position: Position;
    label: string;
}

interface DesktopState {
    icons: DesktopIcon[];
    selectedIcons: string[];
    wallpaper: string;

    // Actions
    moveIcon: (id: string, position: Position) => void;
    resetIconLayout: () => void;
    selectIcon: (id: string) => void;
    toggleSelectIcon: (id: string) => void;
    deselectAll: () => void;
    setWallpaper: (wallpaper: string) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Default icon positions on the desktop grid (Aligned for Right-Side Grid) */
const defaultIcons: DesktopIcon[] = [
    {
        id: "project-liftnode",
        kind: "project",
        projectId: "liftnode",
        label: "LiftNode",
        position: { x: 0, y: 72 },
    },
    {
        id: "project-luminacal",
        kind: "project",
        projectId: "luminacal",
        label: "LuminaCal",
        position: { x: 0, y: 72 + 130 },
    },
    {
        id: "folder-archive",
        kind: "folder",
        appId: "lab",
        label: "Archive",
        position: { x: 0, y: 72 + 130 * 2 },
    },
    {
        id: "app-music",
        kind: "app",
        appId: "contact",
        label: "Music",
        position: { x: 120, y: 72 },
    },
    {
        id: "app-projects",
        kind: "app",
        appId: "projects",
        label: "Projects",
        position: { x: 120, y: 72 + 130 },
    },
    {
        id: "app-about",
        kind: "app",
        appId: "about",
        label: "About Me",
        position: { x: 120, y: 72 + 130 * 2 },
    },
    {
        id: "project-bongkarops",
        kind: "project",
        projectId: "bongkarops",
        label: "BongkarOps",
        position: { x: 240, y: 72 },
    },
    {
        id: "project-kelaskampus",
        kind: "project",
        projectId: "kelaskampus",
        label: "Kelas Kampus",
        position: { x: 240, y: 72 + 130 },
    },
    {
        id: "project-verda",
        kind: "project",
        projectId: "verda",
        label: "Verda",
        position: { x: 240, y: 72 + 130 * 2 },
    },
    {
        id: "project-arguardianforest",
        kind: "project",
        projectId: "arguardianforest",
        label: "AR Guardian Forest",
        position: { x: 360, y: 72 },
    },
    {
        id: "app-settings",
        kind: "app",
        appId: "settings",
        label: "Settings",
        position: { x: 360, y: 72 + 130 },
    },
];

const DEFAULT_WALLPAPER = 'url("/macos-big.jpg")';

type PersistedDesktopState = Partial<Pick<DesktopState, "icons" | "wallpaper">>;

type LegacyDesktopIcon = Partial<DesktopIcon> & {
    appId?: AppId;
    position?: Position;
    label?: string;
};

const getDefaultIconById = (id: string) => defaultIcons.find((icon) => icon.id === id);

const normalizeIcon = (icon: LegacyDesktopIcon, index: number): DesktopIcon | null => {
    if (!icon || !icon.label || !icon.position) return null;

    if (icon.id && icon.kind) {
        const fallback = getDefaultIconById(icon.id);
        return {
            ...icon,
            position: icon.position,
            label: icon.label,
            appId: icon.appId ?? fallback?.appId,
            projectId: icon.projectId ?? fallback?.projectId,
        } as DesktopIcon;
    }

    const project = projects.find((item) => item.name === icon.label);
    if (project) {
        return {
            id: `project-${project.id}`,
            kind: "project",
            projectId: project.id,
            label: project.name,
            position: icon.position,
        };
    }

    if (icon.appId) {
        const fallback = defaultIcons.find((item) => item.appId === icon.appId);
        return {
            id: fallback?.id ?? `app-${icon.appId}-${index}`,
            kind: fallback?.kind ?? "app",
            appId: icon.appId,
            label: icon.label,
            position: icon.position,
        };
    }

    return null;
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useDesktopStore = create<DesktopState>()(
    persist(
        (set, get) => ({
            icons: defaultIcons,
            selectedIcons: [],
            wallpaper: DEFAULT_WALLPAPER,

            moveIcon: (id, position) => {
                set({
                    icons: get().icons.map((icon) =>
                        icon.id === id ? { ...icon, position } : icon
                    ),
                });
            },

            resetIconLayout: () => {
                set({ icons: defaultIcons });
            },

            selectIcon: (id) => {
                set({ selectedIcons: [id] });
            },

            toggleSelectIcon: (id) => {
                const current = get().selectedIcons;
                if (current.includes(id)) {
                    set({ selectedIcons: current.filter((selectedId) => selectedId !== id) });
                } else {
                    set({ selectedIcons: [...current, id] });
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
            version: 5,
            migrate: (persistedState) => {
                const state = persistedState as PersistedDesktopState;
                const icons = Array.isArray(state.icons)
                    ? state.icons
                        .map((icon, index) => normalizeIcon(icon as LegacyDesktopIcon, index))
                        .filter((icon): icon is DesktopIcon => Boolean(icon))
                    : defaultIcons;
                const mergedIcons = [
                    ...icons,
                    ...defaultIcons.filter(
                        (defaultIcon) => !icons.some((icon) => icon.id === defaultIcon.id)
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
