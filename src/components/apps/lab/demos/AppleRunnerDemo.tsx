/* eslint-disable react-hooks/exhaustive-deps, react-hooks/purity */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Bug, RotateCcw, Volume2, VolumeX } from "lucide-react";

// --- Types & Constants ---
const GRAVITY = 0.6;
const JUMP_VELOCITY = -10;
const OBSTACLE_SPEED = 5;
const SPAWN_RATE = 1500; // ms
const DINO_SIZE = 40;
const OBSTACLE_SIZE = 30;

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

    jump() { this.playTone(300, 0.1, "sine", 0.08); setTimeout(() => this.playTone(400, 0.15, "sine", 0.08), 50); }
    score() { this.playTone(800, 0.05, "square", 0.05); }
    crash() { [150, 120, 90].forEach((f, i) => setTimeout(() => this.playTone(f, 0.2, "sawtooth", 0.15), i * 150)); }
}

const sfx = new SoundEngine();

interface Obstacle {
    id: number;
    x: number;
    passed: boolean;
}

export function AppleRunnerDemo() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [soundOn, setSoundOn] = useState(true);

    const [bounds, setBounds] = useState({ width: 800, height: 400 });
    const boundsRef = useRef({ width: 800, height: 400 });

    // Game state refs (for performance in requestAnimationFrame)
    const dinoY = useRef(300); // initial guess, will update
    const velocity = useRef(0);
    const obstacles = useRef<Obstacle[]>([]);
    const lastTime = useRef<number>(0);
    const lastSpawn = useRef<number>(0);
    const currentSpawnDelay = useRef<number>(1500);
    const scoreRef = useRef(0);
    const requestRef = useRef<number>(0);

    // DOM Elements refs
    const dinoElem = useRef<HTMLDivElement>(null);
    const containerElem = useRef<HTMLDivElement>(null);
    const scoreElem = useRef<HTMLDivElement>(null);

    useEffect(() => { sfx.enabled = soundOn; }, [soundOn]);

    useEffect(() => {
        if (containerElem.current) {
            const w = containerElem.current.clientWidth;
            const h = containerElem.current.clientHeight;
            setBounds({ width: w, height: h });
            boundsRef.current = { width: w, height: h };
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
        if (containerElem.current) observer.observe(containerElem.current);
        return () => observer.disconnect();
    }, []);

    const getGroundY = () => boundsRef.current.height - 80; // Ground line height

    // Input handlers
    const jump = useCallback(() => {
        if (!isPlaying && !isGameOver) {
            startGame();
            return;
        }
        if (isGameOver) return;

        // Allow jumping only if on the ground
        if (dinoY.current >= getGroundY() - 1) {
            velocity.current = JUMP_VELOCITY;
            sfx.jump();
        }
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

    function startGame() {
        setIsPlaying(true);
        setIsGameOver(false);
        setScore(0);
        scoreRef.current = 0;
        dinoY.current = getGroundY();
        velocity.current = 0;
        obstacles.current = [];
        lastTime.current = performance.now();
        lastSpawn.current = performance.now();
        currentSpawnDelay.current = SPAWN_RATE + Math.random() * 1000 - 500;

        requestRef.current = requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        setIsPlaying(false);
        setIsGameOver(true);
        if (scoreRef.current > highScore) {
            setHighScore(Math.floor(scoreRef.current));
        }
        sfx.crash();
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }

    function gameLoop(time: number) {
        if (!lastTime.current) lastTime.current = time;
        let deltaTime = time - lastTime.current;
        if (deltaTime > 100) deltaTime = 16;
        lastTime.current = time;
        const timeScale = deltaTime / 16.66;

        // --- Physics ---
        const groundY = getGroundY();
        velocity.current += GRAVITY * timeScale;
        dinoY.current += velocity.current * timeScale;

        // Ground collision
        if (dinoY.current > groundY) {
            dinoY.current = groundY;
            velocity.current = 0;
        }

        // --- Obstacles Manager ---
        // Spawn
        if (time - lastSpawn.current > currentSpawnDelay.current) {
            obstacles.current.push({
                id: Math.random(),
                x: boundsRef.current.width + 50, // Spawn offscreen right
                passed: false
            });
            lastSpawn.current = time;
            currentSpawnDelay.current = SPAWN_RATE + Math.random() * 1000 - 500;
        }

        // Move & Collide
        const speedMultiplier = 1 + (scoreRef.current * 0.005); // increases speed slightly
        for (let i = 0; i < obstacles.current.length; i++) {
            const obs = obstacles.current[i];
            if (!obs) continue;
            obs.x -= OBSTACLE_SPEED * speedMultiplier * timeScale;

            // Score increment
            if (!obs.passed && obs.x < 50) { // 50 is player X position
                obs.passed = true;
                scoreRef.current += 10;
                setScore(Math.floor(scoreRef.current));
                sfx.score();
            }

            // Collision Detection (AABB)
            const dinoHitbox = { x: 50, y: dinoY.current - DINO_SIZE, w: DINO_SIZE * 0.6, h: DINO_SIZE * 0.8 };
            const obsHitbox = { x: obs.x, y: groundY - OBSTACLE_SIZE, w: OBSTACLE_SIZE * 0.8, h: OBSTACLE_SIZE * 0.8 };

            if (
                dinoHitbox.x < obsHitbox.x + obsHitbox.w &&
                dinoHitbox.x + dinoHitbox.w > obsHitbox.x &&
                dinoHitbox.y < obsHitbox.y + obsHitbox.h &&
                dinoHitbox.y + dinoHitbox.h > obsHitbox.y
            ) {
                gameOver();
                return; // Stop current frame
            }
        }

        // Remove offscreen obstacles
        obstacles.current = obstacles.current.filter(obs => obs.x > -50);

        // Score tick (passive score like Chrome dino)
        scoreRef.current += deltaTime * 0.01;

        // Update DOM
        updateDOM();

        requestRef.current = requestAnimationFrame(gameLoop);
    }

    function updateDOM() {
        const groundY = getGroundY();
        if (dinoElem.current) {
            dinoElem.current.style.transform = `translateY(${dinoY.current - groundY}px)`;
        }

        const obsContainer = containerElem.current?.querySelector('#obstacles-container');
        if (obsContainer) {
            obsContainer.innerHTML = '';
            obstacles.current.forEach(obs => {
                const el = document.createElement('div');
                el.style.position = 'absolute';
                el.style.left = `${obs.x}px`;
                el.style.top = `${groundY - OBSTACLE_SIZE}px`;
                el.style.width = `${OBSTACLE_SIZE}px`;
                el.style.height = `${OBSTACLE_SIZE}px`;
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
                el.style.color = '#ef4444'; // red-500
                el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bug"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c-2.1.2-3.66 1.9-3.66 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>';
                obsContainer.appendChild(el);
            });
        }

        if (scoreElem.current) {
            scoreElem.current.innerText = Math.floor(scoreRef.current).toString().padStart(5, '0');
        }
    }

    // Cleanup
    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Draw initial state
    useEffect(() => {
        if (!isPlaying && !isGameOver && bounds.height > 0) {
            dinoY.current = getGroundY();
            updateDOM();
        }
    }, [isPlaying, isGameOver, bounds]);

    return (
        <div
            className="w-full h-full flex flex-col select-none overflow-hidden relative"
            onPointerDown={jump}
            style={{
                background: "linear-gradient(to bottom, #E8EEF2, #FFFFFF)",
            }}
        >
            {/* Top Bar */}
            <div className="flex justify-between items-center px-6 py-4 z-10 w-full absolute top-0">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">High Score</span>
                    <span className="text-xl font-black text-black/80" style={{ fontVariantNumeric: "tabular-nums" }}>{highScore.toString().padStart(5, '0')}</span>
                </div>
                {/* Volume Button Here */}
                <button
                    onClick={(e) => { e.stopPropagation(); setSoundOn(!soundOn); }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-30 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                >
                    {soundOn ? <Volume2 size={16} className="text-black/50" /> : <VolumeX size={16} className="text-black/30" />}
                </button>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Score</span>
                    <span ref={scoreElem} className="text-xl font-black text-blue-500" style={{ fontVariantNumeric: "tabular-nums" }}>00000</span>
                </div>
            </div>

            {/* Game Area */}
            <div
                ref={containerElem}
                className="flex-1 relative w-full h-full overflow-hidden"
            >
                {/* Background Line */}
                <div
                    className="absolute w-full h-[2px] bg-black/10"
                    style={{ top: `${getGroundY()}px` }}
                />

                {/* Player (Rocket) */}
                <div
                    ref={dinoElem}
                    className="absolute z-20 will-change-transform"
                    style={{
                        left: '50px',
                        top: `${getGroundY() - DINO_SIZE}px`,
                        width: `${DINO_SIZE}px`,
                        height: `${DINO_SIZE}px`
                    }}
                >
                    <div className="w-full h-full bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Rocket size={24} className="text-white" />
                    </div>
                </div>

                {/* Obstacles Container */}
                <div id="obstacles-container" className="absolute inset-0 z-10" />

                {/* Initial Start Prompt */}
                <AnimatePresence>
                    {!isPlaying && !isGameOver && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <span className="text-sm font-semibold text-black/40 tracking-widest animate-pulse px-4 py-2 rounded-full bg-black/5 backdrop-blur-sm border border-black/5">
                                PRESS SPACE OR TAP TO JUMP
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Game Over Overlay */}
            <AnimatePresence>
                {isGameOver && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl flex flex-col items-center gap-4 shadow-2xl mx-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                                <Bug size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-black bg-clip-text">System Crashed</h2>
                            <p className="text-sm font-medium text-black/50 text-center max-w-[200px]">
                                You hit a bug. Your final score was <span className="text-black font-bold">{Math.floor(score)}</span>.
                            </p>

                            <button
                                onClick={(e) => { e.stopPropagation(); startGame(); }}
                                className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold hover:scale-105 transition-transform active:scale-95 shadow-xl"
                            >
                                <RotateCcw size={16} />
                                Restart
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
