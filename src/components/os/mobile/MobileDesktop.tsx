"use client";

import { useAppRegistry } from "@/stores/useAppRegistry";
import { useWindowStore } from "@/stores/useWindowStore";
import { AppleIcon } from "../AppleIcon";
import { motion } from "framer-motion";
import type { AppId } from "@/types/app";
import { projects } from "@/components/apps/projects/data";
import Image from "next/image";

export const MobileDesktop = () => {
    const getApp = useAppRegistry((s) => s.getApp);
    const getDockApps = useAppRegistry((s) => s.getDockApps);
    const openWindow = useWindowStore((s) => s.openWindow);

    const dockApps = getDockApps();

    const handleOpenApp = (appId: AppId, name: string) => {
        openWindow(appId, name, 800, 600); // Sizes ignored on mobile but required by API
    };

    const handleOpenProject = (projectId: string, projectName: string) => {
        openWindow("project-detail", `Information about: ${projectName}`, 360, 520, { projectId });
    };

    return (
        <div className="w-full h-full flex flex-col pt-12 pb-24 px-6 bg-[#F5EFE6] relative">

            {/* Desktop Wallpaper effect / Grain */}
            <div className="absolute inset-0 vibrant-wallpaper pointer-events-none" />
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none grain" />

            {/* App Grid */}
            <div className="flex-1 grid grid-cols-4 content-start gap-y-8 gap-x-4 z-10 w-full">
                {projects.map((project) => {
                    return (
                        <motion.div
                            key={project.id}
                            className="flex flex-col items-center gap-1.5"
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenProject(project.id, project.name)}
                        >
                            <div className="w-[60px] h-[60px] flex items-center justify-center relative">
                                <AppleIcon
                                    image={project.thumbnail}
                                    style="photo"
                                    color="transparent"
                                />
                            </div>
                            <span className="text-[11px] font-semibold text-white truncate w-full px-1 text-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                                {project.name}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Mobile Bottom Dock (Horizontal) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[340px] h-[72px] rounded-[32px] bg-white/10 backdrop-blur-3xl border border-white/20 px-6 flex flex-row justify-between items-center z-20 shadow-2xl">
                {dockApps.slice(0, 5).map((app) => (
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
