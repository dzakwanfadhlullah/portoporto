"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, RotateCcw, AlertTriangle, Volume2, VolumeX } from "lucide-react";

// --- Constants ---
const BLOCK_HEIGHT = 24;
const INITIAL_WIDTH = 200;
const SPEED_BASE = 4.0;
const GAME_WIDTH = 800; // logical container width for rendering
const GAME_HEIGHT = 600;

class SoundEngine {
    private ctx: AudioContext | null = null;
    enabled = true;
    private pitchStep = 0;

    private getCtx(): AudioContext {
        if (!this.ctx) this.ctx = new AudioContext();
        return this.ctx;
    }

    playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.1) {
        if (!this.enabled) return;
        try {
            const ctx = this.getCtx();
            if (ctx.state === "suspended") ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch { /* ignore audio errors */ }
    }

    resetPitch() { this.pitchStep = 0; }

    place(perfect: boolean) {
        if (perfect) {
            // Perfect hit bonus sound
            [600, 800, 1000].forEach((f, i) => setTimeout(() => this.playTone(f, 0.1, "sine", 0.08), i * 80));
            this.pitchStep++;
        } else {
            // Normal hit sound, escalating pitch
            const baseFreq = 220 + (this.pitchStep * 15);
            this.playTone(baseFreq, 0.1, "square", 0.05);
            setTimeout(() => this.playTone(baseFreq * 1.5, 0.1, "sine", 0.05), 30);
            this.pitchStep++;
        }
    }

    miss() {
        this.resetPitch();
        [150, 100].forEach((f, i) => setTimeout(() => this.playTone(f, 0.25, "sawtooth", 0.1), i * 150));
    }
}

const sfx = new SoundEngine();

// Pastel gradient colors for layers
const COLORS = [
    "bg-[#FFB5E8] shadow-[#FFB5E8]/30",
    "bg-[#FFC9DE] shadow-[#FFC9DE]/30",
    "bg-[#FFCCF9] shadow-[#FFCCF9]/30",
    "bg-[#FCC2FF] shadow-[#FCC2FF]/30",
    "bg-[#F6A6FF] shadow-[#F6A6FF]/30",
    "bg-[#B28DFF] shadow-[#B28DFF]/30",
    "bg-[#C5A3FF] shadow-[#C5A3FF]/30",
    "bg-[#D5AAFF] shadow-[#D5AAFF]/30",
    "bg-[#ECA1FF] shadow-[#ECA1FF]/30",
    "bg-[#F2A2E8] shadow-[#F2A2E8]/30",
    "bg-[#FFC9DE] shadow-[#FFC9DE]/30",
    "bg-[#FFBEBC] shadow-[#FFBEBC]/30",
    "bg-[#FFCBC1] shadow-[#FFCBC1]/30",
    "bg-[#FFF5BA] shadow-[#FFF5BA]/30",
];

interface StackBlock {
    id: number;
    x: number;
    width: number;
    zIndex: number;
    color: string;
}

interface DebrisBlock {
    id: number;
    x: number;
    y: number; // logical y from top
    width: number;
    direction: number; // 1 or -1
    color: string;
}

