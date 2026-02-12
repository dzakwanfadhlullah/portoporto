import type { ComponentType, ReactNode } from "react";
import type { WindowConfig } from "./window";

// ─── App Types ───────────────────────────────────────────────────────────────

/** Union type of all registered application IDs */
export type AppId =
    | "projects"
    | "about"
    | "lab"
    | "leadership"
    | "contact"
    | "project-detail";

/** Desktop grid position for icon placement */
export interface DesktopPosition {
    row: number;
    col: number;
}

/**
 * Complete metadata for a registered application.
 * Defines how the app appears in the dock, desktop, and spotlight,
 * and what component to render inside its window.
 */
export interface AppMetadata {
    /** Unique app identifier */
    id: AppId;
    /** Display name shown in dock tooltip, title bar, spotlight */
    name: string;
    /** Icon component rendered in dock and desktop */
    icon: ReactNode;
    /** The React component rendered inside the window */
    component: ComponentType;
    /** Default window size/behavior constraints */
    defaultWindowConfig: WindowConfig;
    /** Order of appearance in the dock (lower = further left) */
    dockOrder?: number;
    /** Optional grid position on the desktop */
    desktopPosition?: DesktopPosition;
}
