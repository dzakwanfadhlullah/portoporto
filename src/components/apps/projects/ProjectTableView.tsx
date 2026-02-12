"use client";

import type { Project } from "./data";
import Image from "next/image";

interface ProjectTableViewProps {
    projects: Project[];
}

export const ProjectTableView = ({ projects }: ProjectTableViewProps) => {
    return (
        <div className="w-full h-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center px-6 py-2 border-b border-border/40 bg-muted/20 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/80">
                <div className="w-12 mr-4">Icon</div>
                <div className="flex-1">Name</div>
                <div className="w-48">Role</div>
                <div className="w-32">Brand</div>
                <div className="w-16 text-right">Year</div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto divide-y divide-border/20">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="group flex items-center px-6 py-3.5 hover:bg-muted-foreground/5 cursor-pointer transition-colors duration-150"
                        onClick={() => console.log("Open project:", project.id)}
                    >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden mr-4 border border-border/20 bg-muted shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <Image
                                src={project.thumbnail}
                                alt={project.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">
                                {project.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {project.description}
                            </p>
                        </div>

                        {/* Role */}
                        <div className="w-48 text-xs text-muted-foreground/90 truncate mr-2">
                            {project.role}
                        </div>

                        {/* Brand */}
                        <div className="w-32 text-xs text-muted-foreground/90 truncate mr-2">
                            {project.brand}
                        </div>

                        {/* Year */}
                        <div className="w-16 text-[11px] font-mono text-muted-foreground/70 text-right">
                            {project.year}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
