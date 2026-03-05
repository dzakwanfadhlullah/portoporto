"use client";

import type { Project } from "./data";
import Image from "next/image";
import { useWindowStore } from "@/stores/useWindowStore";

interface ProjectTableViewProps {
    projects: Project[];
}

export const ProjectTableView = ({ projects }: ProjectTableViewProps) => {
    const openWindow = useWindowStore((s) => s.openWindow);

    const handleOpenDetail = (project: Project) => {
        openWindow(
            "project-detail",
            `Information about: ${project.name}`,
            360,
            520,
            { projectId: project.id }
        );
    };

    return (
        <div className="w-full h-full overflow-auto bg-white flex flex-col [scrollbar-gutter:stable]">
            {/* Header - Sticky - Hidden on Mobile */}
            <div className="sticky top-0 z-20 hidden md:grid grid-cols-[40px_1fr_320px_192px_80px_40px] items-center pt-4 pb-2 text-[13px] font-medium text-black/90 border-b border-black/[0.03] bg-white">
                <div /> {/* Left Padding */}
                <div className="flex items-center gap-4">
                    <div className="w-9 shrink-0" />
                    <span>Name</span>
                </div>
                <div>Role</div>
                <div>Brand</div>
                <div className="text-right">Year</div>
                <div /> {/* Right Padding */}
            </div>

            {/* List */}
            <div className="flex flex-col">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className={`
                            group cursor-pointer transition-colors duration-100 px-4 md:px-0
                            ${index % 2 === 1 ? "bg-black/[0.02]" : "bg-transparent"}
                            hover:bg-blue-500/5
                            grid grid-cols-1 md:grid-cols-[40px_1fr_320px_192px_80px_40px] items-center py-3 md:py-1.5
                        `}
                        onClick={() => handleOpenDetail(project)}
                    >
                        <div className="hidden md:block" /> {/* Left Padding */}

                        {/* Thumbnail & Name Area */}
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <div className="w-10 h-10 md:w-9 md:h-9 relative rounded-[6px] md:rounded-[4px] overflow-hidden border border-black/5 shrink-0 bg-neutral-100">
                                <Image
                                    src={project.thumbnail}
                                    alt={project.name}
                                    fill
                                    className="object-contain p-1.5 md:p-1"
                                />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:gap-4 min-w-0">
                                <h3 className="text-[15px] md:text-[14px] font-bold text-black/90 truncate">
                                    {project.name}
                                </h3>
                                {/* Mobile-only Role & Brand */}
                                <div className="flex md:hidden items-center gap-2 text-[12px] text-black/40 font-medium">
                                    <span>{project.role}</span>
                                    <span className="w-1 h-1 rounded-full bg-black/10" />
                                    <span className="truncate">{project.brand}</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop-only Columns */}
                        <div className="hidden md:block text-[14px] font-medium text-black/40 truncate">
                            {project.role}
                        </div>

                        <div className="hidden md:block text-[14px] font-medium text-black/40 truncate">
                            {project.brand}
                        </div>

                        <div className="hidden md:block text-[14px] font-medium text-black/40 text-right">
                            {project.year}
                        </div>

                        <div className="hidden md:block" /> {/* Right Padding */}
                    </div>
                ))}
            </div>
        </div>
    );
};
