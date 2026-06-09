"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentProps, ElementType, ReactNode } from "react";
import {
    Check,
    Monitor,
    Moon,
    Palette,
    RotateCcw,
    Sparkles,
    Sun,
    Wallpaper,
} from "lucide-react";

import { useDesktopStore } from "@/stores/useDesktopStore";
import { useThemeStore } from "@/stores/useThemeStore";

const WALLPAPER_OPTIONS = [
    {
        id: "big-sur",
        name: "Big Sur",
        value: 'url("/macos-big.jpg")',
        preview: "linear-gradient(135deg, #223461 0%, #6ba6c9 28%, #a95df1 56%, #c34743 100%)",
    },
    {
        id: "twilight",
        name: "Twilight",
        value: 'linear-gradient(135deg, #17203f 0%, #784ba0 46%, #d85454 100%)',
        preview: "linear-gradient(135deg, #17203f 0%, #784ba0 46%, #d85454 100%)",
    },
    {
        id: "aurora",
        name: "Aurora",
        value: 'radial-gradient(circle at 18% 18%, rgba(124,156,181,0.95), transparent 34%), radial-gradient(circle at 78% 28%, rgba(198,123,92,0.9), transparent 32%), linear-gradient(135deg, #1d2248 0%, #5f477f 52%, #b74754 100%)',
        preview: "radial-gradient(circle at 18% 18%, #7c9cb5, transparent 34%), radial-gradient(circle at 78% 28%, #c67b5c, transparent 32%), linear-gradient(135deg, #1d2248 0%, #5f477f 52%, #b74754 100%)",
    },
];

const ACCENT_OPTIONS = [
    { name: "Blue", value: "#007AFF" },
    { name: "Terracotta", value: "#C67B5C" },
    { name: "Sage", value: "#8B9E7E" },
    { name: "Rose", value: "#FA233B" },
    { name: "Violet", value: "#AF52DE" },
];

type SettingsSection = "appearance" | "desktop" | "accessibility";

