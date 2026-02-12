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
            <div className="flex items-center gap-1.5 bg-muted/30 p-1 rounded-lg border border-border/20">
                <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 rounded transition-all duration-200 ${viewMode === "list"
                            ? "bg-muted-foreground/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/5"
                        }`}
                    title="List View"
                >
                    <List size={14} />
                </button>
                <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1 rounded transition-all duration-200 ${viewMode === "grid"
                            ? "bg-muted-foreground/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/5"
                        }`}
                    title="Grid View"
                >
                    <LayoutGrid size={14} />
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
