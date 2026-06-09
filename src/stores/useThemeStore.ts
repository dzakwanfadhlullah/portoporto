import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppearanceMode = "system" | "light" | "dark";

interface ThemeState {
    appearance: AppearanceMode;
    accentColor: string;
    reduceMotion: boolean;
    setAppearance: (appearance: AppearanceMode) => void;
    setAccentColor: (accentColor: string) => void;
    setReduceMotion: (reduceMotion: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            appearance: "system",
            accentColor: "#007AFF",
            reduceMotion: false,
            setAppearance: (appearance) => set({ appearance }),
            setAccentColor: (accentColor) => set({ accentColor }),
            setReduceMotion: (reduceMotion) => set({ reduceMotion }),
        }),
        {
            name: "dzakos-theme-v1",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
