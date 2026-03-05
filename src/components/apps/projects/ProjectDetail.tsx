"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowActions } from "../../os/WindowContext";
import { projects } from "./data";

export default function ProjectDetail() {
    const { metadata, setHeaderActions } = useWindowActions();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [currentIndex] = useState(() => {
        const id = metadata?.projectId;
        return projects.findIndex((p) => p.id === id) || 0;
    });

    const project = projects[currentIndex] || projects[0];

    // Clear header actions
    useEffect(() => {
        setHeaderActions(null);
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    if (!project) return null;

    const displayImages = project.detailImages || [project.thumbnail];
    const isMobileApp = project.tags.some(t => t.toLowerCase() === 'mobile');

    return (
        <div className="flex flex-col h-full bg-[#ECECEC] overflow-y-auto font-sans select-text text-black/90 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative">
            {/* Header Info Area (Original Style) */}
            <div className="flex gap-[10px] px-3 py-3 items-center border-b border-black/10 bg-[#ECECEC] sticky top-0 z-10">
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

            <div className="px-3 pb-8 flex flex-col gap-3 pt-3">
                {/* Main Description (Original Style) */}
                <div className="bg-white/80 border border-black/[0.06] px-3 py-2.5 shadow-[0_0.5px_2px_rgba(0,0,0,0.04),inset_0_0.5px_0_rgba(255,255,255,0.8)]">
                    <div className="text-[11px] leading-[1.5] font-medium text-black/70 font-sf-pro">
                        {project.description}
                    </div>
                </div>

                {/* Details Accordion (Original Style) */}
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

                {/* Preview Accordion (Enhanced Opsi A inside) */}
                <details className="group" open>
                    <summary className="flex items-center gap-[2px] text-[11px] font-bold text-black/70 cursor-pointer mb-2 list-none focus:outline-none [&::-webkit-details-marker]:hidden select-none">
                        <ChevronRight strokeWidth={2.5} className="w-2.5 h-2.5 transition-transform group-open:rotate-90 text-black/40" />
                        Preview (Vertical Showcase):
                    </summary>
                    <div className={`pl-3.5 pr-1 pt-1 ${isMobileApp ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-6'}`}>
                        {displayImages.map((img, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group flex flex-col gap-1.5"
                            >
                                <div
                                    className={`relative w-full ${isMobileApp ? 'aspect-[9/19]' : 'aspect-video'} rounded-lg overflow-hidden bg-white shadow-md border border-black/5 cursor-zoom-in transition-transform duration-300 hover:scale-[1.005]`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <Image
                                        src={img}
                                        alt={`${project.name} view ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                        <div className="p-2 bg-white/90 backdrop-blur-md rounded-full translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all shadow-lg">
                                            <Maximize2 size={16} className="text-black/70" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between opacity-30 text-[9px] font-bold tracking-widest px-1">
                                    <span>VIEW 0{idx + 1}</span>
                                    <span className="truncate ml-2 text-right">{project.brand.toUpperCase()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </details>
            </div>

            {/* ── Lightbox Modal ────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 cursor-default"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Blur Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-white/40 backdrop-blur-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />

                        {/* Image Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={`relative w-full ${isMobileApp ? 'max-w-[400px] aspect-[9/19]' : 'max-w-[1200px] aspect-video'} rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white/50`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage}
                                alt="Full scale preview"
                                fill
                                className="object-cover"
                            />
                            {/* Close Button UI */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-6 right-6 p-2.5 bg-black/10 hover:bg-black/20 backdrop-blur-xl rounded-full text-black transition-all"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
