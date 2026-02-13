"use client";

import { createElement, type FC } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AppleIconProps {
    /** The Lucide icon to use for the "symbol" style */
    icon?: LucideIcon;
    /** The Emoji or Glyph character for the "3d" style */
    char?: string;
    /** The image URL for the "photo" style */
    image?: string;
    /** The visual variant */
    style?: "3d" | "symbol" | "photo";
    /** Base background color for 3D style */
    color?: string;
    /** Custom size */
    size?: number;
    /** For 3D style: is it active/open? (adds a small indicator glow) */
    isActive?: boolean;
}

/**
 * A premium icon component that provides Apple-style visuals.
 * Style "3d": Rich gradients, inner shadows, and squircle shape for Dock/Desktop.
 * Style "symbol": Minimalist, thin-stroke symbols for MenuBar/System.
 */
export const AppleIcon: FC<AppleIconProps> = ({
    icon,
    char,
    image,
    style = "3d",
    color = "#8E8E93", // Default gray
    size = 20,
    isActive = false,
}) => {
    if (style === "symbol" && icon) {
        return (
            <div className="flex items-center justify-center translate-y-[0.5px]">
                {createElement(icon, {
                    size,
                    strokeWidth: 2.2, // Sharper "SF Symbol" weight
                    className: "text-current opacity-90",
                })}
            </div>
        );
    }

    if (style === "photo") {
        return (
            <motion.div
                className="relative flex items-center justify-center p-[6px] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.1)] rounded-[4px] border border-black/5"
                style={{
                    width: "100%",
                    height: "100%",
                }}
                whileHover={{ y: -2, scale: 1.04, rotate: -0.5 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Outer Frame (Polaroid-ish) */}
                <div className="w-full h-full bg-slate-100 overflow-hidden rounded-[2px] border border-black/10 relative">
                    {image ? (
                        <img
                            src={image}
                            alt="Project Thumbnail"
                            className="w-full h-full object-cover grayscale-[0.1] contrast-[1.05]"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            {icon && createElement(icon, { size: size * 1.5, className: "text-slate-400" })}
                        </div>
                    )}
                    {/* Subtle Inner Gloss */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Subtle Grain/Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay grain" />
            </motion.div>
        );
    }

    // 3D / Big Sur Style
    return (
        <motion.div
            className={`relative flex items-center justify-center ${color === "transparent" ? "" : "overflow-hidden"}`}
            style={{
                width: "100%",
                height: "100%",
                borderRadius: color === "transparent" ? "0%" : "22.5%",
                backgroundColor: color === "transparent" ? "transparent" : color,
                backgroundImage:
                    image && color !== "transparent"
                        ? `url(${image})`
                        : color === "transparent"
                            ? "none"
                            : `linear-gradient(180deg, ${color} 0%, ${getDarkerColor(color)} 100%)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow:
                    color === "transparent"
                        ? "none"
                        : `
          0 1px 1px rgba(255,255,255,0.5) inset,
          0 10px 20px rgba(0,0,0,0.15),
          0 4px 6px rgba(0,0,0,0.1),
          0 -1px 2px rgba(0,0,0,0.2) inset
        `,
            }}
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* 3D Depth Layer */}
            {color !== "transparent" && (
                <div
                    className="absolute inset-0 rounded-[inherit] opacity-10"
                    style={{
                        background: "radial-gradient(circle at 50% 0%, white 0%, transparent 70%)"
                    }}
                />
            )}

            {/* Gloss Overlay */}
            {color !== "transparent" && (
                <div
                    className="absolute inset-0 rounded-[inherit] opacity-30 pointer-events-none"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 45%, rgba(0,0,0,0.1) 100%)"
                    }}
                />
            )}

            {/* Glyph / Emoji / Icon / Image Content */}
            <div className="relative z-10 select-none flex items-center justify-center w-full h-full text-white">
                {image && color === "transparent" ? (
                    <img
                        src={image}
                        alt="Icon"
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] scale-[1.45] translate-y-[4px]"
                    />
                ) : image ? (
                    // If image is used as background in 3D style, we don't necessarily need a child 
                    null
                ) : icon ? (
                    createElement(icon, {
                        size: size * 1.5,
                        strokeWidth: 2,
                        color: "white",
                        className: "drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                    })
                ) : (
                    <span
                        style={{ fontSize: size * 1.6 }}
                        className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] filter saturate-[1.1]"
                    >
                        {char}
                    </span>
                )}
            </div>

            {/* Active Glow */}
            {isActive && (
                <div
                    className="absolute inset-x-2 bottom-1 h-1 bg-white/40 blur-[2px] rounded-full"
                />
            )}
        </motion.div>
    );
};

/**
 * Sophisticated darkening via HSL for consistent gradient depth.
 */
function getDarkerColor(hex: string): string {
    // Very basic hex to slight dark shift without complex libs
    if (hex === "#007AFF") return "#0051A8"; // Blue
    if (hex === "#FF3B30") return "#C41E14"; // Red
    if (hex === "#FFCC00") return "#CCA300"; // Yellow
    if (hex === "#FF9500") return "#CC7A00"; // Orange
    if (hex === "#34C759") return "#248A3D"; // Green
    if (hex === "#AF52DE") return "#8929AD"; // Purple
    return hex;
}
