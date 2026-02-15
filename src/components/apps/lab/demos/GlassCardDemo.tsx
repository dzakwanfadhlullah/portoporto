"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MousePointer2 } from "lucide-react";

export function GlassCardDemo() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-150, 150], [15, -15]);
    const rotateY = useTransform(mouseX, [-150, 150], [-15, 15]);

    function onMouseMove(event: React.MouseEvent) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <div
            className="w-full h-full flex items-center justify-center p-8 cursor-none"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <motion.div
                style={{ rotateX, rotateY, perspective: 1000 }}
                className="relative w-full aspect-video rounded-2xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm"
            >
                {/* ── Lighting Effect ── */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: useTransform(
                            [mouseX, mouseY],
                            (latest) => {
                                const [latestX, latestY] = latest as [number, number];
                                return `radial-gradient(circle at ${latestX + 150}px ${latestY + 100}px, rgba(255,255,255,0.15), transparent 80%)`;
                            }
                        )
                    }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                    <MousePointer2 size={32} />
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Interact</span>
                </div>
            </motion.div>

            {/* ── Cursor ── */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-primary mix-blend-difference pointer-events-none z-50"
                style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
            />
        </div>
    );
}
