"use client";

import { motion } from "framer-motion";
import { Gamepad2, Keyboard, Spade } from "lucide-react";

export type LabSectionId = "typing" | "blackjack";

interface NavItem {
    id: LabSectionId;
    label: string;
    icon: any;
}

const NAV_ITEMS: NavItem[] = [
    { id: "typing", label: "Keyboard Test", icon: Keyboard },
    { id: "blackjack", label: "Blackjack", icon: Spade },
];

interface LabSidebarProps {
    activeSection: LabSectionId;
    onSectionChange: (id: LabSectionId) => void;
}

export function LabSidebar({ activeSection, onSectionChange }: LabSidebarProps) {
    return (
        <div className="w-[240px] shrink-0 bg-[#F6F6F6]/60 backdrop-blur-xl border-r border-black/[0.05] flex flex-col pt-12 px-3 pb-4 select-none">
            <div className="flex items-center gap-3 mb-8 px-3">
                <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center text-white shadow-sm">
                    <Gamepad2 size={18} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-[15px] font-bold tracking-tight text-black">Game Center</h2>
                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Mini Games</p>
                </div>
            </div>

            <nav className="flex flex-col gap-0.5">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`relative flex items-center gap-2.5 px-3 py-2 transition-colors duration-200 group rounded-md text-[13px] font-semibold ${activeSection === item.id
                            ? "text-black"
                            : "text-black/50 hover:text-black hover:bg-black/5"
                            }`}
                    >
                        {activeSection === item.id && (
                            <motion.div
                                layoutId="active-lab-bar"
                                className="absolute inset-0 bg-black/5 rounded-md shadow-sm"
                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            />
                        )}
                        <item.icon
                            size={16}
                            strokeWidth={activeSection === item.id ? 2.5 : 2}
                            className={`relative z-10 transition-colors ${activeSection === item.id ? "text-[#007AFF]" : "text-black/40 group-hover:text-black/60"
                                }`}
                        />
                        <span className="relative z-10">
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto px-3 py-4">
                <div className="p-4 rounded-xl bg-white/40 border border-white/60 shadow-sm backdrop-blur-sm">
                    <p className="text-[11px] font-medium text-black/40 leading-relaxed">
                        Play mini games and test your skills. More games coming soon!
                    </p>
                </div>
            </div>
        </div>
    );
}
