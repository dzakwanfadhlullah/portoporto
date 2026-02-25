"use client";

import { useState, useEffect } from "react";
import { Wifi, BatteryMedium, Signal } from "lucide-react";

export const MobileStatusBar = () => {
    const [time, setTime] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateClock = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
            );
        };
        updateClock();
        const interval = setInterval(updateClock, 10_000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-10 w-full flex items-center justify-between px-6 text-xs font-semibold shrink-0 z-50">
            {/* Left: Time */}
            <div className="flex-1">
                {mounted ? <span>{time}</span> : <span></span>}
            </div>

            {/* Right: Status Icons */}
            <div className="flex items-center gap-1.5 justify-end flex-1">
                <Signal size={12} strokeWidth={3} />
                <Wifi size={13} strokeWidth={2.5} />
                <BatteryMedium size={18} strokeWidth={2} />
            </div>
        </div>
    );
};
