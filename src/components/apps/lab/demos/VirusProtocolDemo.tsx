"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, ShieldAlert, Play, RotateCcw, Activity, Pause } from "lucide-react";

// --- Constants & Config ---
const PLAYER_SPEED = 4.2;
const PLAYER_RADIUS = 12;
const BULLET_SPEED = 16;
const BULLET_RADIUS = 3.5;
const ENEMY_BASE_SPEED = 1.4;

const WAVES = [
    { level: 1, title: "System Breach", desc: "Basic trojans detected. Standard pistol authorized.", count: 15, spawnRate: 1500, types: ['basic'] },
    { level: 2, title: "Memory Corruption", desc: "Fast-moving worms & trojans. Weapon Upgraded: Auto-Rifle.", count: 35, spawnRate: 1000, types: ['basic', 'fast'] },
    { level: 3, title: "Data Hijack", desc: "Ransomware inbound. Weapon Upgraded: Spread Shot.", count: 50, spawnRate: 800, types: ['basic', 'fast', 'tank'] },
    { level: 4, title: "DDoS Swarm", desc: "Massive influx of micro-malware. Survive the swarm!", count: 120, spawnRate: 150, types: ['swarm'] },
    { level: 5, title: "Kernel Core Entity", desc: "The source of the infection. Destroy it.", count: 1, spawnRate: 99999, types: ['boss'] }
];

// --- Types ---
interface Vector2 { x: number; y: number; }
interface Bullet extends Vector2 { id: number; vx: number; vy: number; damage: number; color: string; }
interface Enemy extends Vector2 { id: number; hp: number; maxHp: number; speed: number; type: string; radius: number; }
interface Particle extends Vector2 { vx: number; vy: number; life: number; maxLife: number; color: string; size: number; }
interface DropItem extends Vector2 { id: number; type: 'hp'; life: number; maxLife: number; startY: number; }

