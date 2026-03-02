"use client";

import { useEffect, useState } from "react";

interface BatteryState {
    level: number | null;
    charging: boolean;
}

export function useBattery(): BatteryState {
    const [battery, setBattery] = useState<BatteryState>({
        level: null,
        charging: false,
    });

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let batteryRef: any = null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const update = (b: any) => {
            setBattery({
                level: Math.round(b.level * 100),
                charging: b.charging,
            });
        };

        if ("getBattery" in navigator) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigator as any).getBattery().then((b: any) => {
                batteryRef = b;
                update(b);

                const onLevel = () => update(b);
                const onCharging = () => update(b);

                b.addEventListener("levelchange", onLevel);
                b.addEventListener("chargingchange", onCharging);

                // Store handlers for cleanup
                batteryRef._onLevel = onLevel;
                batteryRef._onCharging = onCharging;
            });
        }

        return () => {
            if (batteryRef) {
                batteryRef.removeEventListener("levelchange", batteryRef._onLevel);
                batteryRef.removeEventListener("chargingchange", batteryRef._onCharging);
            }
        };
    }, []);

    return battery;
}
