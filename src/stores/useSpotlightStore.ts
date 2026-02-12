import { create } from "zustand";
import Fuse from "fuse.js";

import type { AppId, AppMetadata } from "@/types/app";

// ─── Types ───────────────────────────────────────────────────────────────────

export type SearchResultType = "app" | "project" | "command";

export interface SearchResult {
    id: string;
    type: SearchResultType;
    title: string;
    description?: string;
    icon?: string;
    /** For app results — the appId to open */
    appId?: AppId;
    /** For command results — callback to execute */
    action?: () => void;
}

// ─── Built-in searchable items ───────────────────────────────────────────────

const builtInItems: SearchResult[] = [
    {
        id: "app-projects",
        type: "app",
        title: "Projects",
        description: "Browse my project portfolio",
        appId: "projects",
    },
    {
        id: "app-about",
        type: "app",
        title: "About Me",
        description: "Learn more about me",
        appId: "about",
    },
    {
        id: "app-lab",
        type: "app",
        title: "Lab",
        description: "Experimental projects and playground",
        appId: "lab",
    },
    {
        id: "app-leadership",
        type: "app",
        title: "Leadership",
        description: "Leadership and organizational experience",
        appId: "leadership",
    },
    {
        id: "app-contact",
        type: "app",
        title: "Contact",
        description: "Get in touch with me",
        appId: "contact",
    },
    {
        id: "cmd-toggle-theme",
        type: "command",
        title: "Toggle Dark Mode",
        description: "Switch between light and dark mode",
    },
];

// ─── Fuse.js instance ────────────────────────────────────────────────────────

const fuse = new Fuse(builtInItems, {
    keys: ["title", "description"],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 1,
});

// ─── Store ───────────────────────────────────────────────────────────────────

interface SpotlightState {
    isOpen: boolean;
    query: string;
    results: SearchResult[];
    selectedIndex: number;

    // Actions
    open: () => void;
    close: () => void;
    toggle: () => void;
    setQuery: (query: string) => void;
    selectNext: () => void;
    selectPrevious: () => void;
    getSelectedResult: () => SearchResult | undefined;
    resetSelection: () => void;
}

export const useSpotlightStore = create<SpotlightState>()((set, get) => ({
    isOpen: false,
    query: "",
    results: [],
    selectedIndex: 0,

    open: () => {
        set({ isOpen: true, query: "", results: [], selectedIndex: 0 });
    },

    close: () => {
        set({ isOpen: false, query: "", results: [], selectedIndex: 0 });
    },

    toggle: () => {
        const state = get();
        if (state.isOpen) {
            get().close();
        } else {
            get().open();
        }
    },

    setQuery: (query: string) => {
        if (query.trim() === "") {
            set({ query, results: [], selectedIndex: 0 });
            return;
        }

        const fuseResults = fuse.search(query);
        const results = fuseResults.map((r) => r.item);

        set({ query, results, selectedIndex: 0 });
    },

    selectNext: () => {
        const state = get();
        if (state.results.length === 0) return;
        set({
            selectedIndex: (state.selectedIndex + 1) % state.results.length,
        });
    },

    selectPrevious: () => {
        const state = get();
        if (state.results.length === 0) return;
        set({
            selectedIndex:
                state.selectedIndex <= 0
                    ? state.results.length - 1
                    : state.selectedIndex - 1,
        });
    },

    getSelectedResult: () => {
        const state = get();
        return state.results[state.selectedIndex];
    },

    resetSelection: () => {
        set({ selectedIndex: 0 });
    },
}));
