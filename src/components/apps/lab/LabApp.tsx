"use client";

import { motion } from "framer-motion";
import {
    FlaskConical,
    Layers,
    MousePointer2,
    Wind,
    Grid,
    CircleDashed,
    SunMoon
} from "lucide-react";
import { useState } from "react";
import { GlassCardDemo } from "./demos/GlassCardDemo";
import { SpringDemo } from "./demos/SpringDemo";
import { BentoDemo } from "./demos/BentoDemo";
import { ActivityRingsDemo } from "./demos/ActivityRingsDemo";
import { HoverDemo } from "./demos/HoverDemo";
import { ThemeDemo } from "./demos/ThemeDemo";

export default function LabApp() {
    return (
        <div className="h-full bg-background flex flex-col overflow-hidden selection:bg-primary/20">
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="p-12 pb-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <FlaskConical size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">Lab.</h1>
                        <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">Experimental UI Showcase</p>
                    </div>
                </div>
                <p className="max-w-[600px] text-lg text-muted-foreground leading-relaxed font-medium">
                    A collection of interactive components and motion experiments focused on
                    <span className="text-foreground"> micro-interactions</span>,
                    <span className="text-foreground"> glassmorphism</span>, and
                    <span className="text-foreground"> physics-based animations</span>.
                </p>
            </div>

            {/* ── Demo Grid ─────────────────────────────────────────────── */}
            <div className="flex-1 overflow-auto px-12 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DemoContainer title="Glassmorphism" icon={Layers}>
                        <GlassCardDemo />
                    </DemoContainer>

                    <DemoContainer title="Spring Physics" icon={Wind}>
                        <SpringDemo />
                    </DemoContainer>

                    <DemoContainer title="Bento Grid" icon={Grid}>
                        <BentoDemo />
                    </DemoContainer>

                    <DemoContainer title="Activity Rings" icon={CircleDashed}>
                        <ActivityRingsDemo />
                    </DemoContainer>

                    <DemoContainer title="Hover State" icon={MousePointer2}>
                        <HoverDemo />
                    </DemoContainer>

                    <DemoContainer title="Theme Transition" icon={SunMoon}>
                        <ThemeDemo />
                    </DemoContainer>
                </div>
            </div>
        </div>
    );
}

function DemoContainer({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
        >
            <div className="flex items-center gap-2 px-1">
                <Icon size={14} className="text-muted-foreground" />
                <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80">{title}</span>
            </div>
            <div className="aspect-square rounded-3xl bg-muted/20 border border-border/40 overflow-hidden relative group shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500">
                {children}
            </div>
        </motion.div>
    );
}
