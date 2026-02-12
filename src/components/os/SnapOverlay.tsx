"use client";

import { useWindowStore } from "@/stores/useWindowStore";
import { useZIndex, Z_LAYERS } from "@/hooks/useZIndex";
import { motion, AnimatePresence } from "framer-motion";

export const SnapOverlay = () => {
    const snapPreview = useWindowStore((s) => s.snapPreview);

    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: Z_LAYERS.WINDOWS_MAX + 1 }} // Above all windows
        >
            <AnimatePresence>
                {snapPreview && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bg-foreground/10 backdrop-blur-sm rounded-xl border-2 border-foreground/20"
                        style={{
                            ...(snapPreview === "left" && {
                                top: 48,
                                left: 12,
                                bottom: 84, // Dock height + padding
                                width: "48%",
                            }),
                            ...(snapPreview === "right" && {
                                top: 48,
                                right: 12,
                                bottom: 84,
                                width: "48%",
                            }),
                            ...(snapPreview === "full" && {
                                top: 48,
                                left: 12,
                                right: 12,
                                bottom: 84,
                            }),
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
