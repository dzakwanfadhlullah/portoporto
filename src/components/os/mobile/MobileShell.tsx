"use client";

import { useWindowStore } from "@/stores/useWindowStore";
import { MobileDesktop } from "./MobileDesktop";
import { MobileAppView } from "./MobileAppView";
import { MobileStatusBar } from "./MobileStatusBar";

export const MobileShell = () => {
    // Determine active app
    const activeWindowId = useWindowStore((s) => s.activeWindowId);

    return (
        <div className="relative w-full h-full bg-black text-white overflow-hidden flex flex-col font-sans select-none">
            {/* Status Bar is hidden as requested */}
            {/* <MobileStatusBar /> */}

            {/* Core View Area */}
            <div className="flex-1 relative overflow-hidden">
                {activeWindowId ? (
                    <MobileAppView windowId={activeWindowId} />
                ) : (
                    <MobileDesktop />
                )}
            </div>

            {/* Home indicator (iOS style bottom bar) - visual only */}
            <div className="absolute bottom-1 w-full flex justify-center py-2 pointer-events-none z-50">
                <div className="w-1/3 h-1 bg-white/50 rounded-full" />
            </div>
        </div>
    );
};
