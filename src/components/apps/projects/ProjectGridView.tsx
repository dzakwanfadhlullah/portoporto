"use client";

import type { Project } from "./data";
import Image from "next/image";
import { useWindowStore } from "@/stores/useWindowStore";

interface ProjectGridViewProps {
    projects: Project[];
}

export const ProjectGridView = ({ projects }: ProjectGridViewProps) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className="group bg-muted/30 rounded-2xl border border-border/40 overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                    onClick={() => handleOpenDetail(project)}
                >
                    {/* Thumbnail */}
                    <div className="aspect-video relative overflow-hidden bg-muted">
                        <Image
                            src={project.thumbnail}
                            alt={project.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 bg-background/80 backdrop-blur-md rounded-md text-[10px] font-mono tracking-tighter border border-border/20 shadow-sm">
                                {project.year}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-3">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-1 block">
                                {project.brand}
                            </span>
                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                {project.name}
                            </h3>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-muted-foreground/5 rounded-full text-[10px] text-muted-foreground border border-border/10"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
