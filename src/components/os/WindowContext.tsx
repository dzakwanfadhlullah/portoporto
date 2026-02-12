"use client";

import { createContext, useContext, ReactNode } from "react";

interface WindowContextType {
    setHeaderActions: (actions: ReactNode) => void;
    metadata?: any;
}

export const WindowContext = createContext<WindowContextType | null>(null);

export const useWindowActions = () => {
    const context = useContext(WindowContext);
    if (!context) {
        throw new Error("useWindowActions must be used within a Window component");
    }
    return context;
};
