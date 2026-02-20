"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
type GamePhase = "betting" | "playing" | "dealer-turn" | "result";
type GameResult = "win" | "lose" | "push" | "blackjack" | "bust" | null;

interface Card {
    suit: Suit;
    rank: Rank;
    faceUp: boolean;
}

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const BET_OPTIONS = [10, 25, 50, 100];

// ─── Sound Effects (Web Audio API) ──────────────────────────────────────────
class SoundEngine {
    private ctx: AudioContext | null = null;
    enabled = true;

    private getCtx(): AudioContext {
        if (!this.ctx) this.ctx = new AudioContext();
        return this.ctx;
    }

    playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
        if (!this.enabled) return;
        try {
            const ctx = this.getCtx();
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

    cardSlide() { this.playTone(800, 0.08, "triangle", 0.1); setTimeout(() => this.playTone(600, 0.06, "triangle", 0.08), 40); }
    chipClick() { this.playTone(2000, 0.05, "square", 0.06); setTimeout(() => this.playTone(2500, 0.04, "square", 0.05), 30); }
    win() { [523, 659, 784].forEach((f, i) => setTimeout(() => this.playTone(f, 0.2, "sine", 0.12), i * 120)); }
    lose() { [400, 350, 300].forEach((f, i) => setTimeout(() => this.playTone(f, 0.25, "sawtooth", 0.06), i * 150)); }
    blackjack() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.playTone(f, 0.25, "sine", 0.12), i * 100)); }
}

const sfx = new SoundEngine();

// ─── Helpers ────────────────────────────────────────────────────────────────
function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ suit, rank, faceUp: false });
        }
    }
    // Shuffle (Fisher-Yates)
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j]!, deck[i]!];
    }
    return deck;
}

function cardValue(card: Card): number {
    if (["J", "Q", "K"].includes(card.rank)) return 10;
    if (card.rank === "A") return 11;
    return parseInt(card.rank);
}

function handTotal(hand: Card[]): number {
    let total = hand.reduce((sum, c) => sum + cardValue(c), 0);
    let aces = hand.filter(c => c.rank === "A").length;
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return total;
}

function isBlackjack(hand: Card[]): boolean {
    return hand.length === 2 && handTotal(hand) === 21;
}

