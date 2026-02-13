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
        <div className="w-full h-full overflow-hidden flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center px-10 pt-4 pb-2 text-[13px] font-medium text-black/90 border-b border-black/[0.03]">
                <div className="flex-1 pl-12">Name</div>
                <div className="w-40">Role</div>
                <div className="w-32">Brand</div>
                <div className="w-20 text-right">Year</div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className={`
                            group flex items-center px-10 py-1.5 cursor-pointer transition-colors duration-100
                            ${index % 2 === 1 ? "bg-black/[0.02]" : "bg-transparent"}
                            hover:bg-blue-500/5
                        `}
                        onClick={() => handleOpenDetail(project)}
                    >
                        {/* Thumbnail & Name Area */}
                        <div className="flex-1 flex items-center gap-4 min-w-0">
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
                        <div className="w-40 text-[14px] font-medium text-black/40 truncate">
                            {project.role}
                        </div>

                        {/* Brand Area */}
                        <div className="w-32 text-[14px] font-medium text-black/40 truncate">
                            {project.brand}
                        </div>

                        {/* Year Area */}
                        <div className="w-20 text-[14px] font-medium text-black/40 text-right">
                            {project.year}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
