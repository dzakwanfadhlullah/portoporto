import { create } from "zustand";
import {
    FolderKanban,
    User,
    FlaskConical,
    Award,
    Mail,
} from "lucide-react";
import { createElement } from "react";

import type { AppId, AppMetadata } from "@/types/app";
import type { WindowConfig } from "@/types/window";

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
        minWidth: 480,
        minHeight: 400,
        defaultWidth: 720,
        defaultHeight: 560,
        resizable: true,
        draggable: true,
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

import { lazy } from "react";

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
            icon: createElement(FolderKanban, { size: 20 }),
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
            icon: createElement(User, { size: 20 }),
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
            icon: createElement(FlaskConical, { size: 20 }),
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
            icon: createElement(Award, { size: 20 }),
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
            icon: createElement(Mail, { size: 20 }),
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
            icon: createElement(FolderKanban, { size: 20 }),
            component: ProjectDetail,
            defaultWindowConfig: defaultConfigs["project-detail"],
        },
    ],
]);

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

    getAllApps: () => {
        return Array.from(get().apps.values());
    },

    getDockApps: () => {
        return Array.from(get().apps.values()).sort(
            (a, b) => (a.dockOrder ?? 999) - (b.dockOrder ?? 999)
        );
    },

    getDesktopApps: () => {
        return Array.from(get().apps.values()).filter(
            (app) => app.desktopPosition != null
        );
    },
}));