function suitColor(suit: Suit): string {
    return suit === "♥" || suit === "♦" ? "#E53935" : "#1A1A1A";
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function BlackjackDemo() {
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [balance, setBalance] = useState(1000);
    const [bet, setBet] = useState(0);
    const [phase, setPhase] = useState<GamePhase>("betting");
    const [result, setResult] = useState<GameResult>(null);
    const [message, setMessage] = useState("");
    const [soundOn, setSoundOn] = useState(true);
    const deckRef = useRef<Card[]>([]);

    useEffect(() => { sfx.enabled = soundOn; }, [soundOn]);

    const drawCard = useCallback((faceUp: boolean = true): Card => {
        if (deckRef.current.length === 0) deckRef.current = createDeck();
        const card = deckRef.current.pop()!;
        card.faceUp = faceUp;
        return card;
    }, []);

    const startNewRound = useCallback(() => {
        if (deckRef.current.length < 15) deckRef.current = createDeck();
        setPlayerHand([]);
        setDealerHand([]);
        setBet(0);
        setPhase("betting");
        setResult(null);
        setMessage("");
    }, []);

    useEffect(() => { deckRef.current = createDeck(); }, []);

    const placeBet = (amount: number) => {
        if (amount > balance) return;
        sfx.chipClick();
        setBet(prev => prev + amount);
    };

    const deal = () => {
        if (bet === 0) return;
        const p1 = drawCard(true);
        const d1 = drawCard(true);
        const p2 = drawCard(true);
        const d2 = drawCard(false); // face down

        setPlayerHand([p1, p2]);
        setDealerHand([d1, d2]);
        setBalance(prev => prev - bet);

        sfx.cardSlide();
        setTimeout(() => sfx.cardSlide(), 200);

        // Check natural blackjack
        const pTotal = handTotal([p1, p2]);
        if (pTotal === 21) {
            d2.faceUp = true;
            const dTotal = handTotal([d1, d2]);
            setDealerHand([d1, d2]);
            if (dTotal === 21) {
                setResult("push");
                setMessage("Push — Both Blackjack!");
                setBalance(prev => prev + bet);
                setPhase("result");
            } else {
                setResult("blackjack");
                setMessage("Blackjack! 🎉");
                setBalance(prev => prev + bet + Math.floor(bet * 1.5));
                setPhase("result");
                sfx.blackjack();
            }
        } else {
            setPhase("playing");
        }
    };

    const hit = () => {
        const card = drawCard(true);
        const newHand = [...playerHand, card];
        setPlayerHand(newHand);
        sfx.cardSlide();

        if (handTotal(newHand) > 21) {
            setResult("bust");
            setMessage("Bust! 💥");
            setPhase("result");
            sfx.lose();
            // reveal dealer
            setDealerHand(prev => prev.map(c => ({ ...c, faceUp: true })));
        }
    };

    const stand = () => {
        setPhase("dealer-turn");
        // Reveal dealer's hidden card
        const revealed = dealerHand.map(c => ({ ...c, faceUp: true }));
        setDealerHand(revealed);
        sfx.cardSlide();

        dealerPlay(revealed);
    };

    const dealerPlay = (currentHand: Card[]) => {
        let hand = [...currentHand];
        const drawNext = (h: Card[]) => {
            if (handTotal(h) < 17) {
                setTimeout(() => {
                    const card = drawCard(true);
                    const newHand = [...h, card];
                    setDealerHand(newHand);
                    sfx.cardSlide();
                    drawNext(newHand);
                }, 600);
            } else {
                setTimeout(() => resolveGame(h), 400);
            }
        };
        drawNext(hand);
    };

    const resolveGame = (finalDealerHand: Card[]) => {
        const pTotal = handTotal(playerHand);
        const dTotal = handTotal(finalDealerHand);

        if (dTotal > 21) {
            setResult("win");
            setMessage("Dealer Busts — You Win! 🎉");
            setBalance(prev => prev + bet * 2);
            sfx.win();
        } else if (pTotal > dTotal) {
            setResult("win");
            setMessage("You Win! 🎉");
            setBalance(prev => prev + bet * 2);
            sfx.win();
        } else if (pTotal < dTotal) {
            setResult("lose");
            setMessage("Dealer Wins 😔");
            sfx.lose();
        } else {
            setResult("push");
            setMessage("Push — It's a Tie");
            setBalance(prev => prev + bet);
        }
        setPhase("result");
    };

    const doubleDown = () => {
        if (bet > balance) return;
        setBalance(prev => prev - bet);
        setBet(prev => prev * 2);
        const card = drawCard(true);
        const newHand = [...playerHand, card];
        setPlayerHand(newHand);
        sfx.cardSlide();

        if (handTotal(newHand) > 21) {
            setResult("bust");
            setMessage("Bust! 💥");
            setPhase("result");
            sfx.lose();
            setDealerHand(prev => prev.map(c => ({ ...c, faceUp: true })));
        } else {
            setTimeout(() => stand(), 300);
        }
    };

    const playerTotal = handTotal(playerHand);
    const dealerTotal = handTotal(dealerHand.filter(c => c.faceUp));

    return (
        <div className="w-full h-full flex flex-col select-none overflow-hidden relative" style={{ perspective: "1200px" }}>
            {/* Sound toggle */}
            <button
                onClick={() => setSoundOn(!soundOn)}
                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
            >
                {soundOn ? <Volume2 size={14} className="text-white/70" /> : <VolumeX size={14} className="text-white/40" />}
            </button>

            {/* ── 3D Casino Table ───────────────────────────────── */}
            <div
                className="flex-1 flex flex-col items-center justify-between py-6 px-4 rounded-[1.5rem] mx-2 mt-2 mb-2 relative overflow-hidden"
                style={{
                    background: "radial-gradient(ellipse at 50% 30%, #1B6B3A 0%, #145A30 40%, #0D3D20 100%)",
                    transformStyle: "preserve-3d",
                    boxShadow: "inset 0 0 80px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.4)",
                }}
            >
                {/* Felt texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E\")",
                }} />

                {/* Table edge border */}
                <div className="absolute inset-0 rounded-[1.5rem] border-[3px] border-yellow-700/30 pointer-events-none z-0" />

                {/* ── Dealer Area ─────────────────────────────── */}
                <div className="flex flex-col items-center gap-3 z-10">
                    <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/30">Dealer</div>
                    <div className="flex gap-2 items-end min-h-[90px]">
                        <AnimatePresence>
                            {dealerHand.map((card, i) => (
                                <PlayingCard key={`d-${i}-${card.rank}${card.suit}`} card={card} index={i} />
                            ))}
                        </AnimatePresence>
                    </div>
                    {dealerHand.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[13px] font-bold text-white/50"
                        >
                            {dealerHand.some(c => !c.faceUp) ? `${dealerTotal} + ?` : dealerTotal}
                        </motion.div>
                    )}
                </div>

                {/* ── Center: Pot & Message ────────────────────── */}
                <div className="flex flex-col items-center gap-2 z-10">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={`text-[18px] sm:text-[22px] font-black tracking-tight px-6 py-2 rounded-full backdrop-blur-md ${result === "win" || result === "blackjack"
                                        ? "text-emerald-300 bg-emerald-900/40 border border-emerald-500/20"
                                        : result === "lose" || result === "bust"
                                            ? "text-red-300 bg-red-900/40 border border-red-500/20"
                                            : "text-yellow-300 bg-yellow-900/40 border border-yellow-500/20"
                                    }`}
                            >
                                {message}
                            </motion.div>
                        ) : bet > 0 ? (
                            <motion.div
                                key="pot"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <div className="flex -space-x-1">
                                    {[...Array(Math.min(Math.ceil(bet / 25), 5))].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-6 h-6 rounded-full border-2 border-yellow-400/80 bg-gradient-to-br from-yellow-500 to-yellow-700 shadow-md"
                                            style={{ transform: `translateY(${-i * 2}px)` }}
                                        />
                                    ))}
                                </div>
                                <span className="text-[15px] font-black text-yellow-400/90 ml-2">${bet}</span>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                {/* ── Player Area ─────────────────────────────── */}
                <div className="flex flex-col items-center gap-3 z-10">
                    <div className="flex gap-2 items-end min-h-[90px]">
                        <AnimatePresence>
                            {playerHand.map((card, i) => (
                                <PlayingCard key={`p-${i}-${card.rank}${card.suit}`} card={card} index={i} />
                            ))}
                        </AnimatePresence>
                    </div>
                    {playerHand.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[13px] font-bold text-white/50"
                        >
                            {playerTotal}
                        </motion.div>
                    )}
                    <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/30">You</div>
                </div>
            </div>

            {/* ── Controls Panel (Bottom Bar) ─────────────────── */}
            <div className="shrink-0 px-4 py-3 flex items-center justify-between gap-3 bg-[#1A1A1C] border-t border-white/5">
                {/* Balance display */}
                <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Balance</span>
                    <span className="text-[18px] font-black text-white/90 tracking-tight">${balance}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <AnimatePresence mode="wait">
                        {phase === "betting" && (
                            <motion.div key="bet-controls" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                                {BET_OPTIONS.map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => placeBet(amount)}
                                        disabled={amount > balance}
                                        className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 border border-white/5"
                                    >
                                        ${amount}
                                    </button>
                                ))}
                                <button
                                    onClick={deal}
                                    disabled={bet === 0}
                                    className="px-5 py-1.5 rounded-full text-[12px] font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-emerald-900/30 ml-1"
                                >
                                    Deal
                                </button>
                            </motion.div>
                        )}

                        {phase === "playing" && (
                            <motion.div key="play-controls" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                                <ActionBtn onClick={hit} color="blue">Hit</ActionBtn>
                                <ActionBtn onClick={stand} color="amber">Stand</ActionBtn>
                                {playerHand.length === 2 && bet <= balance && (
                                    <ActionBtn onClick={doubleDown} color="purple">Double</ActionBtn>
                                )}
                            </motion.div>
                        )}

                        {phase === "dealer-turn" && (
                            <motion.div key="dealer-controls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                <span className="text-[13px] text-white/40 font-medium animate-pulse">Dealer is playing...</span>
                            </motion.div>
                        )}

                        {phase === "result" && (
                            <motion.div key="result-controls" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                                <button
                                    onClick={startNewRound}
                                    className="px-5 py-2 rounded-full text-[13px] font-bold bg-white text-black hover:bg-white/90 transition-all active:scale-95 shadow-lg flex items-center gap-2"
                                >
                                    <RotateCcw size={14} />
                                    New Round
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bet display or empty */}
                <div className="flex flex-col items-end min-w-[60px]">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Bet</span>
                    <span className="text-[18px] font-black text-yellow-400/90 tracking-tight">${bet}</span>
                </div>
            </div>
        </div>
    );
}

