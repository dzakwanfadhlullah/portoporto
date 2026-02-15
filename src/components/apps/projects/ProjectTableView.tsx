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
            `Project: ${project.name}`,
            1024,
            720,
            { projectId: project.id }
        );
    };

    return (
        <div className="w-full h-full overflow-auto bg-white flex flex-col [scrollbar-gutter:stable]">
            {/* Header - Sticky */}
            <div className="sticky top-0 z-20 grid grid-cols-[40px_1fr_320px_192px_80px_40px] items-center pt-4 pb-2 text-[13px] font-medium text-black/90 border-b border-black/[0.03] bg-white">
                <div /> {/* Left Padding Column (40px) */}
                <div className="flex items-center gap-4">
                    <div className="w-9 shrink-0" /> {/* Spacer to match thumbnail */}
                    <span>Name</span>
                </div>
                <div>Role</div>
                <div>Brand</div>
                <div className="text-right">Year</div>
                <div /> {/* Right Padding Column (40px) */}
            </div>

            {/* List */}
            <div className="flex flex-col">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className={`
                            group grid grid-cols-[40px_1fr_320px_192px_80px_40px] items-center py-1.5 cursor-pointer transition-colors duration-100
                            ${index % 2 === 1 ? "bg-black/[0.02]" : "bg-transparent"}
                            hover:bg-blue-500/5
                        `}
                        onClick={() => handleOpenDetail(project)}
                    >
                        <div /> {/* Left Padding Column */}

                        {/* Thumbnail & Name Area */}
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-9 h-9 relative rounded-[4px] overflow-hidden border border-black/5 shrink-0 bg-neutral-100">
                                <Image
                                    src={project.thumbnail}
                                    alt={project.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-[14px] font-bold text-black/90 truncate">
                                {project.name}
                            </h3>
                        </div>

                        {/* Role Area */}
                        <div className="text-[14px] font-medium text-black/40 truncate">
                            {project.role}
                        </div>

                        {/* Brand Area */}
                        <div className="text-[14px] font-medium text-black/40 truncate">
                            {project.brand}
                        </div>

                        {/* Year Area */}
                        <div className="text-[14px] font-medium text-black/40 text-right">
                            {project.year}
                        </div>

                        <div /> {/* Right Padding Column */}
                    </div>
                ))}
            </div>
        </div>
    );
};
