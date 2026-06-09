"use client";

import { useEffect } from "react";
import type { ElementType } from "react";
import { Battery, Bell, ChevronRight, Moon, Settings, SlidersHorizontal, Volume2, Wifi } from "lucide-react";

import { Z_LAYERS } from "@/hooks/useZIndex";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { useWindowStore } from "@/stores/useWindowStore";

interface NotificationCenterProps {
    batteryLevel: number | null;
    charging: boolean;
    onClose: () => void;
}

export const NotificationCenter = ({ batteryLevel, charging, onClose }: NotificationCenterProps) => {
    const getApp = useAppRegistry((s) => s.getApp);
    const openWindow = useWindowStore((s) => s.openWindow);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const openSettings = () => {
        const app = getApp("settings");
        if (!app) return;

        openWindow(
            app.id,
            app.name,
            app.defaultWindowConfig.defaultWidth,
            app.defaultWindowConfig.defaultHeight
        );
        onClose();
    };

    return (
        <div
            className="fixed right-[calc(2.5vw+16px)] top-[calc(4vh+52px)] w-[330px] rounded-[26px] border border-white/35 bg-white/45 p-3 text-black shadow-[0_35px_90px_rgba(0,0,0,0.28)] backdrop-blur-3xl"
            style={{ zIndex: Z_LAYERS.NOTIFICATIONS }}
            onMouseDown={(event) => event.stopPropagation()}
        >
            <div className="grid grid-cols-2 gap-2.5">
                <ControlTile icon={Wifi} title="Wi-Fi" subtitle="Dzakwan Studio" active />
                <ControlTile icon={Moon} title="Focus" subtitle="Portfolio" />
                <ControlTile
                    icon={Battery}
                    title="Battery"
                    subtitle={`${batteryLevel ?? 100}%${charging ? " charging" : ""}`}
                    active={(batteryLevel ?? 100) > 20}
                />
                <ControlTile icon={Bell} title="Alerts" subtitle="Quiet" />
            </div>

            <div className="mt-3 rounded-2xl border border-white/45 bg-white/55 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={15} className="text-black/45" />
                        <span className="text-[12px] font-bold text-black/65">Display</span>
                    </div>
                    <span className="text-[10px] font-bold text-black/30">78%</span>
                </div>
                <SliderFill width="78%" />
            </div>

            <div className="mt-2 rounded-2xl border border-white/45 bg-white/55 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Volume2 size={15} className="text-black/45" />
                        <span className="text-[12px] font-bold text-black/65">Sound</span>
                    </div>
                    <span className="text-[10px] font-bold text-black/30">42%</span>
                </div>
                <SliderFill width="42%" />
            </div>

            <button
                type="button"
                onClick={openSettings}
                className="mt-3 flex w-full items-center justify-between rounded-2xl border border-white/45 bg-white/55 px-3 py-3 text-left text-[13px] font-bold shadow-sm transition hover:bg-white/75"
            >
                <span className="flex items-center gap-2">
                    <Settings size={16} className="text-black/50" />
                    System Settings
                </span>
                <ChevronRight size={16} className="text-black/35" />
            </button>
        </div>
    );
};

function ControlTile({
    icon: Icon,
    title,
    subtitle,
    active,
}: {
    icon: ElementType;
    title: string;
    subtitle: string;
    active?: boolean;
}) {
    return (
        <button
            type="button"
            className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-white/45 bg-white/55 p-3 text-left shadow-sm transition hover:bg-white/75"
        >
            <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-[#007AFF] text-white" : "bg-black/[0.08] text-black/45"}`}
            >
                <Icon size={17} />
            </span>
            <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold">{title}</span>
                <span className="block truncate text-[11px] font-semibold text-black/40">{subtitle}</span>
            </span>
        </button>
    );
}

function SliderFill({ width }: { width: string }) {
    return (
        <div className="h-2 rounded-full bg-black/[0.08]">
            <div className="h-full rounded-full bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]" style={{ width }} />
        </div>
    );
}