export default function SettingsApp() {
    const [section, setSection] = useState<SettingsSection>("appearance");
    const wallpaper = useDesktopStore((s) => s.wallpaper);
    const setWallpaper = useDesktopStore((s) => s.setWallpaper);
    const resetIconLayout = useDesktopStore((s) => s.resetIconLayout);

    const appearance = useThemeStore((s) => s.appearance);
    const accentColor = useThemeStore((s) => s.accentColor);
    const reduceMotion = useThemeStore((s) => s.reduceMotion);
    const setAppearance = useThemeStore((s) => s.setAppearance);
    const setAccentColor = useThemeStore((s) => s.setAccentColor);
    const setReduceMotion = useThemeStore((s) => s.setReduceMotion);

    useEffect(() => {
        document.documentElement.style.setProperty("--primary", accentColor);
        document.documentElement.style.setProperty("--ring", accentColor);
    }, [accentColor]);

    useEffect(() => {
        const isDark =
            appearance === "dark" ||
            (appearance === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

        document.documentElement.classList.toggle("dark", isDark);
    }, [appearance]);

    const selectedWallpaper = useMemo(
        () => WALLPAPER_OPTIONS.find((item) => item.value === wallpaper)?.id ?? "custom",
        [wallpaper]
    );

    return (
        <div className="flex h-full overflow-hidden bg-[#F5F5F7] text-[#1C1C1E]">
            <aside className="hidden w-[220px] shrink-0 border-r border-black/10 bg-white/45 p-4 backdrop-blur-xl md:block">
                <div className="mb-5 px-2">
                    <h1 className="text-[20px] font-bold tracking-tight">Settings</h1>
                    <p className="text-[11px] font-semibold text-black/35">DzakOS preferences</p>
                </div>

                <nav className="space-y-1">
                    <SidebarItem
                        icon={Palette}
                        label="Appearance"
                        active={section === "appearance"}
                        onClick={() => setSection("appearance")}
                    />
                    <SidebarItem
                        icon={Wallpaper}
                        label="Desktop"
                        active={section === "desktop"}
                        onClick={() => setSection("desktop")}
                    />
                    <SidebarItem
                        icon={Sparkles}
                        label="Accessibility"
                        active={section === "accessibility"}
                        onClick={() => setSection("accessibility")}
                    />
                </nav>
            </aside>

            <main className="flex-1 overflow-y-auto p-5 md:p-8">
                <div className="mx-auto max-w-[720px] space-y-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-black/35">
                            {section}
                        </p>
                        <h2 className="mt-1 text-[28px] font-bold tracking-tight">
                            {section === "appearance"
                                ? "Appearance"
                                : section === "desktop"
                                    ? "Desktop"
                                    : "Accessibility"}
                        </h2>
                    </div>

                    {section === "appearance" && (
                        <>
                            <Panel title="Appearance Mode" icon={Monitor}>
                                <div className="grid grid-cols-3 gap-3">
                                    <SegmentButton active={appearance === "system"} onClick={() => setAppearance("system")} icon={Monitor} label="System" />
                                    <SegmentButton active={appearance === "light"} onClick={() => setAppearance("light")} icon={Sun} label="Light" />
                                    <SegmentButton active={appearance === "dark"} onClick={() => setAppearance("dark")} icon={Moon} label="Dark" />
                                </div>
                            </Panel>

                            <Panel title="Accent Color" icon={Palette}>
                                <div className="flex flex-wrap gap-3">
                                    {ACCENT_OPTIONS.map((accent) => (
                                        <button
                                            key={accent.value}
                                            type="button"
                                            onClick={() => setAccentColor(accent.value)}
                                            className="flex items-center gap-2 rounded-full border border-black/10 bg-white/65 px-3 py-2 text-[12px] font-bold shadow-sm transition hover:bg-white"
                                        >
                                            <span
                                                className="flex h-5 w-5 items-center justify-center rounded-full"
                                                style={{ backgroundColor: accent.value }}
                                            >
                                                {accentColor === accent.value && <Check size={13} className="text-white" strokeWidth={3} />}
                                            </span>
                                            {accent.name}
                                        </button>
                                    ))}
                                </div>
                            </Panel>
                        </>
                    )}

                    {section === "desktop" && (
                        <>
                            <Panel title="Wallpaper" icon={Wallpaper}>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {WALLPAPER_OPTIONS.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => setWallpaper(option.value)}
                                            className="group text-left"
                                        >
                                            <div
                                                className="relative aspect-video overflow-hidden rounded-2xl border border-white/60 shadow-sm transition group-hover:scale-[1.02]"
                                                style={{ background: option.preview }}
                                            >
                                                {selectedWallpaper === option.id && (
                                                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow-sm">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="mt-2 text-[12px] font-bold text-black/70">{option.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </Panel>

                            <Panel title="Desktop Icons" icon={LayoutIcon}>
                                <button
                                    type="button"
                                    onClick={resetIconLayout}
                                    className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-black/10 transition active:scale-[0.98]"
                                >
                                    <RotateCcw size={15} />
                                    Clean Up Icons
                                </button>
                            </Panel>
                        </>
                    )}

                    {section === "accessibility" && (
                        <Panel title="Motion" icon={Sparkles}>
                            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white/70 p-4 shadow-sm">
                                <div>
                                    <p className="text-[14px] font-bold">Reduce Motion</p>
                                    <p className="text-[12px] font-medium text-black/40">
                                        Keep animations calmer across the desktop experience.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={reduceMotion}
                                    onChange={(event) => setReduceMotion(event.target.checked)}
                                    className="h-5 w-5 accent-[var(--primary)]"
                                />
                            </label>
                        </Panel>
                    )}
                </div>
            </main>
        </div>
    );
}

function SidebarItem({
    icon: Icon,
    label,
    active,
    onClick,
}: {
    icon: ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition ${active ? "bg-white text-black shadow-sm" : "text-black/55 hover:bg-white/55 hover:text-black"}`}
        >
            <Icon size={16} className={active ? "text-[var(--primary)]" : "text-black/40"} />
            {label}
        </button>
    );
}

function Panel({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: ElementType;
    children: ReactNode;
}) {
    return (
        <section className="rounded-[22px] border border-white/60 bg-white/60 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 text-black/55">
                    <Icon size={17} />
                </div>
                <h3 className="text-[15px] font-bold tracking-tight">{title}</h3>
            </div>
            {children}
        </section>
    );
}

function SegmentButton({
    active,
    onClick,
    icon: Icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: ElementType;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border text-[13px] font-bold transition ${active ? "border-[var(--primary)] bg-white text-black shadow-sm" : "border-black/5 bg-white/45 text-black/45 hover:bg-white"}`}
        >
            <Icon size={22} />
            {label}
        </button>
    );
}

function LayoutIcon(props: ComponentProps<"svg">) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <rect x="3" y="4" width="7" height="7" rx="1.5" />
            <rect x="14" y="4" width="7" height="7" rx="1.5" />
            <rect x="3" y="15" width="7" height="5" rx="1.5" />
            <rect x="14" y="15" width="7" height="5" rx="1.5" />
        </svg>
    );
}