export function VirusProtocolDemo() {
    // We keep UI state synced but drive logic from Refs to avoid Stale Closures
    const [uiGameState, setUiGameState] = useState<'menu' | 'story' | 'playing' | 'gameover' | 'victory' | 'paused'>('menu');
    const [uiWave, setUiWave] = useState(0);
    const [uiScore, setUiScore] = useState(0);
    const [uiHp, setUiHp] = useState(100);

    // --- Core Canvas & DOM Refs ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const boundsRef = useRef({ width: 800, height: 600 });

    // --- Absolute Game State Refs (The Source of Truth) ---
    const stateRef = useRef<'menu' | 'story' | 'playing' | 'gameover' | 'victory' | 'paused'>('menu');
    const playerRef = useRef<{ x: number; y: number; hp: number; maxHp: number; score: number; wave: number; waveStartScore: number }>({ x: 400, y: 300, hp: 100, maxHp: 100, score: 0, wave: 0, waveStartScore: 0 });
    const waveStartScoreRef = useRef(0); // Anti-farm exploit

    // --- Entities ---
    const bulletsRef = useRef<Bullet[]>([]);
    const enemiesRef = useRef<Enemy[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const itemsRef = useRef<DropItem[]>([]);

    // --- Inputs ---
    const keysRef = useRef<{ [key: string]: boolean }>({});
    const mouseRef = useRef<{ x: number; y: number; down: boolean }>({ x: 400, y: 300, down: false });

    // --- Timing & Spawns ---
    const waveStateRef = useRef({ spawned: 0, killed: 0, lastSpawn: 0 });
    const lastFireTimeRef = useRef(0);
    const lastFrameTimeRef = useRef(0);
    const reqFrameRef = useRef(0);

    // --- Visual Juice ---
    const screenShakeRef = useRef(0);
    const damageFlashRef = useRef(0);

    // --- Sync Helper ---
    const syncUI = useCallback(() => {
        setUiGameState((prev) => prev !== stateRef.current ? stateRef.current : prev);
        setUiWave((prev) => prev !== playerRef.current.wave ? playerRef.current.wave : prev);
        setUiScore((prev) => prev !== playerRef.current.score ? playerRef.current.score : prev);
        setUiHp(Math.ceil(playerRef.current.hp));
    }, []);

    // --- Handlers & Observer ---
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                boundsRef.current = { width: entry.contentRect.width, height: entry.contentRect.height };
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
        // --- Input Handlers ---
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keysRef.current[e.code] = true;
            if (e.code === 'Escape') {
                if (stateRef.current === 'playing') {
                    stateRef.current = 'paused';
                    syncUI();
                } else if (stateRef.current === 'paused') {
                    stateRef.current = 'playing';
                    lastFrameTimeRef.current = performance.now();
                    syncUI();
                }
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const togglePause = () => {
        if (stateRef.current === 'playing') {
            stateRef.current = 'paused';
            syncUI();
        } else if (stateRef.current === 'paused') {
            stateRef.current = 'playing';
            lastFrameTimeRef.current = performance.now(); // Reset delta completely
            syncUI();
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = Math.max(0, Math.min(boundsRef.current.width, e.clientX - rect.left));
        mouseRef.current.y = Math.max(0, Math.min(boundsRef.current.height, e.clientY - rect.top));
    };

    const handleMouseDown = () => { mouseRef.current.down = true; };
    const handleMouseUp = () => { mouseRef.current.down = false; };
    const handleMouseLeave = () => { mouseRef.current.down = false; };

    // --- Juice & Feedback ---
    const addShake = (amount: number) => {
        screenShakeRef.current = Math.min(screenShakeRef.current + amount, 20);
    };

    const flashDamage = () => {
        damageFlashRef.current = 1.0;
        addShake(10);
    };

    const createParticles = (x: number, y: number, color: string, count: number, speedMult: number = 1) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 3 + 1) * speedMult;
            particlesRef.current.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: Math.random() * 20 + 20,
                color,
                size: Math.random() * 3 + 1.5
            });
        }
    };

    // --- Logic ---
    const spawnEnemy = (waveInfo: typeof WAVES[0]) => {
        waveStateRef.current.spawned++;

        let ex = 0, ey = 0;
        const edge = Math.floor(Math.random() * 4);
        const margin = 100; // Farther out to avoid popping in during resize
        if (edge === 0) { ex = Math.random() * boundsRef.current.width; ey = -margin; }
        else if (edge === 1) { ex = boundsRef.current.width + margin; ey = Math.random() * boundsRef.current.height; }
        else if (edge === 2) { ex = Math.random() * boundsRef.current.width; ey = boundsRef.current.height + margin; }
        else { ex = -margin; ey = Math.random() * boundsRef.current.height; }

        const type = waveInfo.types[Math.floor(Math.random() * waveInfo.types.length)];
        let hp = 20, speed = ENEMY_BASE_SPEED, radius = 14;

        if (type === 'fast') { hp = 15; speed = ENEMY_BASE_SPEED * 1.8; radius = 12; }
        else if (type === 'tank') { hp = 80; speed = ENEMY_BASE_SPEED * 0.7; radius = 22; }
        else if (type === 'swarm') { hp = 8; speed = ENEMY_BASE_SPEED * 2.2; radius = 8; }
        else if (type === 'boss') { hp = 2000; speed = ENEMY_BASE_SPEED * 0.5; radius = 60; ex = boundsRef.current.width / 2; ey = -100; }

        enemiesRef.current.push({
            id: Math.random(), x: ex, y: ey,
            hp, maxHp: hp, speed, type: type as string, radius
        });
    };

    const spawnItem = (x: number, y: number) => {
        if (Math.random() < 0.1) { // 10% chance
            itemsRef.current.push({
                id: Math.random(),
                x, y, startY: y,
                type: 'hp',
                life: 0, maxLife: 600 // 10 secs
            });
        }
    };

    const fireWeapon = () => {
        const p = playerRef.current;
        const waveLvl = WAVES[p.wave]?.level || 1;

        let fireRate = 200;
        let bulletCount = 1;
        let spreadAngle = 0;
        let bColor = "#007AFF";
        let damage = 10;

        if (waveLvl === 1) { fireRate = 220; }
        else if (waveLvl === 2) { fireRate = 120; bColor = "#34C759"; }
        else if (waveLvl === 3) { fireRate = 350; bulletCount = 3; spreadAngle = 0.25; bColor = "#FF9500"; damage = 15; }
        else if (waveLvl >= 4) { fireRate = 180; bulletCount = 4; spreadAngle = 0.3; bColor = "#FF2D55"; damage = 18; }

        const time = performance.now();
        if (time - lastFireTimeRef.current > fireRate) {
            lastFireTimeRef.current = time;
            const baseAngle = Math.atan2(mouseRef.current.y - p.y, mouseRef.current.x - p.x);
            addShake(bulletCount * 1.5);

            for (let i = 0; i < bulletCount; i++) {
                let angle = baseAngle;
                if (bulletCount > 1) {
                    const offset = (i / (bulletCount - 1)) - 0.5;
                    angle += offset * spreadAngle * 2;
                }
                angle += (Math.random() - 0.5) * 0.05;

                bulletsRef.current.push({
                    id: Math.random(),
                    x: p.x + Math.cos(angle) * (PLAYER_RADIUS + 5),
                    y: p.y + Math.sin(angle) * (PLAYER_RADIUS + 5),
                    vx: Math.cos(angle) * BULLET_SPEED,
                    vy: Math.sin(angle) * BULLET_SPEED,
                    damage, color: bColor
                });
            }
        }
    };

    // --- Render Loop (Canvas) ---
    const drawCanvas = (ctx: CanvasRenderingContext2D) => {
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
        ctx.clearRect(0, 0, boundsRef.current.width * dpr, boundsRef.current.height * dpr);

        ctx.save();
        ctx.scale(dpr, dpr);

        // Apply Screen Shake
        ctx.save();
        const w = boundsRef.current.width;
        const h = boundsRef.current.height;

        if (screenShakeRef.current > 0) {
            const sx = (Math.random() - 0.5) * screenShakeRef.current;
            const sy = (Math.random() - 0.5) * screenShakeRef.current;
            ctx.translate(sx, sy);
            screenShakeRef.current *= 0.8;
            if (screenShakeRef.current < 0.5) screenShakeRef.current = 0;
        }

        // Grid
        ctx.strokeStyle = "rgba(0,0,0,0.03)";
        ctx.lineWidth = 1;
        const gridSize = 40;
        ctx.beginPath();
        for (let x = 0; x < w; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = 0; y < h; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();

        // Damage Tint
        if (damageFlashRef.current > 0) {
            ctx.fillStyle = `rgba(255, 59, 48, ${damageFlashRef.current * 0.3})`;
            ctx.fillRect(0, 0, w, h);
            damageFlashRef.current *= 0.85;
            if (damageFlashRef.current < 0.01) damageFlashRef.current = 0;
        }

        // 3. Items (Drops)
        itemsRef.current.forEach(item => {
            // Blink if about to expire
            const timeRemaining = item.maxLife - item.life;
            if (timeRemaining < 120 && Math.floor(timeRemaining / 10) % 2 === 0) return;

            const floatY = Math.sin(performance.now() / 200 + item.id) * 3;

            ctx.fillStyle = "#34C759"; // Green HP
            const size = 12;
            ctx.fillRect(item.x - size / 2, item.y - size / 2 + floatY, size, size);
            // Cross inside
            ctx.fillStyle = "white";
            ctx.fillRect(item.x - 2, item.y - size / 2 + 2 + floatY, 4, size - 4);
            ctx.fillRect(item.x - size / 2 + 2, item.y - 2 + floatY, size - 4, 4);

            // Glow
            ctx.shadowColor = "#34C759";
            ctx.shadowBlur = 10;
            ctx.fillRect(item.x - size / 2, item.y - size / 2 + floatY, size, size);
            ctx.shadowBlur = 0;
        });

        // Particles
        particlesRef.current.forEach(p => {
            ctx.globalAlpha = 1 - (p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Enemies
        enemiesRef.current.forEach(e => {
            ctx.fillStyle = e.type === 'fast' ? "#FF9500" : e.type === 'tank' ? "#8A2BE2" : e.type === 'swarm' ? "#FF2D55" : e.type === 'boss' ? "#000000" : "#FF3B30";

            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            ctx.fill();

            if (e.type === 'boss') {
                ctx.strokeStyle = "#FF3B30";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.radius + Math.random() * 5, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (e.hp < e.maxHp && e.type !== 'swarm') {
                const barWidth = e.radius * 2;
                const barY = e.y - e.radius - 8;
                ctx.fillStyle = "rgba(255,0,0,0.3)";
                ctx.fillRect(e.x - barWidth / 2, barY, barWidth, 4);
                ctx.fillStyle = e.type === 'boss' ? "#FF3B30" : "#34C759";
                ctx.fillRect(e.x - barWidth / 2, barY, barWidth * (e.hp / e.maxHp), 4);
            }
        });

        // Bullets
        bulletsRef.current.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, BULLET_RADIUS, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Player
        const p = playerRef.current;
        const angleToMouse = Math.atan2(mouseRef.current.y - p.y, mouseRef.current.x - p.x);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angleToMouse);
        ctx.fillStyle = "#007AFF";
        ctx.beginPath();
        ctx.arc(0, 0, PLAYER_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#005bb5";
        ctx.fillRect(0, -4, 20, 8);
        ctx.restore();

        // Crosshair
        ctx.strokeStyle = "rgba(0, 122, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
        ctx.stroke();
        // Crosshair reticle
        ctx.strokeStyle = "rgba(0, 122, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore(); // End screen shake translation
        ctx.restore(); // End DPR scale
    };// --- Main Game Engine ---
    const updateGame = (time: number) => {
        if (stateRef.current !== 'playing') {
            reqFrameRef.current = requestAnimationFrame(updateGame);
            return;
        }

        let dt = time - lastFrameTimeRef.current;
        if (dt > 100) dt = 16;
        lastFrameTimeRef.current = time;
        const timeScale = dt / 16.66;

        const waveInfo = WAVES[playerRef.current.wave];
        if (!waveInfo) return;

        const p = playerRef.current;

        // Player Movement
        const keys = keysRef.current;
        let dx = 0, dy = 0;
        if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length; dy /= length;
        }

        p.x += dx * PLAYER_SPEED * timeScale;
        p.y += dy * PLAYER_SPEED * timeScale;
        p.x = Math.max(PLAYER_RADIUS, Math.min(boundsRef.current.width - PLAYER_RADIUS, p.x));
        p.y = Math.max(PLAYER_RADIUS, Math.min(boundsRef.current.height - PLAYER_RADIUS, p.y));

        if (mouseRef.current.down) fireWeapon();

        // Bullets Physic
        for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
            const b = bulletsRef.current[i];
            if (!b) continue;
            b.x += b.vx * timeScale;
            b.y += b.vy * timeScale;

            // Remove offscreen padding (increased pad size for smooth resize behavior)
            const pad = 100;
            if (b.x < -pad || b.x > boundsRef.current.width + pad || b.y < -pad || b.y > boundsRef.current.height + pad) {
                bulletsRef.current.splice(i, 1);
            }
        }

        // Wave Spawn
        const wState = waveStateRef.current;
        if (wState.spawned < waveInfo.count) {
            const dynamicSpawnRate = enemiesRef.current.length < 5 ? waveInfo.spawnRate / 2 : waveInfo.spawnRate;
            if (time - wState.lastSpawn > dynamicSpawnRate) {
                spawnEnemy(waveInfo);
                wState.lastSpawn = time;
            }
        }

        // Items Handling
        for (let i = itemsRef.current.length - 1; i >= 0; i--) {
            const item = itemsRef.current[i];
            if (!item) continue;
            item.life += 1 * timeScale;

            if (Math.hypot(p.x - item.x, p.y - item.y) < PLAYER_RADIUS + 15) {
                p.hp = Math.min(p.maxHp, p.hp + 20); // Heal 20
                createParticles(item.x, item.y, "#34C759", 8);
                itemsRef.current.splice(i, 1);
                continue;
            }

            if (item.life >= item.maxLife) itemsRef.current.splice(i, 1);
        }

        // Enemy Math
        let pDamage = 0;
        for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
            const e = enemiesRef.current[i];
            if (!e) continue;
            // Swarm movement erraticness
            let angleToPlayer = Math.atan2(p.y - e.y, p.x - e.x);
            if (e.type === 'swarm') {
                angleToPlayer += Math.sin(time / 200 + e.id) * 0.5; // wobbly
            }

            e.x += Math.cos(angleToPlayer) * e.speed * timeScale;
            e.y += Math.sin(angleToPlayer) * e.speed * timeScale;

            // Padding zone logic: If window shrinks, warp enemy closer to bounds to avoid stuck off-screen
            const enemyPad = 80;
            if (e.x < -enemyPad) e.x = -enemyPad;
            if (e.x > boundsRef.current.width + enemyPad) e.x = boundsRef.current.width + enemyPad;
            if (e.y < -enemyPad) e.y = -enemyPad;
            if (e.y > boundsRef.current.height + enemyPad) e.y = boundsRef.current.height + enemyPad;

            // Player Collision (Damage)
            if (Math.hypot(p.x - e.x, p.y - e.y) < PLAYER_RADIUS + e.radius) {
                const dmgMod = e.type === 'boss' ? 5 : e.type === 'tank' ? 2 : e.type === 'swarm' ? 0.3 : 1;
                pDamage += dmgMod * timeScale;
                p.x -= Math.cos(angleToPlayer) * 2;
                p.y -= Math.sin(angleToPlayer) * 2;
            }

            for (let j = bulletsRef.current.length - 1; j >= 0; j--) {
                const b = bulletsRef.current[j];
                if (!b) continue;
                if (Math.hypot(b.x - e.x, b.y - e.y) < e.radius + BULLET_RADIUS) {
                    e.hp -= b.damage;
                    createParticles(b.x, b.y, b.color, 4);
                    bulletsRef.current.splice(j, 1);
                    if (e.type !== 'boss') {
                        e.x += b.vx * 0.1;
                        e.y += b.vy * 0.1;
                    }
                }
            }

            if (e.hp <= 0) {
                const color = e.type === 'fast' ? "#FF9500" : e.type === 'tank' ? "#8A2BE2" : e.type === 'swarm' ? "#FF2D55" : e.type === 'boss' ? "#000000" : "#FF3B30";
                createParticles(e.x, e.y, color, e.type === 'boss' ? 80 : 15, e.type === 'boss' ? 3 : 1);
                spawnItem(e.x, e.y);

                const pts = e.type === 'boss' ? 5000 : e.type === 'tank' ? 100 : e.type === 'fast' ? 40 : e.type === 'swarm' ? 10 : 20;
                p.score += pts;
                wState.killed++;

                if (e.type === 'boss' || e.type === 'tank') addShake(e.type === 'boss' ? 30 : 10);
                enemiesRef.current.splice(i, 1);
            }
        }

        if (pDamage > 0) {
            p.hp -= pDamage;
            flashDamage();
            if (p.hp <= 0) {
                stateRef.current = 'gameover';
                syncUI();
                reqFrameRef.current = requestAnimationFrame(updateGame);
                return;
            }
        }

        // Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
            const part = particlesRef.current[i];
            if (!part) continue;
            part.x += part.vx * timeScale;
            part.y += part.vy * timeScale;
            part.life += 1 * timeScale;
            if (part.life >= part.maxLife) particlesRef.current.splice(i, 1);
        }

        // Wave Logic
        if (wState.killed >= waveInfo.count) {
            if (p.wave + 1 < WAVES.length) {
                stateRef.current = 'story';
                p.wave++;
                syncUI();
                setTimeout(() => { startWaveInternal(); }, 3500);
            } else {
                stateRef.current = 'victory';
                syncUI();
            }
        }

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) drawCanvas(ctx);
        }

        syncUI();
        reqFrameRef.current = requestAnimationFrame(updateGame);
    };

    // --- State Transitions ---
    const startWaveInternal = () => {
        // Reset wave counters
        waveStateRef.current = { spawned: 0, killed: 0, lastSpawn: performance.now() };
        bulletsRef.current = [];
        itemsRef.current = []; // Clear old items maybe or keep them? Clear for cleanliness.

        // Save score at beginning of wave for Retry
        playerRef.current.waveStartScore = playerRef.current.score;

        stateRef.current = 'playing';
        syncUI();
    };

    const handleStartClick = () => {
        // Initial Game Reset Total
        playerRef.current = { x: boundsRef.current.width / 2, y: boundsRef.current.height / 2, hp: 100, maxHp: 100, score: 0, wave: 0, waveStartScore: 0 };
        enemiesRef.current = [];
        bulletsRef.current = [];
        particlesRef.current = [];
        itemsRef.current = [];

        stateRef.current = 'story';
        // Ensure loop is running exactly once
        if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
        lastFrameTimeRef.current = performance.now();
        reqFrameRef.current = requestAnimationFrame(updateGame);

        setTimeout(() => {
            startWaveInternal();
        }, 3500);
    };

    const handleRetryPhaseClick = () => {
        // Restore Player to current wave start (Score back to pre-wave, full HP)
        playerRef.current.hp = playerRef.current.maxHp;
        playerRef.current.score = playerRef.current.waveStartScore;

        enemiesRef.current = [];
        bulletsRef.current = [];
        particlesRef.current = [];
        itemsRef.current = [];

        stateRef.current = 'story';
        syncUI();

        if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
        lastFrameTimeRef.current = performance.now();
        reqFrameRef.current = requestAnimationFrame(updateGame);

        setTimeout(() => {
            startWaveInternal();
        }, 3500);
    };

    // Global cleanup
    useEffect(() => {
        return () => {
            if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
        };
    }, []);

    // Idle draw
    useEffect(() => {
        if (uiGameState !== 'playing' && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) drawCanvas(ctx);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uiGameState]);

    const activeWave = WAVES[uiWave];

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex flex-col select-none overflow-hidden relative rounded-3xl group bg-[#FBFBFD] dark:bg-[#1C1C1E] ring-1 ring-black/[0.05] dark:ring-white/[0.05]"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: uiGameState === 'playing' ? 'none' : 'default' }}
        >
            {/* HTML5 Canvas Surface */}
            <canvas
                ref={canvasRef}
                width={boundsRef.current.width * (typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
                height={boundsRef.current.height * (typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
                style={{ width: boundsRef.current.width, height: boundsRef.current.height }}
                className="block absolute inset-0 z-0"
            />

            {/* In-Game HUDs */}
            {(uiGameState === 'playing' || uiGameState === 'paused') && (
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
                    <div className="flex flex-col gap-2">
                        <div className={`backdrop-blur-xl px-4 py-2.5 rounded-2xl border flex items-center gap-3 shadow-sm transition-colors duration-300 ${uiHp < 30 ? 'bg-red-500/10 border-red-500/30' : 'bg-white/80 dark:bg-black/50 border-black/5 dark:border-white/10'}`}>
                            <ShieldAlert size={18} className={uiHp < 30 ? "text-red-500 animate-pulse" : "text-[#007AFF]"} />
                            <div className="w-[140px] h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden shadow-inner relative">
                                <div
                                    className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${uiHp < 30 ? 'bg-red-500' : 'bg-[#007AFF]'}`}
                                    style={{ width: `${Math.max(0, uiHp)}%` }}
                                />
                            </div>
                            <span className={`text-[13px] font-black font-mono w-10 text-right ${uiHp < 30 ? 'text-red-500' : 'text-black/80 dark:text-white/80'}`}>{Math.max(0, uiHp)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="bg-white/80 dark:bg-black/50 backdrop-blur-xl px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 flex items-center gap-3">
                            <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Phase</span>
                            <span className="text-[13px] font-black text-[#FF9500] font-mono">{activeWave?.level} / {WAVES.length}</span>
                        </div>
                        <div className="bg-white/80 dark:bg-black/50 backdrop-blur-xl px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 flex items-center gap-3">
                            <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">Score</span>
                            <span className="text-[15px] font-black text-[#8A2BE2] font-mono">{uiScore.toString().padStart(6, '0')}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlays / Modals */}
            <AnimatePresence mode="wait">
                {uiGameState === 'menu' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-sm"
                    >
                        <div className="bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl max-w-sm text-center">
                            <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] mb-1 ring-1 ring-[#007AFF]/20">
                                <Crosshair size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-black dark:text-white tracking-tight">Virus Protocol</h2>
                            <p className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed font-medium">
                                Defend the core. Move with <kbd className="font-mono bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-black dark:text-white shadow-sm">WASD</kbd>, aim & shoot with your <kbd className="font-mono bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-black dark:text-white shadow-sm">Mouse</kbd>. Secure all 5 phases. <br /><br />
                                <span className="opacity-70">(Press ESC to Pause)</span>
                            </p>
                            <button
                                onClick={() => handleStartClick()}
                                className="mt-5 w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-[15px] hover:scale-[1.02] transition-transform active:scale-95 shadow-xl"
                            >
                                <Play size={16} className="fill-current" /> Initialize Sequence
                            </button>
                        </div>
                    </motion.div>
                )}

                {uiGameState === 'story' && activeWave && (
                    <motion.div
                        key="story"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
                    >
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex flex-col items-center gap-6 text-center max-w-lg px-6">
                            <Activity size={48} className="text-[#007AFF] animate-pulse" />
                            <h2 className="text-4xl font-black text-white tracking-widest uppercase">
                                Phase {activeWave.level}
                            </h2>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
                                <h3 className="text-2xl font-bold text-[#FF3B30] mb-3">{activeWave.title}</h3>
                                <p className="text-white/70 text-sm font-mono leading-relaxed">{activeWave.desc}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-white/50">
                                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {uiGameState === 'gameover' && (
                    <motion.div
                        key="gameover"
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(20px)" }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-red-950/70"
                    >
                        <div className="bg-black/60 border border-red-500/30 p-10 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl max-w-sm text-center">
                            <ShieldAlert size={48} className="text-red-500 mb-1" />
                            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">System Core<br />Compromised</h2>
                            <div className="w-full bg-red-500/10 rounded-2xl p-5 mt-3 border border-red-500/20">
                                <p className="text-[10px] text-red-500/80 uppercase tracking-widest mb-1 font-bold">Final Score</p>
                                <p className="text-4xl font-black font-mono text-white">{uiScore}</p>
                                <p className="text-xs text-red-300 mt-2">Died at Phase {activeWave?.level}</p>
                            </div>
                            <div className="flex gap-3 mt-5 w-full">
                                <button
                                    onClick={handleRetryPhaseClick}
                                    className="flex-1 flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white text-black font-bold text-[14px] hover:bg-gray-200 transition-colors active:scale-95 shadow-lg"
                                >
                                    <RotateCcw size={18} strokeWidth={2.5} />
                                    <span>Retry Phase</span>
                                </button>
                                <button
                                    onClick={handleStartClick}
                                    className="flex-1 flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-red-500/20 text-red-500 font-bold text-[14px] hover:bg-red-500/30 transition-colors active:scale-95 border border-red-500/30"
                                >
                                    <ShieldAlert size={18} className="fill-current" />
                                    <span>Reboot Total</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {uiGameState === 'paused' && (
                    <motion.div
                        key="paused"
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(10px)" }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
                    >
                        <div className="bg-black/80 border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl max-w-sm text-center">
                            <Activity size={48} className="text-[#007AFF] animate-pulse mb-1" />
                            <h2 className="text-3xl font-black text-white tracking-widest uppercase">[ SYSTEM PAUSED ]</h2>
                            <p className="text-[13px] text-white/60 font-mono mt-2">Press ESC or click below to resume.</p>
                            <button
                                onClick={() => {
                                    stateRef.current = 'playing';
                                    lastFrameTimeRef.current = performance.now();
                                    syncUI();
                                }}
                                className="mt-5 w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#007AFF] text-white font-bold text-[15px] hover:bg-[#005bb5] transition-colors active:scale-95 shadow-lg shadow-[#007AFF]/20"
                            >
                                <Play size={16} className="fill-current" /> Resume Operation
                            </button>
                        </div>
                    </motion.div>
                )}

                {uiGameState === 'victory' && (
                    <motion.div
                        key="victory"
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(20px)" }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-green-950/70"
                    >
                        <div className="bg-black/60 border border-green-500/30 p-10 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl max-w-sm text-center">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-1">
                                <Activity size={40} className="text-green-500" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight">System Secured</h2>
                            <p className="text-[13px] border-y border-white/10 py-4 text-white/70 font-mono leading-relaxed">
                                All malwares eradicated. The core architecture is completely clean and stable.
                            </p>
                            <div className="w-full bg-green-500/10 rounded-2xl p-5 mt-2 mb-3 border border-green-500/20">
                                <p className="text-[10px] text-green-500/80 uppercase tracking-widest mb-1 font-bold">Perfect Score</p>
                                <p className="text-4xl font-black font-mono text-white">{uiScore}</p>
                            </div>
                            <button
                                onClick={() => handleStartClick()}
                                className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-green-500 text-white font-bold text-[15px] hover:bg-green-600 transition-colors active:scale-95 shadow-lg shadow-green-500/20"
                            >
                                <Play size={16} className="fill-current" /> Play Again
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
