"use client";

import { useWindowStore } from "@/stores/useWindowStore";
import { useAppRegistry } from "@/stores/useAppRegistry";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import type { WindowId } from "@/types/window";
import type { AppId } from "@/types/app";

interface MobileAppViewProps {
    windowId: WindowId;
}

export const MobileAppView = ({ windowId }: MobileAppViewProps) => {
    const win = useWindowStore((s) => s.windows[windowId]);
    const closeWindow = useWindowStore((s) => s.closeWindow);
    const getApp = useAppRegistry((s) => s.getApp);

    if (!win) return null;

    const app = getApp(win.appId as AppId);
    if (!app) return null;

    const AppComponent = app.component;

    return (
        <div className="absolute inset-0 z-40 flex flex-col bg-background animate-in slide-in-from-right-full duration-300">
            {/* Mobile Navigation Bar */}
            <div className="h-12 w-full flex items-center shrink-0 border-b border-white/10 px-2 bg-black/50 backdrop-blur-md">
                <button
                    onClick={() => closeWindow(windowId)}
                    className="flex items-center gap-1 px-2 py-1.5 text-[#0A84FF] active:opacity-60 transition-opacity"
                >
                    <ChevronLeft size={24} strokeWidth={2.5} className="-ml-1" />
                    <span className="text-[17px] font-medium leading-none tracking-tight">
                        Back
                    </span>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-[15px]">
                    {win.title}
                </div>
            </div>

            {/* App Content Area */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-background">
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Loading...
                        </div>
                    }
                >
                    <AppComponent />
                </Suspense>
            </div>
        </div>
    );
};
