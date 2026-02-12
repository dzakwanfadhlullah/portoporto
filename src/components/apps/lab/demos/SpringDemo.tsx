"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function SpringDemo() {
    const [count, setCount] = useState(0);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-muted/5">
            <motion.div
                key={count}
                initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                className="w-24 h-24 rounded-3xl bg-primary shadow-xl shadow-primary/20 flex items-center justify-center text-primary-foreground font-black text-2xl"
            >
                {count}
            </motion.div>

            <button
                onClick={() => setCount(c => c + 1)}
                className="px-6 py-2 bg-foreground text-background rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-transform"
            >
                Trigger Spring
            </button>

            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Stiffness: 260 | Damping: 20</p>
        </div>
    );
}
