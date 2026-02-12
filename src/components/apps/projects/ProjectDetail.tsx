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
            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/20">
                <button
                    onClick={handlePrev}
                    className="p-1 rounded hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft size={14} />
                </button>
                <div className="w-[1px] h-3 bg-border/40 mx-0.5" />
                <button
                    onClick={handleNext}
                    className="p-1 rounded hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        );
        return () => setHeaderActions(null);
    }, [currentIndex, setHeaderActions]);

    if (!project) return null;

    return (
        <div className="relative flex flex-col h-full bg-background overflow-hidden selection:bg-primary/20">
            {/* ── Hero Area ────────────────────────────────────────────────── */}
            <div className="relative h-[320px] shrink-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={project.thumbnail}
                            alt={project.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* ── Floating Info Panel (Frame 3 style) ──────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-6 right-6 w-72 glass-dark p-5 rounded-2xl border border-white/10 shadow-2xl z-10"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <Info size={12} className="text-primary" />
                        </div>
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/50">
                            Quick Info
                        </h4>
                    </div>

                    <div className="space-y-4">
                        <InfoItem label="Year" value={project.year} />
                        <InfoItem label="Role" value={project.role} />
                        <InfoItem label="Brand" value={project.brand} />

                        <div className="pt-2">
                            <div className="flex gap-2">
                                <button className="flex-1 bg-white text-black text-[11px] font-bold py-2 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-1.5 shadow-lg">
                                    <ExternalLink size={12} />
                                    Live Demo
                                </button>
                                <button className="w-10 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center border border-white/5">
                                    <Github size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Content Area ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-auto bg-background px-12 py-10">
                <div className="max-w-[720px]">
                    <motion.div
                        key={project.id + "-content"}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-5xl font-black tracking-tighter mb-8 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                            {project.name}
                        </h1>

                        <section className="mb-12">
                            <h2 className="text-xs uppercase tracking-widest font-bold text-primary mb-4">Overview</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                                {project.description}
                            </p>
                        </section>

                        <div className="grid grid-cols-2 gap-12 mb-12">
                            <section>
                                <h3 className="text-[11px] uppercase tracking-wider font-bold text-foreground/40 mb-3">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-muted rounded-full text-[11px] font-semibold border border-border/40">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[11px] uppercase tracking-wider font-bold text-foreground/40 mb-3">Platform</h3>
                                <p className="text-sm font-bold text-foreground">{project.brand}</p>
                            </section>
                        </div>

                        <hr className="border-border/40 mb-12" />

                        <section className="mb-12">
                            <h2 className="text-xs uppercase tracking-widest font-bold text-primary mb-6">The Approach</h2>
                            <div className="space-y-6 text-muted-foreground leading-relaxed">
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

                        {/* Additional spacing at bottom */}
                        <div className="h-24" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">{label}</span>
            <span className="text-[13px] font-semibold text-white/90">{value}</span>
        </div>
    );
}
