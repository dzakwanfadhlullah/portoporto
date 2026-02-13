"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    AppWindow,
    Zap,
    FolderKanban,
    Command as CommandIcon,
    Terminal
} from "lucide-react";
import { useSpotlightStore } from "@/stores/useSpotlightStore";
import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { AppleIcon } from "./AppleIcon";
import { projects } from "../apps/projects/data";
import { useTheme } from "next-themes";

export const Spotlight = () => {
    const { isOpen, close, query, setQuery, results } = useSpotlightStore();
    const openWindow = useWindowStore((s) => s.openWindow);
    const allApps = useAppRegistry((s) => s.getAllApps());
    const searchableApps = allApps.filter(a => a.id !== "project-detail");

    const handleSelect = (item: any) => {
        if (item.appId) {
            const app = apps.get(item.appId);
            if (app) {
                openWindow(
                    app.id,
                    app.name,
                    app.defaultWindowConfig.defaultWidth,
                    app.defaultWindowConfig.defaultHeight,
                    item.metadata
                );
            }
        } else if (item.id === "cmd-toggle-theme") {
            setTheme(theme === "dark" ? "light" : "dark");
        }
        close();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="absolute inset-0 z-[9999] flex items-start justify-center pt-[20vh] p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                        className="absolute inset-0 bg-background/40 backdrop-blur-sm"
                    />

                    {/* Spotlight Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-background/80 backdrop-blur-2xl rounded-3xl border border-border/40 shadow-2xl overflow-hidden"
                    >
                        <Command className="w-full">
                            <div className="flex items-center border-b border-border/20 px-6 py-4">
                                <Search size={20} className="text-muted-foreground mr-3" />
                                <Command.Input
                                    value={query}
                                    onValueChange={setQuery}
                                    placeholder="Search apps, projects, or commands..."
                                    className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-muted-foreground/30 py-2"
                                />
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/30 border border-border/40">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">ESC</span>
                                </div>
                            </div>

                            <Command.List className="max-h-[450px] overflow-y-auto p-4 scroll-smooth">
                                <Command.Empty className="py-12 text-center text-muted-foreground font-medium">
                                    No results found for &ldquo;{query}&rdquo;
                                </Command.Empty>

                                {/* Apps Group */}
                                <Command.Group heading="Applications" className="px-2 py-3 overflow-hidden text-muted-foreground text-[11px] uppercase tracking-wider font-bold opacity-40">
                                    <div className="flex flex-col gap-1 mt-2">
                                        {searchableApps.map(app => (
                                            <CommandItem
                                                key={app.id}
                                                title={app.name}
                                                desc={`Open ${app.name} application`}
                                                iconConfig={app.iconConfig}
                                                onSelect={() => handleSelect({ appId: app.id })}
                                            />
                                        ))}
                                    </div>
                                </Command.Group>

                                {/* Projects Group */}
                                <Command.Group heading="Projects" className="px-2 py-3 overflow-hidden text-muted-foreground text-[11px] uppercase tracking-wider font-bold opacity-40 mt-2 border-t border-border/10">
                                    <div className="flex flex-col gap-1 mt-2">
                                        {projects.map(p => (
                                            <CommandItem
                                                key={p.id}
                                                title={p.name}
                                                desc={`${p.role} at ${p.brand}`}
                                                iconConfig={{ image: p.thumbnail }}
                                                style="photo"
                                                onSelect={() => handleSelect({ appId: "project-detail", metadata: { projectId: p.id } })}
                                            />
                                        ))}
                                    </div>
                                </Command.Group>

                                {/* Commands Group */}
                                <Command.Group heading="Commands" className="px-2 py-3 overflow-hidden text-muted-foreground text-[11px] uppercase tracking-wider font-bold opacity-40 mt-2 border-t border-border/10">
                                    <div className="flex flex-col gap-1 mt-2">
                                        <CommandItem
                                            title="Toggle Theme"
                                            desc="Switch between light and dark mode"
                                            iconConfig={{ icon: Zap, color: "#8E8E93" }}
                                            shortcut="⌘ D"
                                            onSelect={() => handleSelect({ id: "cmd-toggle-theme" })}
                                        />
                                        <CommandItem
                                            title="Minimize All Windows"
                                            desc="Hide all open windows"
                                            iconConfig={{ icon: CommandIcon, color: "#8E8E93" }}
                                            onSelect={() => {
                                                useWindowStore.getState().minimizeAll();
                                                close();
                                            }}
                                        />
                                        <CommandItem
                                            title="Close All Windows"
                                            desc="Terminate all running applications"
                                            iconConfig={{ icon: Terminal, color: "#8E8E93" }}
                                            onSelect={() => {
                                                useWindowStore.getState().closeAll();
                                                close();
                                            }}
                                        />
                                    </div>
                                </Command.Group>
                            </Command.List>

                            {/* Footer */}
                            <div className="px-6 py-3 bg-muted/20 border-t border-border/10 flex items-center justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                                    Spotlight Search
                                </p>
                                <div className="flex items-center gap-4">
                                    <FooterAction label="Navigate" keys={["↑", "↓"]} />
                                    <FooterAction label="Open" keys={["↵"]} />
                                </div>
                            </div>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

function CommandItem({ title, desc, iconConfig, shortcut, onSelect, style }: any) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer aria-selected:bg-primary aria-selected:text-primary-foreground group transition-colors duration-200"
        >
            <div className="w-10 h-10 rounded-xl bg-muted group-aria-selected:bg-primary-foreground/10 flex items-center justify-center transition-colors">
                <AppleIcon {...iconConfig} style={style || "symbol"} size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm tracking-tight">{title}</p>
                <p className="text-xs opacity-60 truncate font-medium">{desc}</p>
            </div>
            {shortcut && (
                <div className="text-[10px] font-black tracking-widest opacity-40 group-aria-selected:opacity-80">
                    {shortcut}
                </div>
            )}
        </Command.Item>
    );
}

function FooterAction({ label, keys }: { label: string; keys: string[] }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground/60">{label}</span>
            <div className="flex gap-1">
                {keys.map(k => (
                    <div key={k} className="w-5 h-5 rounded bg-muted border border-border/40 flex items-center justify-center text-[10px] font-black text-muted-foreground/80">
                        {k}
                    </div>
                ))}
            </div>
        </div>
    );
}
