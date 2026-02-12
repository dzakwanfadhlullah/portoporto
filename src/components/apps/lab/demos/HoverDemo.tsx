"use client";

import { motion } from "framer-motion";

export function HoverDemo() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-muted/5 gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    whileHover={{
                        height: 120,
                        backgroundColor: "var(--primary)",
                        opacity: 1
                    }}
                    className="w-8 h-10 bg-muted-foreground/20 rounded-full transition-colors duration-300"
                />
            ))}
        </div>
    );
}
