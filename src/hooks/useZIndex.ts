/**
 * Z-Index Layer Management
 *
 * Defines the z-index hierarchy for the entire DzakOS UI.
 * Windows get dynamic z-index values within their designated range.
 * System-level components use fixed z-index values.
 */

// ─── Layer Constants ─────────────────────────────────────────────────────────

export const Z_LAYERS = {
    /** Desktop background and wallpaper */
    DESKTOP: 0,

    /** Desktop icons sit above the background */
    DESKTOP_ICONS: 10,

    /** Selection rectangle on desktop */
    SELECTION_BOX: 20,

    /** Base z-index for window layer — individual windows offset from here */
    WINDOWS_BASE: 100,

    /** Maximum z-index for windows before reset */
    WINDOWS_MAX: 999,

    /** Dock bar sits above all windows */
    DOCK: 1000,

    /** Menu bar at the very top of the screen */
    MENUBAR: 1001,

    /** Dropdown menus from the menubar */
    MENUBAR_DROPDOWN: 1050,

    /** Spotlight search overlay */
    SPOTLIGHT: 1100,

    /** Context menus (right-click) */
    CONTEXT_MENU: 1200,

    /** Notification toasts */
    NOTIFICATIONS: 1300,

    /** Modal overlays and dialogs */
    MODAL: 1400,

    /** Drag ghost elements */
    DRAG_GHOST: 9999,
} as const;

export type ZLayer = keyof typeof Z_LAYERS;

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Hook to get z-index values and manage window z-index stacking.
 *
 * Usage:
 * ```tsx
 * const { getLayer, getWindowZIndex } = useZIndex();
 * <div style={{ zIndex: getLayer('DOCK') }} />
 * <div style={{ zIndex: getWindowZIndex(window.zIndex) }} />
 * ```
 */
export const useZIndex = () => {
    /** Get the z-index value for a named system layer */
    const getLayer = (layer: ZLayer): number => Z_LAYERS[layer];

    /**
     * Convert a window's relative z-index (from the store) to an absolute
     * z-index within the WINDOWS range.
     */
    const getWindowZIndex = (relativeZIndex: number): number => {
        return Z_LAYERS.WINDOWS_BASE + (relativeZIndex % (Z_LAYERS.WINDOWS_MAX - Z_LAYERS.WINDOWS_BASE));
    };

    /**
     * Check if a given z-index falls within the window layer.
     */
    const isWindowLayer = (zIndex: number): boolean => {
        return zIndex >= Z_LAYERS.WINDOWS_BASE && zIndex <= Z_LAYERS.WINDOWS_MAX;
    };

    return {
        layers: Z_LAYERS,
        getLayer,
        getWindowZIndex,
        isWindowLayer,
    };
};
