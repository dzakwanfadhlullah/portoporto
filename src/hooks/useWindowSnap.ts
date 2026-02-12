import { useRef } from "react";
import type { DraggableData, DraggableEvent } from "react-draggable";

import { useWindowStore } from "@/stores/useWindowStore";
import type { WindowId, SnapPosition } from "@/types/window";

const SNAP_THRESHOLD = 24;

export const useWindowSnap = (windowId: WindowId) => {
    const setSnapPreview = useWindowStore((s) => s.setSnapPreview);
    const snapWindow = useWindowStore((s) => s.snapWindow);

    // Track if we are currently showing a preview
    const currentSnapRef = useRef<SnapPosition>(null);

    const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
        const { x, y } = data;
        const pointerX = _e instanceof MouseEvent ? _e.clientX : x;
        const pointerY = _e instanceof MouseEvent ? _e.clientY : y;

        // Check viewport edges
        const screenW = window.innerWidth;

        let newSnap: SnapPosition = null;

        if (pointerX < SNAP_THRESHOLD) {
            newSnap = "left";
        } else if (pointerX > screenW - SNAP_THRESHOLD) {
            newSnap = "right";
        } else if (pointerY < SNAP_THRESHOLD) {
            newSnap = "full";
        }

        if (currentSnapRef.current !== newSnap) {
            currentSnapRef.current = newSnap;
            setSnapPreview(newSnap);
        }
    };

    const handleDragStop = () => {
        if (currentSnapRef.current) {
            snapWindow(windowId, currentSnapRef.current);
        }

        // Clear preview
        setSnapPreview(null);
        currentSnapRef.current = null;
    };

    return {
        handleDrag,
        handleDragStop,
    };
};
