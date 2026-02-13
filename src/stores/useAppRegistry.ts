import { create } from "zustand";
import { createElement, lazy } from "react";
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
        minWidth: 640,
        minHeight: 480,
        defaultWidth: 960,
        defaultHeight: 640,
        resizable: true,
        draggable: true,
    },
    about: {
        minWidth: 720,
        minHeight: 540,
        defaultWidth: 720,
        defaultHeight: 540,
        resizable: false,
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
        minWidth: 360,
        minHeight: 320,
        defaultWidth: 520,
        defaultHeight: 480,
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
};

// ─── Lazy component loaders ──────────────────────────────────────────────────
// We use dynamic imports so app bundles are code-split automatically.
// The `component` field stores a lazy-loaded React component.

const ProjectsApp = lazy(
    () => import("@/components/apps/projects/ProjectsApp")
);
const ProjectDetail = lazy(
    () => import("@/components/apps/projects/ProjectDetail")
);
const AboutApp = lazy(() => import("@/components/apps/about/AboutApp"));
const LabApp = lazy(() => import("@/components/apps/lab/LabApp"));
const LeadershipApp = lazy(
    () => import("@/components/apps/leadership/LeadershipApp")
);
const ContactApp = lazy(
    () => import("@/components/apps/contact/ContactApp")
);

// ─── App Registry ────────────────────────────────────────────────────────────

const appRegistry = new Map<AppId, AppMetadata>([
    [
        "projects",
        {
            id: "projects",
            name: "Projects",
            iconConfig: { icon: Folder, color: "#007AFF" }, // Blue folder like macOS
            component: ProjectsApp,
            defaultWindowConfig: defaultConfigs.projects,
            dockOrder: 1,
            desktopPosition: { row: 0, col: 0 },
        },
    ],
    [
        "about",
        {
            id: "about",
            name: "About Me",
            iconConfig: { image: "/profile.png", style: "3d", color: "transparent" },
            component: AboutApp,
            defaultWindowConfig: defaultConfigs.about,
            dockOrder: 2,
            desktopPosition: { row: 0, col: 1 },
        },
    ],
    [
        "lab",
        {
            id: "lab",
            name: "Lab",
            iconConfig: { icon: Archive, color: "#FF9500" }, // Orange box for 'Lab/Archive'
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
            iconConfig: { icon: Award, color: "#FFCC18" }, // Gold
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
            name: "Contact",
            iconConfig: { icon: Mail, color: "#34C759" }, // Green for communication
            component: ContactApp,
            defaultWindowConfig: defaultConfigs.contact,
            dockOrder: 5,
            desktopPosition: { row: 2, col: 0 },
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
const dockApps = [...allApps].sort(
    (a, b) => (a.dockOrder ?? 999) - (b.dockOrder ?? 999)
);
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
