import type { ComponentType, ReactNode } from "react";

// ─── Window Types ────────────────────────────────────────────────────────────

/** Branded string type for unique window identifiers */
export type WindowId = string & { readonly __brand: "WindowId" };

/** Creates a typed WindowId from a string */
export const createWindowId = (id: string): WindowId => id as WindowId;

/** Snap position for window snapping behavior */
export type SnapPosition = "left" | "right" | "full" | null;

/** Position coordinate pair */
export interface Position {
    x: number;
    y: number;
}

/** Size dimension pair */
export interface Size {
    w: number;
    h: number;
}

/**
 * Complete runtime state of a single window instance.
 * Tracked by the Window Manager store.
 */
export interface WindowState {
    /** Unique identifier for this window instance */
    id: WindowId;
    /** Which app this window belongs to */
    appId: string;
    /** Display title shown in the title bar */
    title: string;
    /** Current top-left position on the desktop */
    position: Position;
    /** Current width/height of the window */
    size: Size;
    /** Whether the window is minimized to the dock */
    isMinimized: boolean;
    /** Whether the window is maximized to fill the screen */
    isMaximized: boolean;
    /** Whether the window currently has focus */
    isFocused: boolean;
    /** Z-index layer for stacking order */
    zIndex: number;
    /** Saved position before maximize (for restore) */
    previousPosition: Position | null;
    /** Saved size before maximize (for restore) */
    previousSize: Size | null;
    /** Current snap state */
    snapPosition: SnapPosition;
    /** Optional metadata for the app instance (e.g. projectId) */
    metadata?: any;
}

/**
 * Static configuration for a window — defines constraints and defaults.
 * Used by AppMetadata to specify how windows should behave.
 */
export interface WindowConfig {
    minWidth: number;
    minHeight: number;
    maxWidth?: number;
    maxHeight?: number;
    defaultWidth: number;
    defaultHeight: number;
    resizable: boolean;
    draggable: boolean;
    hideTitleBar?: boolean;
    customTitleBar?: boolean;
}
