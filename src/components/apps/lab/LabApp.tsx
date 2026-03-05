"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, Spade, Skull } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useWindowStore } from "@/stores/useWindowStore";
import { TypingTestDemo } from "./demos/TypingTestDemo";
import { BlackjackDemo } from "./demos/BlackjackDemo";
import { AppleRunnerDemo } from "./demos/AppleRunnerDemo";
import { OrbitFlapDemo } from "./demos/OrbitFlapDemo";
import { TheStackDemo } from "./demos/TheStackDemo";
import { VirusProtocolDemo } from "./demos/VirusProtocolDemo";
import { LabSidebar, LabSectionId } from "./LabSidebar";

export default function LabApp() {
    const { closeWindow, getWindowByAppId } = useWindowStore();
    const [activeSection, setActiveSection] = useState<LabSectionId>("typing");
    const [showMobileWarning, setShowMobileWarning] = useState(false);

    const handleKickOut = useCallback(() => {
        const labWindow = getWindowByAppId("lab");
        if (labWindow) {
            closeWindow(labWindow.id);
        }
        setShowMobileWarning(false);
    }, [closeWindow, getWindowByAppId]);

    const playAlertSound = useCallback(() => {
        // Using a more reliable CDN for the alert sound
        const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");
        audio.volume = 0.4;
        audio.play().catch(e => console.log("Audio play blocked", e));
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 768) {
                setShowMobileWarning(true);
                playAlertSound();
            }
        };
        const timer = setTimeout(checkMobile, 500);
        return () => clearTimeout(timer);
    }, [playAlertSound]);

    return (
        <div className="h-full flex flex-row overflow-hidden font-sans select-none relative">
            {/* ── Mobile Warning Overlay ─────────────────────────── */}
            <AnimatePresence>
                {showMobileWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/40 backdrop-blur-md md:hidden"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white/95 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_40px_80px_rgba(255,59,48,0.3)] border border-red-200 max-w-sm w-full flex flex-col items-center text-center gap-6"
                        >
                            {/* Skull Icon Container */}
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl"
                                />
                                <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-yellow-400 shadow-xl shadow-red-600/20 relative z-10 border-2 border-yellow-400/30">
                                    <Skull size={40} strokeWidth={2.5} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-slate-900 leading-tight">Desktop Recommended</h3>
                                <p className="text-[14px] text-slate-600 leading-relaxed font-semibold">
                                    The Games in Game Center require <span className="text-red-600 underline decoration-yellow-400 decoration-2 underline-offset-4">Keyboard & Mouse</span> for the ultimate experience.
                                </p>
                            </div>

                            <button
                                onClick={handleKickOut}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-yellow-400 rounded-2xl font-black text-sm transition-all active:scale-[0.98] shadow-lg shadow-red-500/40 uppercase tracking-[0.2em] border-b-4 border-red-800"
                            >
                                I Understand
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        className="flex-1 flex flex-col overflow-y-auto px-6 py-8 md:px-10 md:py-12 hide-scrollbar"
                    >
                        {/* ── Header ────────────────────────────────────────── */}
                        <div className="mb-12">
                            <h1 className="text-[26px] font-bold tracking-tight mb-2 text-foreground">
                                {activeSection === "typing" ? "Keyboard Test" : activeSection === "blackjack" ? "Blackjack" : activeSection === "applerunner" ? "Apple Runner" : activeSection === "orbitflap" ? "Orbit Flap" : activeSection === "thestack" ? "The Stack" : activeSection === "virusprotocol" ? "Virus Protocol" : "Game Center"}
                            </h1>
                            <p className="max-w-[600px] text-[15px] text-foreground/50 leading-relaxed font-medium">
                                Test your skills with fun
                                <span className="text-[#007AFF]"> mini games</span>.
                            </p>
                        </div>

                        {/* ── Game Grid / Canvas ─────────────────────────────────────────── */}
                        {(activeSection === "typing" || activeSection === "blackjack") ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
                                {activeSection === "typing" && (
                                    <div className="col-span-1 md:col-span-2 xl:col-span-3">
                                        <DemoContainer title="Keyboard Test" icon={Keyboard} className="!aspect-auto min-h-[500px] h-fit sm:min-h-[550px]">
                                            <TypingTestDemo />
                                        </DemoContainer>
                                    </div>
                                )}

                                {activeSection === "blackjack" && (
                                    <div className="col-span-1 md:col-span-2 xl:col-span-3">
                                        <DemoContainer title="Blackjack" icon={Spade} className="!aspect-auto min-h-[550px] h-fit sm:min-h-[600px]">
                                            <BlackjackDemo />
                                        </DemoContainer>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 w-full min-h-[500px] md:min-h-[600px] rounded-[2rem] overflow-hidden border border-black/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.12)] relative bg-white/50">
                                {activeSection === "applerunner" && <AppleRunnerDemo />}
                                {activeSection === "orbitflap" && <OrbitFlapDemo />}
                                {activeSection === "thestack" && <TheStackDemo />}
                                {activeSection === "virusprotocol" && <VirusProtocolDemo />}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function DemoContainer({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType; children: React.ReactNode, className?: string }) {
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
                    PLAY
                </div>
            </div>
            <div className={`aspect-square rounded-[2rem] bg-white/20 border border-black/[0.03] overflow-hidden relative shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-500 ease-[p-bezier(0.23,1,0.32,1)] ${className || ""}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-10" />
                {children}
            </div>
        </motion.div>
    );
}
