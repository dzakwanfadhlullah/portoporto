import { create } from "zustand";
import { createElement } from "react";
import dynamic from "next/dynamic";
import { AppleIcon } from "@/components/os/AppleIcon";

import type { AppId, AppMetadata } from "@/types/app";
import type { WindowConfig } from "@/types/window";
import {
    LayoutGrid,
    Folder,
    UserCircle,
    Archive,
    Award,
    Mail,
    FileText
} from "lucide-react";

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
    leadership: {
        minWidth: 480,
        minHeight: 400,
        defaultWidth: 700,
        defaultHeight: 520,
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
        minWidth: 800,
        minHeight: 600,
        defaultWidth: 1024,
        defaultHeight: 720,
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
};

// ─── Lazy component loaders ──────────────────────────────────────────────────
// We use dynamic imports so app bundles are code-split automatically.
// The `component` field stores a lazy-loaded React component.

const ProjectsApp = dynamic(
    () => import("@/components/apps/projects/ProjectsApp"), { ssr: false }
);
const ProjectDetail = dynamic(
    () => import("@/components/apps/projects/ProjectDetail"), { ssr: false }
);
const AboutApp = dynamic(() => import("@/components/apps/about/AboutApp"), { ssr: false });
const LabApp = dynamic(() => import("@/components/apps/lab/LabApp"), { ssr: false });
const LeadershipApp = dynamic(
    () => import("@/components/apps/leadership/LeadershipApp"), { ssr: false }
);
const MusicApp = dynamic(
    () => import("@/components/apps/music/MusicApp"), { ssr: false }
);
const PhotoBoothApp = dynamic(
    () => import("@/components/apps/photobooth/PhotoBoothApp"), { ssr: false }
);

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
        "leadership",
        {
            id: "leadership",
            name: "Leadership",
            iconConfig: { image: "/trophyapple.png", style: "3d", color: "transparent", scale: 0.75, offsetY: 5 },
            component: LeadershipApp,
            defaultWindowConfig: defaultConfigs.leadership,
            dockOrder: 4,
            desktopPosition: { row: 1, col: 1 },
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
            desktopPosition: { row: 2, col: 0 },
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
