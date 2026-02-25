"use client";

import { useAppRegistry } from "@/stores/useAppRegistry";
import { useWindowStore } from "@/stores/useWindowStore";
import { AppleIcon } from "../AppleIcon";
import { motion } from "framer-motion";
import type { AppId } from "@/types/app";

export const MobileDesktop = () => {
    const getAllApps = useAppRegistry((s) => s.getAllApps);
    const getDockApps = useAppRegistry((s) => s.getDockApps);
    const openWindow = useWindowStore((s) => s.openWindow);

    const apps = getAllApps();
    const dockApps = getDockApps();

    // The apps on the grid (exclude purely dock apps if configured that way, but here we just show all)
    const gridApps = apps.filter(app => app.id !== "project-detail");

    const handleOpenApp = (appId: AppId, name: string) => {
        openWindow(appId, name, 800, 600); // Sizes ignored on mobile but required by API
    };

    return (
        <div className="w-full h-full flex flex-col pt-4 pb-6 px-4 bg-gradient-to-b from-[#1c1c1e] to-[#000000]">

            {/* Desktop Wallpaper effect / Grain */}
            <div className="absolute inset-0 vibrant-wallpaper opacity-40 pointer-events-none mix-blend-screen" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[20px] pointer-events-none" />

            {/* App Grid */}
            <div className="flex-1 grid grid-cols-4 content-start gap-y-6 gap-x-2 z-10">
                {gridApps.map((app) => (
                    <motion.div
                        key={app.id}
                        className="flex flex-col items-center gap-1.5"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOpenApp(app.id, app.name)}
                    >
                        <div className="w-14 h-14 flex items-center justify-center relative">
                            <AppleIcon
                                {...app.iconConfig}
                                style="3d"
                                size={56} // slightly bigger for mobile
                            />
                        </div>
                        <span className="text-[11px] font-medium text-white/90 truncate max-w-[70px] text-center drop-shadow-md">
                            {app.name}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Mobile Dock */}
            <div className="shrink-0 w-full rounded-3xl bg-white/20 backdrop-blur-3xl border border-white/10 p-4 flex justify-around items-center z-10 mb-4">
                {dockApps.slice(0, 4).map((app) => (
                    <motion.div
                        key={`dock-${app.id}`}
                        whileTap={{ scale: 0.85 }}
                        className="w-12 h-12 flex items-center justify-center cursor-pointer"
                        onClick={() => handleOpenApp(app.id, app.name)}
                    >
                        <AppleIcon
                            {...app.iconConfig}
                            style="3d"
                            size={48}
                        />
                    </motion.div>
                ))}
            </div>

        </div>
    );
};
