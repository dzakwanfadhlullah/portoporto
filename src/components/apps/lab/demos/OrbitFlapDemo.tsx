"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, RotateCcw, AlertTriangle, Volume2, VolumeX } from "lucide-react";

// --- Constants ---
const GRAVITY = 0.5;
const JUMP_VELOCITY = -8;
const PIPE_SPEED = 3.5;
const PIPE_SPAWN_RATE = 1600; // ms
const PIPE_WIDTH = 60;
const GAP_SIZE = 160;
const PLAYER_SIZE = 36;
const GAME_WIDTH = 800; // logical width for spawning
const GAME_HEIGHT = 600;

class SoundEngine {
    private ctx: AudioContext | null = null;
    enabled = true;

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

    jump() { this.playTone(400, 0.1, "sine", 0.05); setTimeout(() => this.playTone(600, 0.15, "sine", 0.05), 50); }
    score() { this.playTone(800, 0.05, "square", 0.05); }
    crash() { [150, 120, 90].forEach((f, i) => setTimeout(() => this.playTone(f, 0.2, "sawtooth", 0.15), i * 150)); }
}

const sfx = new SoundEngine();

interface PipeData {
    id: number;
    x: number;
    topHeight: number;
    passed: boolean;
}

export function OrbitFlapDemo() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [soundOn, setSoundOn] = useState(true);

    useEffect(() => { sfx.enabled = soundOn; }, [soundOn]);

    // Refs for game loop
    const playerY = useRef(GAME_HEIGHT / 2);
    const velocity = useRef(0);
    const pipes = useRef<PipeData[]>([]);
    const lastTime = useRef<number>(0);
    const lastSpawn = useRef<number>(0);
    const scoreRef = useRef(0);
    const requestRef = useRef<number>(0);

    // Area dimensions
    const [bounds, setBounds] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT });
    const boundsRef = useRef({ width: GAME_WIDTH, height: GAME_HEIGHT });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            setBounds({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight
            });
        }
    }, []);

    // Resize observer
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                const w = entry.contentRect.width;
                const h = entry.contentRect.height;
                setBounds({ width: w, height: h });
                boundsRef.current = { width: w, height: h };
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const jump = useCallback(() => {
        if (!isPlaying && !isGameOver) {
            startGame();
            return;
        }
        if (isGameOver) return;

        velocity.current = JUMP_VELOCITY;
        sfx.jump();
    }, [isPlaying, isGameOver]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [jump]);

    const startGame = () => {
        setIsPlaying(true);
        setIsGameOver(false);
        setScore(0);
        scoreRef.current = 0;
        playerY.current = boundsRef.current.height / 2;
        velocity.current = 0;
        pipes.current = [];
        lastTime.current = performance.now();
        lastSpawn.current = performance.now();

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const gameOver = () => {
        setIsPlaying(false);
        setIsGameOver(true);
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
        }
        sfx.crash();
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const spawnPipe = (time: number) => {
        lastSpawn.current = time;
        const minHeight = 50;
        const maxHeight = boundsRef.current.height - GAP_SIZE - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

        pipes.current.push({
            id: Math.random(),
            x: boundsRef.current.width,
            topHeight: topHeight,
            passed: false
        });
    };

    const gameLoop = (time: number) => {
        if (!lastTime.current) lastTime.current = time;
        let deltaTime = time - lastTime.current;
        if (deltaTime > 100) deltaTime = 16;
        lastTime.current = time;
        const timeScale = deltaTime / 16.66;

        // Player physics
        velocity.current += GRAVITY * timeScale;
        playerY.current += velocity.current * timeScale;

        // Floor / Ceiling collision
        if (playerY.current > boundsRef.current.height - PLAYER_SIZE || playerY.current < 0) {
            gameOver();
            return;
        }

        // Pipe spawning
        if (time - lastSpawn.current > PIPE_SPAWN_RATE) {
            spawnPipe(time);
        }

        // Pipe movement and collision
        const PLAYER_X = 60; // fixed horizontal position

        for (let i = 0; i < pipes.current.length; i++) {
            const pipe = pipes.current[i];
            if (!pipe) continue;

            pipe.x -= PIPE_SPEED * timeScale;

            // Scoring
            if (!pipe.passed && pipe.x < PLAYER_X - PIPE_WIDTH) {
                pipe.passed = true;
                scoreRef.current += 1;
                setScore(scoreRef.current);
                sfx.score();
            }

            // AABB Collision Detect
            const pHitbox = { x: PLAYER_X + 4, y: playerY.current + 4, w: PLAYER_SIZE - 8, h: PLAYER_SIZE - 8 }; // shrunk hitbox slightly forgiving

            // Top pipe
            if (pHitbox.x < pipe.x + PIPE_WIDTH && pHitbox.x + pHitbox.w > pipe.x && pHitbox.y < pipe.topHeight) {
                gameOver();
                return;
            }

            // Bottom pipe
            const bottomPipeY = pipe.topHeight + GAP_SIZE;
            if (pHitbox.x < pipe.x + PIPE_WIDTH && pHitbox.x + pHitbox.w > pipe.x && pHitbox.y + pHitbox.h > bottomPipeY) {
                gameOver();
                return;
            }
        }

        // Cleanup pipes
        pipes.current = pipes.current.filter(p => p.x > -PIPE_WIDTH);

        updateDOM();
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    // DOM Elements refs
    const playerElem = useRef<HTMLDivElement>(null);
    const pipesContainer = useRef<HTMLDivElement>(null);

    const updateDOM = () => {
        if (playerElem.current) {
            playerElem.current.style.transform = `translateY(${playerY.current}px) rotate(${Math.min(90, Math.max(-30, velocity.current * 4))}deg)`;
        }

        if (pipesContainer.current) {
            pipesContainer.current.innerHTML = '';
            pipes.current.forEach(pipe => {
                // Top
                const topPipe = document.createElement('div');
                topPipe.style.position = 'absolute';
                topPipe.style.left = `${pipe.x}px`;
                topPipe.style.top = '0px';
                topPipe.style.width = `${PIPE_WIDTH}px`;
                topPipe.style.height = `${pipe.topHeight}px`;
                topPipe.className = "bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-b-2xl shadow-[0_8px_32px_rgba(255,255,255,0.1)]";

                // Bottom
                const bottomPipe = document.createElement('div');
                bottomPipe.style.position = 'absolute';
                bottomPipe.style.left = `${pipe.x}px`;
                bottomPipe.style.top = `${pipe.topHeight + GAP_SIZE}px`;
                bottomPipe.style.width = `${PIPE_WIDTH}px`;
                bottomPipe.style.bottom = '0px';
                bottomPipe.className = "bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-t-2xl shadow-[0_-8px_32px_rgba(255,255,255,0.1)]";

                pipesContainer.current?.appendChild(topPipe);
                pipesContainer.current?.appendChild(bottomPipe);
            });
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Draw initial
    useEffect(() => {
        if (!isPlaying && !isGameOver && bounds.height > 0) {
            playerY.current = bounds.height / 2;
            updateDOM();
        }
    }, [isPlaying, isGameOver, bounds]);

    return (
        <div
            className="w-full h-full flex flex-col select-none overflow-hidden relative rounded-3xl group"
            onPointerDown={jump}
        >
            {/* Dynamic Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF9A9E] via-[#FECFEF] to-[#A18CD1] opacity-60 scale-110 blur-xl transition-all duration-[10000ms] ease-in-out group-hover:hue-rotate-30" />
            <div className="absolute inset-0 bg-black/[0.02] dark:bg-black/20" />

            {/* Top Stats */}
            <div className="flex justify-between items-center px-8 py-6 z-20 w-full absolute top-0">
                <div className="flex flex-col items-start bg-white/30 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                    <span className="text-[10px] font-bold text-black/50 dark:text-white/60 uppercase tracking-widest leading-none">Best</span>
                    <span className="text-xl font-black text-black/90 dark:text-white/90 leading-none mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>{highScore}</span>
                </div>
                {/* Volume Button Here */}
                <button
                    onClick={(e) => { e.stopPropagation(); setSoundOn(!soundOn); }}
                    className="absolute top-6 left-1/2 -translate-x-1/2 z-30 p-2 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur-md hover:bg-white/50 dark:hover:bg-white/20 border border-white/20 transition-colors"
                >
                    {soundOn ? <Volume2 size={16} className="text-black/70 dark:text-white/70" /> : <VolumeX size={16} className="text-black/40 dark:text-white/40" />}
                </button>
                <div className="flex flex-col items-end bg-white/30 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                    <span className="text-[10px] font-bold text-black/50 dark:text-white/60 uppercase tracking-widest leading-none">Current</span>
                    <span className="text-2xl font-black text-[#FF3B30] leading-none mt-1" style={{ fontVariantNumeric: "tabular-nums" }}>{score}</span>
                </div>
            </div>

            {/* Game Area */}
            <div
                ref={containerRef}
                className="flex-1 relative w-full h-full overflow-hidden z-10"
            >
                {/* Player */}
                <div
                    ref={playerElem}
                    className="absolute z-30 transition-transform origin-center"
                    style={{
                        left: '60px',
                        width: `${PLAYER_SIZE}px`,
                        height: `${PLAYER_SIZE}px`
                    }}
                >
                    <div className="w-full h-full bg-white dark:bg-black/50 backdrop-blur-md rounded-[12px] border-[2px] border-black/10 dark:border-white/20 flex items-center justify-center shadow-xl shadow-black/10">
                        <Command size={20} className="text-black dark:text-white" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Pipes */}
                <div ref={pipesContainer} className="absolute inset-0 z-20" />

                {/* Idle Help Text */}
                <AnimatePresence>
                    {!isPlaying && !isGameOver && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                        >
                            <div className="bg-white/50 dark:bg-black/50 backdrop-blur-lg px-6 py-3 rounded-full border border-white/30 flex items-center gap-3 shadow-xl">
                                <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-ping" />
                                <span className="text-sm font-bold text-black/70 dark:text-white/80 tracking-widest uppercase">
                                    Tap to Fly
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
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-8 rounded-[2rem] flex flex-col items-center gap-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)] mx-4 w-[280px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-1">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">Crashed!</h2>
                            <div className="flex flex-col items-center mt-2 bg-black/5 dark:bg-white/5 rounded-xl px-8 py-3 w-full">
                                <span className="text-[11px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Score</span>
                                <span className="text-3xl font-black text-black dark:text-white">{score}</span>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); startGame(); }}
                                className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#007AFF] text-white font-bold text-[15px] hover:bg-[#005bb5] transition-colors active:scale-95 shadow-lg shadow-blue-500/30"
                            >
                                <RotateCcw size={16} strokeWidth={2.5} />
                                Try Again
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