// ─── Playing Card Component ─────────────────────────────────────────────────
function PlayingCard({ card, index }: { card: Card; index: number }) {
    const isRed = card.suit === "♥" || card.suit === "♦";

    return (
        <motion.div
            initial={{ opacity: 0, y: -40, rotateY: 180, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotateY: card.faceUp ? 0 : 180, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.12 }}
            className="relative"
            style={{
                width: "60px",
                height: "85px",
                transformStyle: "preserve-3d",
                perspective: "600px",
            }}
        >
            {/* Front */}
            <div
                className="absolute inset-0 rounded-lg bg-white border border-black/10 flex flex-col justify-between p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                style={{ backfaceVisibility: "hidden" }}
            >
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[14px] font-black" style={{ color: suitColor(card.suit) }}>{card.rank}</span>
                    <span className="text-[12px]" style={{ color: suitColor(card.suit) }}>{card.suit}</span>
                </div>
                <div className="flex items-center justify-center flex-1">
                    <span className="text-[28px]" style={{ color: suitColor(card.suit) }}>{card.suit}</span>
                </div>
                <div className="flex flex-col items-end leading-none rotate-180">
                    <span className="text-[14px] font-black" style={{ color: suitColor(card.suit) }}>{card.rank}</span>
                    <span className="text-[12px]" style={{ color: suitColor(card.suit) }}>{card.suit}</span>
                </div>
            </div>

            {/* Back */}
            <div
                className="absolute inset-0 rounded-lg border border-black/10 shadow-[0_4px_15px_rgba(0,0,0,0.3)] overflow-hidden"
                style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: "linear-gradient(135deg, #1E3A8A, #1E40AF)",
                }}
            >
                <div className="absolute inset-[3px] rounded-md border-2 border-white/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="text-white/40 text-[14px] font-black">♠</span>
                    </div>
                </div>
                {/* Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)",
                }} />
            </div>
        </motion.div>
    );
}

// ─── Action Button ──────────────────────────────────────────────────────────
function ActionBtn({ onClick, children, color }: { onClick: () => void; children: React.ReactNode; color: "blue" | "amber" | "purple" }) {
    const styles = {
        blue: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/30",
        amber: "bg-amber-600 hover:bg-amber-500 shadow-amber-900/30",
        purple: "bg-purple-600 hover:bg-purple-500 shadow-purple-900/30",
    };
    return (
        <button
            onClick={onClick}
            className={`px-4 py-1.5 rounded-full text-[12px] font-bold text-white transition-all active:scale-95 shadow-lg ${styles[color]}`}
        >
            {children}
        </button>
    );
}
