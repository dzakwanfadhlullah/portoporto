"use client";

import { motion } from "framer-motion";
import {
    Users,
    ShieldCheck,
    LineChart,
    Calendar,
    Briefcase,
    Milestone
} from "lucide-react";

interface TimelineEntry {
    org: string;
    role: string;
    period: string;
    description: string[];
    tags: string[];
    color: string;
    icon: any;
}

const LEADERSHIP_DATA: TimelineEntry[] = [
    {
        org: "BEM Kema FMIPA Unpad",
        role: "Head of Internal Relations",
        period: "Feb 2024 - Feb 2025",
        description: [
            "Led 4 programs, 200+ participants",
            "Managed 15+ student institutions",
            "Designed internal platforms"
        ],
        tags: ["Leadership", "Management", "Internal Strategy"],
        color: "bg-orange-500",
        icon: Users
    },
    {
        org: "DPA Himatif FMIPA Unpad",
        role: "Head of Commission IV",
        period: "Feb 2024 - Feb 2025",
        description: [
            "Established evaluation standards",
            "Directed legislative oversight",
            "Monitored operational timelines"
        ],
        tags: ["Management", "Strategy", "Evaluation"],
        color: "bg-blue-500",
        icon: ShieldCheck
    }
];

export default function LeadershipApp() {
    return (
        <div className="h-full bg-background flex flex-col overflow-hidden selection:bg-primary/20">
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="p-12 pb-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Milestone size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">Leadership.</h1>
                        <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">Organizational Experience</p>
                    </div>
                </div>
                <p className="max-w-[600px] text-lg text-muted-foreground leading-relaxed font-medium">
                    Driving impact through structured leadership, legislative oversight, and
                    strategic internal coordination.
                </p>
            </div>

            {/* ── Timeline ─────────────────────────────────────────────── */}
            <div className="flex-1 overflow-auto px-12 pb-24 relative">
                <div className="max-w-[800px] relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[27px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-primary/40 via-border/40 to-transparent" />

                    <div className="space-y-12">
                        {LEADERSHIP_DATA.map((entry, idx) => (
                            <TimelineCard key={entry.org} entry={entry} index={idx} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="flex gap-8 relative"
        >
            {/* Timeline Dot/Icon */}
            <div className={`mt-2 w-14 h-14 rounded-2xl ${entry.color} bg-opacity-10 border border-current flex items-center justify-center shrink-0 z-10 shadow-sm transition-transform hover:scale-110 duration-300`}>
                <entry.icon size={24} className={entry.color.replace('bg-', 'text-')} />
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-muted/20 border border-border/40 rounded-3xl p-8 hover:bg-muted/30 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-primary/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
                    <div>
                        <span className={`inline-block px-3 py-1 rounded-full ${entry.color} bg-opacity-10 ${entry.color.replace('bg-', 'text-')} text-[10px] font-bold uppercase tracking-widest mb-2`}>
                            {entry.org}
                        </span>
                        <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                            {entry.role}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground bg-background/50 px-3 py-1.5 rounded-xl border border-border/20 self-start">
                        <Calendar size={14} />
                        <span className="text-[11px] font-bold font-mono tracking-tight">{entry.period}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    {entry.description.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className={`mt-2 w-1.5 h-1.5 rounded-full ${entry.color} shrink-0 opacity-40`} />
                            <p className="text-[15px] font-medium text-muted-foreground/90 leading-relaxed italic">
                                &ldquo;{item}&rdquo;
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-background/50 border border-border/20 rounded-full text-[11px] font-bold text-muted-foreground/80 hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
