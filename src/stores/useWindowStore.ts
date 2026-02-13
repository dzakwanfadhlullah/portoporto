import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AppId } from "@/types/app";
import type {
    WindowId,
    WindowState,
    Position,
    Size,
    SnapPosition,
} from "@/types/window";
import { createWindowId } from "@/types/window";

// ─── Helpers ─────────────────────────────────────────────────────────────────

let windowCounter = 0;

const generateWindowId = (appId: string): WindowId =>
    createWindowId(`${appId}-${Date.now()}-${++windowCounter}`);

const DESKTOP_PADDING = 48; // top menubar height
const DOCK_HEIGHT = 72;

/** Slight random offset so stacked windows don't perfectly overlap */
const cascadeOffset = (index: number) => ({
    x: 80 + (index % 6) * 28,
    y: DESKTOP_PADDING + 20 + (index % 6) * 28,
});

// ─── Store Types ─────────────────────────────────────────────────────────────

interface WindowManagerState {
    windows: Record<string, WindowState>;
    activeWindowId: WindowId | null;
    windowOrder: WindowId[];
    nextZIndex: number;

    // Actions
    openWindow: (
        appId: AppId,
        title: string,
        defaultWidth: number,
        defaultHeight: number,
        metadata?: any
    ) => void;
    closeWindow: (windowId: WindowId) => void;
    minimizeWindow: (windowId: WindowId) => void;
    unminimizeWindow: (windowId: WindowId) => void;
    maximizeWindow: (windowId: WindowId) => void;
    restoreWindow: (windowId: WindowId) => void;
    focusWindow: (windowId: WindowId) => void;
    moveWindow: (windowId: WindowId, position: Position) => void;
    resizeWindow: (windowId: WindowId, size: Size) => void;
    snapWindow: (windowId: WindowId, snapPos: SnapPosition) => void;
    minimizeAll: () => void;
    closeAll: () => void;

    // Snap Preview
    snapPreview: SnapPosition;
    setSnapPreview: (snap: SnapPosition) => void;

    // Desktop Bounds
    desktopSize: Size;
    setDesktopSize: (size: Size) => void;

