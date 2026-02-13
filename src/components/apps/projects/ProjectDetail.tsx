"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Info, ExternalLink, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowActions } from "../../os/WindowContext";
import { useWindowStore } from "@/stores/useWindowStore";
import { projects, type Project } from "./data";

export default function ProjectDetail() {
    const { metadata, setHeaderActions } = useWindowActions();
    const openWindow = useWindowStore((s) => s.openWindow);

    const [currentIndex, setCurrentIndex] = useState(() => {
        const id = metadata?.projectId;
        return projects.findIndex((p) => p.id === id) || 0;
    });

    const project = projects[currentIndex] || projects[0];

    // Navigation logic
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
    };

    // Register navigation arrows in title bar
    useEffect(() => {
        setHeaderActions(
            <div className="flex items-center gap-1 bg-muted/20 p-0.5 rounded-md border border-border/10">
                <button
                    onClick={handlePrev}
                    className="p-1 rounded hover:bg-black/5 text-black/40 hover:text-black transition-colors"
                >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <div className="w-[1px] h-3 bg-black/10 mx-0.5" />
                <button
                    onClick={handleNext}
                    className="p-1 rounded hover:bg-black/5 text-black/40 hover:text-black transition-colors"
                >
                    <ChevronRight size={16} strokeWidth={2.5} />
                </button>
            </div>
        );
        return () => setHeaderActions(null);
    }, [currentIndex, setHeaderActions]);

    if (!project) return null;

    return (
        <div className="relative flex flex-col h-full bg-white overflow-hidden font-sans select-none selection:bg-[#FFD600]/30">
            {/* ── Content Area ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto pt-16 pb-24 px-12 sm:px-20 hide-scrollbar">
                <div className="max-w-[1000px] mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {/* Metadata Label */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#007AFF]">Project Detail</span>
                                <div className="h-[1px] w-8 bg-[#007AFF]/20" />
                            </div>

                            {/* Project Name (Hero Typography) */}
                            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[0.9] mb-10 text-black">
                                {project.name}
                            </h1>

                            {/* Hero Image Section */}
                            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 border border-black/5 shadow-os-medium group">
                                <Image
                                    src={project.thumbnail}
                                    alt={project.name}
                                    fill
                                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                    priority
                                />
                            </div>

                            {/* Integrated Info & Description Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                {/* Left Side: Details */}
                                <div className="lg:col-span-8 space-y-12">
                                    <section>
                                        <h3 className="text-[13px] font-bold text-black uppercase opacity-25 mb-4 tracking-wider">Overview</h3>
                                        <p className="text-[17px] text-black/80 leading-relaxed font-semibold">
                                            {project.description}
                                        </p>
                                    </section>

                                    <section>
                                        <h3 className="text-[13px] font-bold text-black uppercase opacity-25 mb-4 tracking-wider">The Approach</h3>
                                        <div className="space-y-6 text-[15px] font-medium text-black/60 leading-relaxed">
                                            <p>
                                                As the {project.role}, I focused on creating a seamless user experience while maintaining technical excellence.
                                                The core challenge was ensuring the system remained performant and accessible across all platforms.
                                            </p>
                                            <p>
                                                I implemented a modular architecture that allowed for easy scaling and maintenance.
                                                By using state-of-the-art technologies and design patterns, we achieved a significant
                                                improvement in user engagement and overall system stability.
                                            </p>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Side: Sidebar Info (Inline) */}
                                <div className="lg:col-span-4 space-y-10">
                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-10">
                                        <DetailItem label="Year" value={project.year} />
                                        <DetailItem label="Role" value={project.role} />
                                        <DetailItem label="Brand" value={project.brand} />

                                        <section className="space-y-4">
                                            <h3 className="text-[11px] font-bold text-black uppercase opacity-25 tracking-[0.1em]">Stack</h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.tags.map(tag => (
                                                    <span key={tag} className="px-2.5 py-1 bg-black/[0.03] rounded-md text-[11px] font-bold text-black/60 border border-black/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-6 flex flex-col gap-3">
                                        <button className="w-full bg-black text-white text-[13px] font-bold h-11 rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10">
                                            <ExternalLink size={16} />
                                            Live Project
                                        </button>
                                        <button className="w-full bg-white text-black h-11 rounded-xl hover:bg-black/5 transition-colors flex items-center justify-center gap-2 border border-black/5 font-bold text-[13px]">
                                            <Github size={16} />
                                            Source Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-black uppercase opacity-25 tracking-[0.1em]">{label}</h4>
            <p className="font-bold text-[15px] text-black/90">{value}</p>
        </div>
    );
}
