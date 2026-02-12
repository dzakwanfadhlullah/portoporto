"use client";

import { motion } from "framer-motion";

export function ActivityRingsDemo() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-muted/5">
            <div className="relative w-32 h-32">
                <Ring radius={50} color="stroke-rose-500" progress={0.8} delay={0.1} />
                <Ring radius={38} color="stroke-emerald-500" progress={0.6} delay={0.3} />
                <Ring radius={26} color="stroke-blue-500" progress={0.9} delay={0.5} />
            </div>
        </div>
    );
}

function Ring({ radius, color, progress, delay }: { radius: number; color: string; progress: number; delay: number }) {
    const circumference = 2 * Math.PI * radius;

    return (
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background Circle */}
            <circle
                cx="60"
                cy="60"
                r={radius}
                className="fill-none stroke-current opacity-10"
                strokeWidth="10"
            />
            {/* Progress Circle */}
            <motion.circle
                cx="60"
                cy="60"
                r={radius}
                className={`fill-none ${color} stroke-round`}
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - progress) }}
                transition={{ duration: 1.5, delay, ease: "easeOut" }}
                strokeLinecap="round"
            />
        </svg>
    );
}
