"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface LyricLine {
    time: number;
    text: string;
}

interface LyricsViewProps {
    lyrics: LyricLine[];
    currentTime: number;
    onSeek?: (time: number) => void;
}

export default function LyricsView({ lyrics, currentTime, onSeek }: LyricsViewProps) {
    const activeIndex = lyrics.reduce((acc, line, index) => {
        if (currentTime >= line.time) return index;
        return acc;
    }, -1);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeIndex !== -1 && containerRef.current) {
            const activeElement = containerRef.current.children[activeIndex] as HTMLElement;
            if (activeElement) {
                const containerHeight = containerRef.current.offsetHeight;
                const elementTop = activeElement.offsetTop;
                const elementHeight = activeElement.offsetHeight;

                containerRef.current.scrollTo({
                    top: elementTop - containerHeight / 2 + elementHeight / 2,
                    behavior: "smooth",
                });
            }
        }
    }, [activeIndex]);

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto custom-scrollbar px-8 py-20 flex flex-col gap-8 scroll-smooth"
            style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
        >
            {lyrics.map((line, index) => {
                const isActive = index === activeIndex;
                const isPast = index < activeIndex;

                return (
                    <motion.div
                        key={index}
                        initial={false}
                        animate={{
                            opacity: isActive ? 1 : isPast ? 0.3 : 0.2,
                            scale: isActive ? 1.05 : 1,
                            filter: isActive ? "blur(0px)" : "blur(1px)",
                        }}
                        transition={{ duration: 0.4 }}
                        onClick={() => onSeek?.(line.time)}
                        className={`text-2xl font-bold tracking-tight leading-snug cursor-pointer hover:opacity-100 transition-opacity ${isActive ? "text-black" : "text-black/40"
                            }`}
                    >
                        {line.text}
                    </motion.div>
                );
            })}
            <div className="h-40" /> {/* Spacer at the bottom */}
        </div>
    );
}
