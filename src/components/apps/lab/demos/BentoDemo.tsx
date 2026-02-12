"use client";

import { motion } from "framer-motion";

export function BentoDemo() {
    return (
        <div className="w-full h-full p-4 grid grid-cols-3 grid-rows-3 gap-2 bg-muted/5">
            <BentoItem colSpan={2} color="bg-orange-500" />
            <BentoItem rowSpan={2} color="bg-blue-500" />
            <BentoItem color="bg-emerald-500" />
            <BentoItem color="bg-purple-500" />
            <BentoItem colSpan={2} color="bg-rose-500" />
        </div>
    );
}

function BentoItem({ colSpan = 1, rowSpan = 1, color }: { colSpan?: number, rowSpan?: number, color: string }) {
    return (
        <motion.div
            whileHover={{ scale: 0.98 }}
            className={`
                rounded-xl ${color} opacity-20 border border-white/10
                flex items-center justify-center
                group hover:opacity-100 transition-all duration-300
            `}
            style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`
            }}
        >
            <div className="w-1.5 h-1.5 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300" />
        </motion.div>
    );
}
