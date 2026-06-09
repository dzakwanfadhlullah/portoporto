"use client";

import { useEffect } from "react";

import { useThemeStore } from "@/stores/useThemeStore";

export const ThemeBridge = () => {
    const appearance = useThemeStore((s) => s.appearance);
    const accentColor = useThemeStore((s) => s.accentColor);
    const reduceMotion = useThemeStore((s) => s.reduceMotion);

    useEffect(() => {
        document.documentElement.style.setProperty("--primary", accentColor);
        document.documentElement.style.setProperty("--ring", accentColor);
    }, [accentColor]);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const applyAppearance = () => {
            const shouldUseDark =
                appearance === "dark" ||
                (appearance === "system" && media.matches);

            document.documentElement.classList.toggle("dark", shouldUseDark);
        };

        applyAppearance();
        media.addEventListener("change", applyAppearance);
        return () => media.removeEventListener("change", applyAppearance);
    }, [appearance]);

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--dzakos-motion-scale",
            reduceMotion ? "0" : "1"
        );
    }, [reduceMotion]);

    return null;
};