    // Computed
    getVisibleWindows: () => WindowState[];
    getMinimizedWindows: () => WindowState[];
    getFocusedWindow: () => WindowState | undefined;
    getWindowsByZIndex: () => WindowState[];
    getWindowByAppId: (appId: AppId) => WindowState | undefined;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useWindowStore = create<WindowManagerState>()(
    persist(
        (set, get) => ({
            windows: {},
            activeWindowId: null,
            windowOrder: [],
            nextZIndex: 1,
            snapPreview: null,
            desktopSize: { w: 1440, h: 900 },

            setSnapPreview: (snap) => set({ snapPreview: snap }),
            setDesktopSize: (size) => set({ desktopSize: size }),

            // ── Open ───────────────────────────────────────────────────────────
            openWindow: (appId, title, defaultWidth, defaultHeight, metadata) => {
                const state = get();

                // If this app already has a window open with SAME metadata, just focus it
                const existing = Object.values(state.windows).find(
                    (w) => w.appId === appId && JSON.stringify(w.metadata) === JSON.stringify(metadata)
                );
                if (existing) {
                    if (existing.isMinimized) {
                        get().unminimizeWindow(existing.id);
                    } else {
                        get().focusWindow(existing.id);
                    }
                    return;
                }

                const id = generateWindowId(appId);
                const offset = cascadeOffset(Object.keys(state.windows).length);
                const zIndex = state.nextZIndex;

                const newWindow: WindowState = {
                    id,
                    appId,
                    title,
                    position: offset,
                    size: { w: defaultWidth, h: defaultHeight },
                    isMinimized: false,
                    isMaximized: false,
                    isFocused: true,
                    zIndex,
                    previousPosition: null,
                    previousSize: null,
                    snapPosition: null,
                    metadata,
                };

                // Unfocus all other windows
                const updatedWindows = { ...state.windows };
                for (const key of Object.keys(updatedWindows)) {
                    updatedWindows[key] = { ...updatedWindows[key]!, isFocused: false };
                }
                updatedWindows[id] = newWindow;

                set({
                    windows: updatedWindows,
                    activeWindowId: id,
                    windowOrder: [...state.windowOrder, id],
                    nextZIndex: zIndex + 1,
                });
            },

            // ── Close ──────────────────────────────────────────────────────────
            closeWindow: (windowId) => {
                const state = get();
                const { [windowId]: _, ...remainingWindows } = state.windows;
                const newOrder = state.windowOrder.filter((id) => id !== windowId);

                // Focus the topmost remaining window
                let newActiveId: WindowId | null = null;
                if (newOrder.length > 0) {
                    const topId = newOrder[newOrder.length - 1]!;
                    const topWin = remainingWindows[topId];
                    if (topWin) {
                        remainingWindows[topId] = { ...topWin, isFocused: true };
                        newActiveId = topId;
                    }
                }

                set({
                    windows: remainingWindows,
                    activeWindowId: newActiveId,
                    windowOrder: newOrder,
                });
            },

            // ── Minimize ───────────────────────────────────────────────────────
            minimizeWindow: (windowId) => {
                const state = get();
                const win = state.windows[windowId];
                if (!win) return;

                const updatedWindows = {
                    ...state.windows,
                    [windowId]: { ...win, isMinimized: true, isFocused: false },
                };

                // Focus next visible window in the stack
                const newOrder = state.windowOrder;
                let newActiveId: WindowId | null = null;
                for (let i = newOrder.length - 1; i >= 0; i--) {
                    const id = newOrder[i]!;
                    if (id !== windowId && !updatedWindows[id]?.isMinimized) {
                        updatedWindows[id] = { ...updatedWindows[id]!, isFocused: true };
                        newActiveId = id;
                        break;
                    }
                }

                set({
                    windows: updatedWindows,
                    activeWindowId: newActiveId,
                });
            },

            // ── Unminimize ─────────────────────────────────────────────────────
            unminimizeWindow: (windowId) => {
                const state = get();
                const win = state.windows[windowId];
                if (!win) return;

                const zIndex = state.nextZIndex;

                // Unfocus all, then focus this one
                const updatedWindows = { ...state.windows };
                for (const key of Object.keys(updatedWindows)) {
                    updatedWindows[key] = { ...updatedWindows[key]!, isFocused: false };
                }
                updatedWindows[windowId] = {
                    ...win,
                    isMinimized: false,
                    isFocused: true,
                    zIndex,
                };

                // Move to top of order
                const newOrder = [
                    ...state.windowOrder.filter((id) => id !== windowId),
                    windowId,
                ];

                set({
                    windows: updatedWindows,
                    activeWindowId: windowId,
                    windowOrder: newOrder,
                    nextZIndex: zIndex + 1,
                });
            },

            // ── Maximize ───────────────────────────────────────────────────────
            maximizeWindow: (windowId) => {
                const state = get();
                const win = state.windows[windowId];
                if (!win) return;

                const { desktopSize } = state;

                set({
                    windows: {
                        ...state.windows,
                        [windowId]: {
                            ...win,
                            previousPosition: win.isMaximized ? win.previousPosition : win.position,
                            previousSize: win.isMaximized ? win.previousSize : win.size,
                            position: { x: 0, y: DESKTOP_PADDING },
                            size: {
                                w: desktopSize.w,
                                h: desktopSize.h - DESKTOP_PADDING - DOCK_HEIGHT,
                            },
                            isMaximized: true,
                            snapPosition: null,
                        },
                    },
                });
            },

            // ── Restore ────────────────────────────────────────────────────────
            restoreWindow: (windowId) => {
                const state = get();
                const win = state.windows[windowId];
                if (!win) return;

                set({
                    windows: {
                        ...state.windows,
                        [windowId]: {
                            ...win,
                            position: win.previousPosition ?? win.position,
                            size: win.previousSize ?? win.size,
                            isMaximized: false,
                            snapPosition: null,
                            previousPosition: null,
                            previousSize: null,
                        },
                    },
                });
            },

            // ── Focus ──────────────────────────────────────────────────────────
            focusWindow: (windowId) => {
                const state = get();
                const win = state.windows[windowId];
                if (!win) return;

                // If already focused, skip
                if (state.activeWindowId === windowId && win.isFocused) return;

                const zIndex = state.nextZIndex;

                const updatedWindows = { ...state.windows };
                for (const key of Object.keys(updatedWindows)) {
                    updatedWindows[key] = { ...updatedWindows[key]!, isFocused: false };
                }
                updatedWindows[windowId] = {
                    ...win,
                    isFocused: true,
                    zIndex,
                };

                const newOrder = [
                    ...state.windowOrder.filter((id) => id !== windowId),
                    windowId,
                ];

                set({
                    windows: updatedWindows,
                    activeWindowId: windowId,
                    windowOrder: newOrder,
                    nextZIndex: zIndex + 1,
                });
            },

            // ── Move ───────────────────────────────────────────────────────────
            moveWindow: (windowId, position) => {
                const state = get();
                const win = state.windows[windowId];
                if (!win) return;

                set({
                    windows: {
                        ...state.windows,
                        [windowId]: {
                            ...win,
                            position,
                            // Clear snap when manually moved
                            snapPosition: null,
                            isMaximized: false,
                        },
                    },
                });
            },

            // ── Resize ─────────────────────────────────────────────────────────
            resizeWindow: (windowId, size) => {
                const state = get();
                const win = state.windows[windowId];
                if (!win) return;

                set({
                    windows: {
                        ...state.windows,
                        [windowId]: {
                            ...win,
                            size,
                            isMaximized: false,
                            snapPosition: null,
                        },
                    },
                });
            },

            // ── Snap ───────────────────────────────────────────────────────────
            snapWindow: (windowId, snapPos) => {
                const state = get();
                const win = state.windows[windowId];
                if (!win) return;

                const { desktopSize } = state;
                const screenW = desktopSize.w;
                const usableH = desktopSize.h - DESKTOP_PADDING - DOCK_HEIGHT;

                let newPosition: Position;
                let newSize: Size;

                switch (snapPos) {
                    case "left":
                        newPosition = { x: 0, y: DESKTOP_PADDING };
                        newSize = { w: screenW / 2, h: usableH };
                        break;
                    case "right":
                        newPosition = { x: screenW / 2, y: DESKTOP_PADDING };
                        newSize = { w: screenW / 2, h: usableH };
                        break;
                    case "full":
                        newPosition = { x: 0, y: DESKTOP_PADDING };
                        newSize = { w: screenW, h: usableH };
                        break;
                    default:
                        return;
                }

                set({
                    windows: {
                        ...state.windows,
                        [windowId]: {
                            ...win,
                            previousPosition: win.snapPosition ? win.previousPosition : win.position,
                            previousSize: win.snapPosition ? win.previousSize : win.size,
                            position: newPosition,
                            size: newSize,
                            snapPosition: snapPos,
                            isMaximized: false,
                        },
                    },
                });
            },

            // ── Bulk Actions ──────────────────────────────────────────────────
            minimizeAll: () => {
                const state = get();
                const updatedWindows = { ...state.windows };
                for (const id of Object.keys(updatedWindows)) {
                    updatedWindows[id] = {
                        ...updatedWindows[id]!,
                        isMinimized: true,
                        isFocused: false
                    };
                }
                set({ windows: updatedWindows, activeWindowId: null });
            },

            closeAll: () => {
                set({ windows: {}, activeWindowId: null, windowOrder: [] });
            },

            // ── Computed ───────────────────────────────────────────────────────
            getVisibleWindows: () => {
                return Object.values(get().windows).filter((w) => !w.isMinimized);
            },

            getMinimizedWindows: () => {
                return Object.values(get().windows).filter((w) => w.isMinimized);
            },

            getFocusedWindow: () => {
                const state = get();
                if (!state.activeWindowId) return undefined;
                return state.windows[state.activeWindowId];
            },

            getWindowsByZIndex: () => {
                return Object.values(get().windows).sort(
                    (a, b) => a.zIndex - b.zIndex
                );
            },

            getWindowByAppId: (appId) => {
                return Object.values(get().windows).find((w) => w.appId === appId);
            },
        }),
        {
            name: "dzakos-window-store",
            storage: createJSONStorage(() => localStorage),
            // Only persist layout-critical state, not focus/z-index
            partialize: (state) => ({
                windows: state.windows,
                windowOrder: state.windowOrder,
                nextZIndex: state.nextZIndex,
            }),
        }
    )
);
