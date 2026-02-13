"use client";

import { useState, useEffect } from "react";
import { List, LayoutGrid } from "lucide-react";
import { useWindowActions } from "../../os/WindowContext";
import { projects } from "./data";
import { ProjectTableView } from "./ProjectTableView";
import { ProjectGridView } from "./ProjectGridView";

export default function ProjectsApp() {
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const { setHeaderActions } = useWindowActions();

    // Register header actions on mount
    useEffect(() => {
        setHeaderActions(
            <div className="flex items-center gap-1 bg-muted/20 p-0.5 rounded-md border border-border/10">
                <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 rounded-[4px] transition-all duration-200 ${viewMode === "list"
                        ? "bg-white shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/40"
                        }`}
                    title="List View"
                >
                    <List size={13} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1 rounded-[4px] transition-all duration-200 ${viewMode === "grid"
                        ? "bg-white shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/40"
                        }`}
                    title="Grid View"
                >
                    <LayoutGrid size={13} strokeWidth={2.5} />
                </button>
            </div>
        );

        // Cleanup actions on unmount
        return () => setHeaderActions(null);
    }, [viewMode, setHeaderActions]);

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm">
            <div className="flex-1 overflow-auto">
                {viewMode === "list" ? (
                    <ProjectTableView projects={projects} />
                ) : (
                    <ProjectGridView projects={projects} />
                )}
            </div>
        </div>
    );
}