export function TheStackDemo() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const [blocks, setBlocks] = useState<StackBlock[]>([]);
    const [debris, setDebris] = useState<DebrisBlock[]>([]);
    const [soundOn, setSoundOn] = useState(true);

    useEffect(() => { sfx.enabled = soundOn; }, [soundOn]);

    // Game logic refs
    const activeBlockRef = useRef({ x: GAME_WIDTH / 2 - INITIAL_WIDTH / 2, width: INITIAL_WIDTH, direction: 1 });
    const stackRef = useRef<StackBlock[]>([]);
    const lastTime = useRef<number>(0);
    const requestRef = useRef<number>(0);

    // Responsive container bounds
    const [bounds, setBounds] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT });
    const boundsRef = useRef({ width: GAME_WIDTH, height: GAME_HEIGHT });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            setBounds({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
        }
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                const w = entry.contentRect.width;
                const h = entry.contentRect.height;
                setBounds({ width: w, height: h });
                boundsRef.current = { width: w, height: h };
            }
        });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const startGame = () => {
        setIsPlaying(true);
        setIsGameOver(false);
        setScore(0);
        sfx.resetPitch();

        const initialBlock = {
            id: 0,
            x: boundsRef.current.width / 2 - INITIAL_WIDTH / 2,
            width: INITIAL_WIDTH,
            zIndex: 10,
            color: COLORS[0]!
        };

        stackRef.current = [initialBlock];
        setBlocks([initialBlock]);
        setDebris([]);

        activeBlockRef.current = {
            x: 0,
            width: INITIAL_WIDTH,
            direction: 1
        };

        lastTime.current = performance.now();
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const gameOver = () => {
        setIsPlaying(false);
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const placeBlock = useCallback(() => {
        if (!isPlaying && !isGameOver) {
            startGame();
            return;
        }
        if (isGameOver) return;

        const stack = stackRef.current;
        const topBlock = stack[stack.length - 1];
        if (!topBlock) return;

        const active = activeBlockRef.current;
        const delta = active.x - topBlock.x;
        const overlap = active.width - Math.abs(delta);

        if (overlap <= 0) {
            // Missed completely
            const newDebris: DebrisBlock = {
                id: Math.random(),
                x: active.x,
                y: boundsRef.current.height - 100 - (stack.length * BLOCK_HEIGHT),
                width: active.width,
                direction: active.direction,
                color: COLORS[stack.length % COLORS.length]!
            };
            setDebris(prev => [...prev, newDebris]);
            sfx.miss();
            gameOver();
            return;
        }

        // Hit! Calculate slice
        const newWidth = overlap;
        const newX = Math.max(active.x, topBlock.x);

        const placedBlock: StackBlock = {
            id: stack.length,
            x: newX,
            width: newWidth,
            zIndex: 10 + stack.length,
            color: COLORS[stack.length % COLORS.length]!
        };

        stackRef.current = [...stack, placedBlock];
        setBlocks([...stackRef.current]);
        setScore(stack.length);

        // Add debris for the chopped part
        if (Math.abs(delta) > 0.5) { // tiny threshold to avoid micro slices
            const isRightOverhang = delta > 0;
            const debrisWidth = Math.abs(delta);
            const debrisX = isRightOverhang ? topBlock.x + topBlock.width : active.x;

            const newDebris: DebrisBlock = {
                id: Math.random(),
                x: debrisX,
                y: boundsRef.current.height - 100 - (stack.length * BLOCK_HEIGHT),
                width: debrisWidth,
                direction: isRightOverhang ? 1 : -1,
                color: COLORS[stack.length % COLORS.length]!
            };
            setDebris(prev => [...prev, newDebris]);
        }

        // Prepare next block
        activeBlockRef.current = {
            x: active.direction === 1 ? -newWidth : boundsRef.current.width, // start offscreen opposite
            width: newWidth,
            direction: active.direction === 1 ? -1 : 1
        };

        // Minor alignment lock (perfect hit bonus)
        if (Math.abs(delta) < 4) {
            placedBlock.width = topBlock.width;
            placedBlock.x = topBlock.x;
            activeBlockRef.current.width = topBlock.width;
            stackRef.current[stackRef.current.length - 1] = placedBlock;
            setBlocks([...stackRef.current]);
            sfx.place(true);
        } else {
            sfx.place(false);
        }

    }, [isPlaying, isGameOver, score, bounds]); // score deps slightly tricky but we use ref for stack

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                placeBlock();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [placeBlock]);

    // DOM update ref
    const movingBlockElem = useRef<HTMLDivElement>(null);
    const cameraElem = useRef<HTMLDivElement>(null);

    const gameLoop = (time: number) => {
        if (!lastTime.current) lastTime.current = time;
        let deltaTime = time - lastTime.current;
        if (deltaTime > 100) deltaTime = 16;
        lastTime.current = time;
        const timeScale = deltaTime / 16.66;

        const active = activeBlockRef.current;
        const speed = SPEED_BASE + (stackRef.current.length * 0.15);

        // Move block
        active.x += speed * active.direction * timeScale;

        // Bounce off walls
        const EDGE_MARGIN = 50;
        if (active.x > boundsRef.current.width - active.width + EDGE_MARGIN && active.direction === 1) {
            active.x = boundsRef.current.width - active.width + EDGE_MARGIN;
            active.direction = -1;
        } else if (active.x < -EDGE_MARGIN && active.direction === -1) {
            active.x = -EDGE_MARGIN;
            active.direction = 1;
        }

        if (movingBlockElem.current) {
            movingBlockElem.current.style.transform = `translateX(${active.x}px)`;
            movingBlockElem.current.style.width = `${active.width}px`;
        }

        // Camera follow
        if (cameraElem.current && stackRef.current.length > 5) {
            // move camera down as stack grows
            const targetY = (stackRef.current.length - 5) * BLOCK_HEIGHT;
            // Simple ease
            const currentY = parseFloat(cameraElem.current.getAttribute('data-y') || '0');
            const newY = currentY + (targetY - currentY) * 0.1;
            cameraElem.current.style.transform = `translateY(${newY}px)`;
            cameraElem.current.setAttribute('data-y', newY.toString());
        }

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Draw initial idle block
    useEffect(() => {
        if (!isPlaying && !isGameOver && bounds.width > 0) {
            if (movingBlockElem.current) {
                movingBlockElem.current.style.transform = `translateX(${bounds.width / 2 - INITIAL_WIDTH / 2}px)`;
                movingBlockElem.current.style.width = `${INITIAL_WIDTH}px`;
            }
        }
    }, [isPlaying, isGameOver, bounds]);

    return (
        <div
            className="w-full h-full flex flex-col select-none overflow-hidden relative rounded-3xl bg-[#09090B] group perspective-1000"
            onPointerDown={placeBlock}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#3A3A40_0%,_transparent_50%)] opacity-30 group-hover:opacity-50 transition-opacity duration-700" />

            {/* Top Score Bar */}
            <div className="flex justify-between items-center px-8 py-6 z-30 w-full absolute top-0 pointer-events-none">
                <div className="flex flex-col items-start bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Best</span>
                    <span className="text-xl font-black text-white/90 leading-none mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>{highScore}</span>
                </div>
                {/* Volume Button Here */}
                <button
                    onClick={(e) => { e.stopPropagation(); setSoundOn(!soundOn); }}
                    className="absolute top-6 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 pointer-events-auto transition-colors"
                >
                    {soundOn ? <Volume2 size={16} className="text-white/70" /> : <VolumeX size={16} className="text-white/40" />}
                </button>
                <div className="flex flex-col items-end bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Score</span>
                    <span className="text-2xl font-black text-[#ECA1FF] leading-none mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>{score}</span>
                </div>
            </div>

            {/* Game Container */}
            <div
                ref={containerRef}
                className="flex-1 relative w-full h-full overflow-hidden z-10 flex items-end justify-center pb-[100px]"
            >
                {/* Camera wrapper */}
                <div
                    ref={cameraElem}
                    className="relative w-full h-full"
                    data-y="0"
                >
                    {/* The Stack */}
                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            className={`absolute shadow-lg backdrop-blur-md border border-white/20 dark:border-white/10 ${block.color}`}
                            style={{
                                bottom: `${block.id * BLOCK_HEIGHT}px`,
                                left: `${block.x}px`,
                                width: `${block.width}px`,
                                height: `${BLOCK_HEIGHT}px`,
                                zIndex: block.zIndex,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* Glassmorphism inner highlight */}
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/50" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                        </div>
                    ))}

                    {/* Active Moving Block */}
                    {isPlaying && !isGameOver && (
                        <div
                            ref={movingBlockElem}
                            className={`absolute shadow-lg backdrop-blur-md border border-white/20 dark:border-white/10 ${COLORS[blocks.length % COLORS.length]}`}
                            style={{
                                bottom: `${blocks.length * BLOCK_HEIGHT}px`,
                                height: `${BLOCK_HEIGHT}px`,
                                zIndex: 10 + blocks.length,
                                willChange: 'transform',
                            }}
                        >
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/50" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                        </div>
                    )}

                    {/* Debris Slices */}
                    <AnimatePresence>
                        {debris.map(d => (
                            <motion.div
                                key={d.id}
                                initial={{ y: 0, opacity: 1, rotate: 0 }}
                                animate={{ y: 500, opacity: 0, rotate: d.direction * 45 }}
                                transition={{ duration: 1.5, ease: "easeIn" }}
                                onAnimationComplete={() => setDebris(prev => prev.filter(db => db.id !== d.id))}
                                className={`absolute shadow-lg backdrop-blur-md border border-white/20 ${d.color}`}
                                style={{
                                    bottom: `${bounds.height - d.y}px`,
                                    left: `${d.x}px`,
                                    width: `${d.width}px`,
                                    height: `${BLOCK_HEIGHT}px`,
                                    zIndex: 5,
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Idle Help Text */}
                <AnimatePresence>
                    {!isPlaying && !isGameOver && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute z-40 pointer-events-none mb-32"
                        >
                            <div className="bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                                <span className="text-sm font-bold text-white/80 tracking-widest uppercase animate-pulse">
                                    PRESS SPACE TO DROP
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Game Over Modal */}
            <AnimatePresence>
                {isGameOver && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/40"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#1E1E1E]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center gap-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)] mx-4 w-[280px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#ECA1FF]/10 flex items-center justify-center text-[#ECA1FF] mb-1">
                                <Layers size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Stack Fell</h2>
                            <div className="flex flex-col items-center mt-2 bg-white/5 rounded-xl px-8 py-3 w-full border border-white/5">
                                <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Blocks</span>
                                <span className="text-3xl font-black text-white">{score}</span>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); startGame(); }}
                                className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-bold text-[15px] hover:bg-white/90 transition-colors active:scale-95 shadow-lg shadow-white/10"
                            >
                                <RotateCcw size={16} strokeWidth={2.5} />
                                Rebuild
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
