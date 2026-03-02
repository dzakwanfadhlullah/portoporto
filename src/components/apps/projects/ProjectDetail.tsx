"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useWindowActions } from "../../os/WindowContext";
import { projects } from "./data";

export default function ProjectDetail() {
    const { metadata, setHeaderActions } = useWindowActions();

    const [currentIndex] = useState(() => {
        const id = metadata?.projectId;
        return projects.findIndex((p) => p.id === id) || 0;
    });

    const project = projects[currentIndex] || projects[0];

    // Clear header actions that might have been set previously
    useEffect(() => {
        setHeaderActions(null);
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    if (!project) return null;

    return (
        <div className="flex flex-col h-full bg-[#ECECEC] overflow-y-auto font-sans select-text text-black/90 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Header Info Area */}
            <div className="flex gap-[10px] px-3 py-3 items-center border-b border-black/10">
                <div className="relative w-10 h-10 shrink-0 bg-white shadow-sm rounded-[4px] border border-black/10 flex items-center justify-center p-0.5">
                    <div className="relative w-full h-full overflow-hidden">
                        <Image
                            src={project.thumbnail}
                            alt={project.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center leading-[1.2]">
                    <div className="font-bold text-[12px] text-black tracking-tight font-sf-pro">
                        {project.brand}
                    </div>
                    <div className="text-[11px] font-semibold text-black/60 font-sf-pro">
                        {project.name}
                    </div>
                </div>
            </div>

            <div className="px-3 pb-3 flex flex-col gap-3 pt-3">
                {/* Main Description */}
                <div className="bg-white/80 border border-black/[0.06] px-3 py-2.5 shadow-[0_0.5px_2px_rgba(0,0,0,0.04),inset_0_0.5px_0_rgba(255,255,255,0.8)]">
                    <div className="text-[11px] leading-[1.5] font-medium text-black/70 font-sf-pro">
                        {project.description}
                    </div>
                </div>

                {/* Details Accordion */}
                <details className="group" open>
                    <summary className="flex items-center gap-[2px] text-[11px] font-bold text-black/70 cursor-pointer mb-1 list-none focus:outline-none [&::-webkit-details-marker]:hidden select-none">
                        <ChevronRight strokeWidth={2.5} className="w-2.5 h-2.5 transition-transform group-open:rotate-90 text-black/40" />
                        Details:
                    </summary>
                    <div className="pl-3.5 pr-1 text-[11px] font-bold text-black/80 leading-tight">
                        Type: {project.tags.join(" > ")}

                        <div className="mt-[6px] text-black/60 font-medium space-y-[2px]">
                            <div><span className="font-bold text-black/80">Role:</span> {project.role}</div>
                            <div><span className="font-bold text-black/80">Year:</span> {project.year}</div>
                        </div>
                    </div>
                </details>

                {/* Preview Accordion */}
                <details className="group" open>
                    <summary className="flex items-center gap-[2px] text-[11px] font-bold text-black/70 cursor-pointer mb-1.5 list-none focus:outline-none [&::-webkit-details-marker]:hidden select-none">
                        <ChevronRight strokeWidth={2.5} className="w-2.5 h-2.5 transition-transform group-open:rotate-90 text-black/40" />
                        Preview:
                    </summary>
                    <div className="pl-3.5 pr-1 pb-3 flex flex-col gap-2">
                        {/* Section 1: 1 Large Photo */}
                        <div className="relative w-full aspect-video rounded-sm overflow-hidden bg-white/20 border border-black/10 shadow-sm">
                            <Image
                                src={project.thumbnail}
                                alt={`${project.name} preview 1`}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Section 2: 2 Photos */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-white/20 border border-black/10 shadow-sm">
                                <Image
                                    src={project.thumbnail}
                                    alt={`${project.name} preview 2`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-white/20 border border-black/10 shadow-sm">
                                <Image
                                    src={project.thumbnail}
                                    alt={`${project.name} preview 3`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Section 3: 3 Photos */}
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-white/20 border border-black/10 shadow-sm">
                                <Image
                                    src={project.thumbnail}
                                    alt={`${project.name} preview 4`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-white/20 border border-black/10 shadow-sm">
                                <Image
                                    src={project.thumbnail}
                                    alt={`${project.name} preview 5`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-white/20 border border-black/10 shadow-sm">
                                <Image
                                    src={project.thumbnail}
                                    alt={`${project.name} preview 6`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
}
