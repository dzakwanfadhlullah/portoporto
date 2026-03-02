"use client";

import type { FC } from "react";

// ─── macOS-style WiFi Icon (static, full signal) ────────────────────────────

export const MacWifiIcon: FC<{ size?: number; className?: string }> = ({
    size = 16,
    className = "",
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        {/* Outer arc */}
        <path
            d="M2.05 8.82a14.94 14.94 0 0 1 19.9 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        {/* Middle arc */}
        <path
            d="M6.2 12.47a9.47 9.47 0 0 1 11.6 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        {/* Inner arc */}
        <path
            d="M9.78 15.75a4.8 4.8 0 0 1 4.44 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        {/* Dot */}
        <circle cx="12" cy="19.5" r="1.5" fill="currentColor" />
    </svg>
);

// ─── macOS-style Battery Icon (dynamic fill) ────────────────────────────────

interface MacBatteryIconProps {
    size?: number;
    level: number | null; // 0-100 or null
    charging: boolean;
    className?: string;
}

export const MacBatteryIcon: FC<MacBatteryIconProps> = ({
    size = 16,
    level,
    charging,
    className = "",
}) => {
    const displayLevel = level ?? 100;
    // Fill width: the inner area is roughly 17 units wide (from x=2 to x=19)
    const fillWidth = Math.max(1, (displayLevel / 100) * 17);

    // Color based on level
    let fillColor = "currentColor";
    if (displayLevel <= 10) fillColor = "#FF3B30"; // Red
    else if (displayLevel <= 20) fillColor = "#FF9500"; // Orange/yellow

    return (
        <svg
            width={size * 1.6}
            height={size}
            viewBox="0 0 28 16"
            fill="none"
            className={className}
        >
            {/* Battery body (rounded rect) */}
            <rect
                x="1"
                y="2"
                width="22"
                height="12"
                rx="2.5"
                ry="2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
            />
            {/* Battery nub (right cap) */}
            <path
                d="M24 6.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
            />
            {/* Fill level */}
            <rect
                x="2.5"
                y="3.5"
                width={fillWidth}
                height="9"
                rx="1.5"
                fill={fillColor}
                opacity={0.85}
            />
            {/* Charging bolt */}
            {charging && (
                <path
                    d="M13 3.5L10 8.5h4l-3 5"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            )}
        </svg>
    );
};

// ─── macOS-style Search/Spotlight Icon ──────────────────────────────────────

export const MacSearchIcon: FC<{ size?: number; className?: string }> = ({
    size = 16,
    className = "",
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <circle
            cx="10.5"
            cy="10.5"
            r="6.5"
            stroke="currentColor"
            strokeWidth="2"
        />
        <line
            x1="15.5"
            y1="15.5"
            x2="21"
            y2="21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
