"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    FlaskConical,
    Layers,
    MousePointer2,
    Wind,
    Grid,
    CircleDashed,
    SunMoon,
    Layout
} from "lucide-react";
import { useState } from "react";
import { GlassCardDemo } from "./demos/GlassCardDemo";
import { SpringDemo } from "./demos/SpringDemo";
import { BentoDemo } from "./demos/BentoDemo";
import { ActivityRingsDemo } from "./demos/ActivityRingsDemo";
import { HoverDemo } from "./demos/HoverDemo";
import { ThemeDemo } from "./demos/ThemeDemo";
import { LabSidebar, LabSectionId } from "./LabSidebar";

export default function LabApp() {
    const [activeSection, setActiveSection] = useState<LabSectionId>("all");

    return (
        <div className="h-full flex flex-row overflow-hidden font-sans select-none">
            {/* ── Sidebar ────────────────────────────────────────── */}
            <LabSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

            {/* ── Main Content Area ───────────────────────────────────── */}
            <div className="flex-1 h-full bg-card/50 backdrop-blur-md relative overflow-hidden flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex-1 overflow-y-auto px-10 py-12 hide-scrollbar"
                    >
                        {/* ── Header ────────────────────────────────────────── */}
                        <div className="mb-12">
                            <h1 className="text-[26px] font-bold tracking-tight mb-2 text-foreground">
                                {activeSection === "all" ? "Latest Experiments" :
                                    activeSection === "glass" ? "Glassmorphism" :
                                        activeSection === "physics" ? "Spring Physics" :
                                            activeSection === "layout" ? "UI Layouts" : "Interaction"}
                            </h1>
                            <p className="max-w-[600px] text-[15px] text-foreground/50 leading-relaxed font-medium">
                                Explore interactive components focused on
                                <span className="text-[#007AFF]"> micro-interactions</span>,
                                <span className="text-[#007AFF]"> glassmorphism</span>, and
                                <span className="text-[#007AFF]"> motion physics</span>.
                            </p>
                        </div>

                        {/* ── Demo Grid ─────────────────────────────────────────── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
                            {(activeSection === "all" || activeSection === "glass") && (
                                <DemoContainer title="Glassmorphism" icon={Layers}>
                                    <GlassCardDemo />
                                </DemoContainer>
                            )}

                            {(activeSection === "all" || activeSection === "physics") && (
                                <DemoContainer title="Spring Physics" icon={Wind}>
                                    <SpringDemo />
                                </DemoContainer>
                            )}

                            {(activeSection === "all" || activeSection === "layout") && (
                                <DemoContainer title="Bento Grid" icon={Grid}>
                                    <BentoDemo />
                                </DemoContainer>
                            )}

                            {(activeSection === "all" || activeSection === "interaction") && (
                                <DemoContainer title="Activity Rings" icon={CircleDashed}>
                                    <ActivityRingsDemo />
                                </DemoContainer>
                            )}

                            {(activeSection === "all" || activeSection === "interaction") && (
                                <DemoContainer title="Hover State" icon={MousePointer2}>
                                    <HoverDemo />
                                </DemoContainer>
                            )}

                            {(activeSection === "all" || activeSection === "layout") && (
                                <DemoContainer title="Theme Transition" icon={SunMoon}>
                                    <ThemeDemo />
                                </DemoContainer>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function DemoContainer({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 group"
        >
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-black/5 flex items-center justify-center text-black/40 group-hover:bg-[#007AFF]/10 group-hover:text-[#007AFF] transition-colors">
                        <Icon size={12} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] uppercase tracking-widest font-bold text-black/40 group-hover:text-black/60 transition-colors">
                        {title}
                    </span>
                </div>
                <div className="text-[10px] font-bold text-[#007AFF] opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                    VIEW DEMO
                </div>
            </div>
            <div className="aspect-square rounded-[2rem] bg-white/20 border border-black/[0.03] overflow-hidden relative shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-500 ease-[p-bezier(0.23,1,0.32,1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-10" />
                {children}
            </div>
        </motion.div>
    );
}
