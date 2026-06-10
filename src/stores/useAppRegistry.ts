import { create } from "zustand";
import type { ComponentType } from "react";
import dynamic from "next/dynamic";

import type { AppId, AppMetadata } from "@/types/app";
import type { WindowConfig } from "@/types/window";
import { Settings } from "lucide-react";

// ─── Default Window Configs ──────────────────────────────────────────────────

const defaultConfigs: Record<AppId, WindowConfig> = {
    projects: {
        minWidth: 600,
        minHeight: 400,
        defaultWidth: 840,
        defaultHeight: 560,
        resizable: true,
        draggable: true,
    },
    about: {
        minWidth: 800,
        minHeight: 580,
        defaultWidth: 800,
        defaultHeight: 580,
        resizable: true,
        draggable: true,
        hideTitleBar: true,
    },
    lab: {
        minWidth: 480,
        minHeight: 400,
        defaultWidth: 800,
        defaultHeight: 580,
        resizable: true,
        draggable: true,
    },
    contact: {
        minWidth: 720,
        minHeight: 500,
        defaultWidth: 860,
        defaultHeight: 580,
        resizable: true,
        draggable: true,
    },
    "project-detail": {
        minWidth: 320,
        minHeight: 400,
        defaultWidth: 360,
        defaultHeight: 520,
        resizable: true,
        draggable: true,
    },
    photobooth: {
        minWidth: 640,
        minHeight: 480,
        defaultWidth: 800,
        defaultHeight: 600,
        resizable: true,
        draggable: true,
    },
    settings: {
        minWidth: 680,
        minHeight: 460,
        defaultWidth: 760,
        defaultHeight: 540,
        resizable: true,
        draggable: true,
    },
};

// ─── Lazy component loaders ──────────────────────────────────────────────────
// We use dynamic imports so app bundles are code-split automatically.
// The `component` field stores a lazy-loaded React component.

type AppLoader = () => Promise<{ default: ComponentType }>;

const appLoaders: Record<AppId, AppLoader> = {
    projects: () => import("@/components/apps/projects/ProjectsApp"),
    "project-detail": () => import("@/components/apps/projects/ProjectDetail"),
    about: () => import("@/components/apps/about/AboutApp"),
    lab: () => import("@/components/apps/lab/LabApp"),
    contact: () => import("@/components/apps/music/MusicApp"),
    photobooth: () => import("@/components/apps/photobooth/PhotoBoothApp"),
    settings: () => import("@/components/apps/settings/SettingsApp"),
};

const ProjectsApp = dynamic(appLoaders.projects, { ssr: false });
const ProjectDetail = dynamic(appLoaders["project-detail"], { ssr: false });
const AboutApp = dynamic(appLoaders.about, { ssr: false });
const LabApp = dynamic(appLoaders.lab, { ssr: false });
const MusicApp = dynamic(appLoaders.contact, { ssr: false });
const PhotoBoothApp = dynamic(appLoaders.photobooth, { ssr: false });
const SettingsApp = dynamic(appLoaders.settings, { ssr: false });

export const preloadAppComponent = (appId: AppId) => {
    void appLoaders[appId]?.();
};

// ─── App Registry ────────────────────────────────────────────────────────────

const appRegistry = new Map<AppId, AppMetadata>([
    [
        "projects",
        {
            id: "projects",
            name: "Projects",
            iconConfig: { image: "/folderapple.png", style: "3d", color: "transparent", scale: 0.95, offsetY: 2 },
            component: ProjectsApp,
            defaultWindowConfig: defaultConfigs.projects,
            dockOrder: 2,
            desktopPosition: { row: 0, col: 1 },
        },
    ],
    [
        "about",
        {
            id: "about",
            name: "About Me",
            iconConfig: { image: "/profile.png", style: "3d", color: "transparent", scale: 1.40, offsetY: 5.5 },
            component: AboutApp,
            defaultWindowConfig: defaultConfigs.about,
            dockOrder: 1,
            desktopPosition: { row: 0, col: 0 },
        },
    ],
    [
        "lab",
        {
            id: "lab",
            name: "Game Center",
            iconConfig: { image: "/GameCentersApple.png", style: "3d", color: "transparent", scale: 0.90, offsetY: 3 },
            component: LabApp,
            defaultWindowConfig: defaultConfigs.lab,
            dockOrder: 3,
            desktopPosition: { row: 1, col: 0 },
        },
    ],
    [
        "contact",
        {
            id: "contact",
            name: "Music",
            iconConfig: { image: "/musicapple.png", style: "3d", color: "transparent", scale: 0.90, offsetY: 5 },
            component: MusicApp,
            defaultWindowConfig: defaultConfigs.contact,
            dockOrder: 5,
            desktopPosition: { row: 1, col: 1 },
        },
    ],
    [
        "photobooth",
        {
            id: "photobooth",
            name: "Photo Booth",
            // Reference image uses a camera lens look, let's use lucide icon with style for now
            // or we could use the icon config with char for a fallback or image if one exists
            iconConfig: { image: "/Photobooth icon.png", style: "3d", color: "transparent", scale: 0.90, offsetY: 4 },
            component: PhotoBoothApp,
            defaultWindowConfig: defaultConfigs.photobooth,
            dockOrder: 6,
            desktopPosition: { row: 2, col: 0 },
        },
    ],
    [
        "settings",
        {
            id: "settings",
            name: "System Settings",
            iconConfig: { icon: Settings, style: "3d", color: "#8E8E93", scale: 0.95 },
            component: SettingsApp,
            defaultWindowConfig: defaultConfigs.settings,
            dockOrder: 7,
            desktopPosition: { row: 2, col: 1 },
        },
    ],
    [
        "project-detail",
        {
            id: "project-detail",
            name: "Project Detail",
            iconConfig: { char: "📄", color: "#8E8E93" },
            component: ProjectDetail,
            defaultWindowConfig: defaultConfigs["project-detail"],
        },
    ],
]);

// ─── Pre-calculated stable arrays ───────────────────────────────────────────

const allApps = Array.from(appRegistry.values());
const dockApps = [...allApps]
    .filter((app) => app.dockOrder !== undefined)
    .sort((a, b) => (a.dockOrder ?? 999) - (b.dockOrder ?? 999));
const desktopApps = allApps.filter((app) => app.desktopPosition != null);

// ─── Store ───────────────────────────────────────────────────────────────────

interface AppRegistryState {
    apps: Map<AppId, AppMetadata>;
    getApp: (id: AppId) => AppMetadata | undefined;
    getAllApps: () => AppMetadata[];
    getDockApps: () => AppMetadata[];
    getDesktopApps: () => AppMetadata[];
}

export const useAppRegistry = create<AppRegistryState>()((set, get) => ({
    apps: appRegistry,

    getApp: (id: AppId) => {
        return get().apps.get(id);
    },

    getAllApps: () => allApps,

    getDockApps: () => dockApps,

    getDesktopApps: () => desktopApps,
}));
