"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Volume2, VolumeX, Trash2 } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
type GamePhase = "betting" | "bot-turn" | "playing" | "dealer-turn" | "result";
type HandResult = "win" | "lose" | "push" | "blackjack" | "bust" | null;

interface Card {
    suit: Suit;
    rank: Rank;
    faceUp: boolean;
    id: string; // unique id for React keys
}

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const BET_OPTIONS = [10, 25, 50, 100];
const BOT_BET = 25;
const BOT_NAME = "Bot Alex";

let cardIdCounter = 0;

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
            deck.push({ suit, rank, faceUp: false, id: `card-${++cardIdCounter}` });
        }
    }
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

function suitColor(suit: Suit): string {
    return suit === "♥" || suit === "♦" ? "#E53935" : "#1A1A1A";
}

function visibleTotal(hand: Card[]): number {
    return handTotal(hand.filter(c => c.faceUp));
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function BlackjackDemo() {
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [botHand, setBotHand] = useState<Card[]>([]);

    const [balance, setBalance] = useState(1000);
    const [bet, setBet] = useState(0);
    const [botBalance, setBotBalance] = useState(1000);

    const [phase, setPhase] = useState<GamePhase>("betting");
    const [playerResult, setPlayerResult] = useState<HandResult>(null);
    const [botResult, setBotResult] = useState<HandResult>(null);
    const [message, setMessage] = useState("");
    const [botMessage, setBotMessage] = useState("");
    const [soundOn, setSoundOn] = useState(true);

    const deckRef = useRef<Card[]>([]);

    useEffect(() => { sfx.enabled = soundOn; }, [soundOn]);
    useEffect(() => { deckRef.current = createDeck(); }, []);

    const drawCard = useCallback((faceUp: boolean = true): Card => {
        if (deckRef.current.length === 0) deckRef.current = createDeck();
        const card = deckRef.current.pop()!;
        card.faceUp = faceUp;
        return card;
    }, []);

    // ─── Betting ────────────────────────────────────────
    const placeBet = (amount: number) => {
        if (amount > balance - bet) return; // FIX: validate against remaining balance
        sfx.chipClick();
        setBet(prev => prev + amount);
    };

    const clearBet = () => {
        setBet(0);
    };

    // ─── Deal ───────────────────────────────────────────
    const deal = () => {
        if (bet === 0) return;

        // Draw cards for everyone
        const p1 = drawCard(true);
        const b1 = drawCard(true);
        const d1 = drawCard(true);
        const p2 = drawCard(true);
        const b2 = drawCard(true);
        const d2 = drawCard(false);

        const newPlayerHand = [p1, p2];
        const newBotHand = [b1, b2];
        const newDealerHand = [d1, d2];

        setPlayerHand(newPlayerHand);
        setBotHand(newBotHand);
        setDealerHand(newDealerHand);
        setBalance(prev => prev - bet);
        setBotBalance(prev => prev - BOT_BET);
        setPlayerResult(null);
        setBotResult(null);
        setMessage("");
        setBotMessage("");

        sfx.cardSlide();
        setTimeout(() => sfx.cardSlide(), 200);

        const pTotal = handTotal(newPlayerHand);
        const dTotal = handTotal([d1, { ...d2, faceUp: true }]);

        // Check dealer Blackjack first
        if (dTotal === 21) {
            d2.faceUp = true;
            setDealerHand([d1, { ...d2, faceUp: true }]);

            // Resolve player
            if (pTotal === 21) {
                setPlayerResult("push");
                setMessage("Push — Both Blackjack!");
                setBalance(prev => prev + bet);
            } else {
                setPlayerResult("lose");
                setMessage("Dealer Blackjack 😔");
                sfx.lose();
            }

            // Resolve bot
            const bTotal = handTotal(newBotHand);
            if (bTotal === 21) {
                setBotResult("push");
                setBotMessage("Push");
                setBotBalance(prev => prev + BOT_BET);
            } else {
                setBotResult("lose");
                setBotMessage("Lost");
            }

            setPhase("result");
            return;
        }

        // Check player natural Blackjack
        if (pTotal === 21) {
            setPlayerResult("blackjack");
            setMessage("Blackjack! 🎉");
            setBalance(prev => prev + Math.floor(bet * 2.5)); // FIX: correct 3:2 payout
            sfx.blackjack();
            // Don't return yet — bot still needs to play, but we mark player done
        }

        // Bot plays first, then player
        setPhase("bot-turn");
        botPlay(newBotHand, newDealerHand, newPlayerHand, pTotal === 21);
    };

    // ─── Bot AI ─────────────────────────────────────────
    const botPlay = (currentBotHand: Card[], currentDealerHand: Card[], currentPlayerHand: Card[], playerHasBJ: boolean) => {
        const bTotal = handTotal(currentBotHand);

        // Check bot Blackjack
        if (currentBotHand.length === 2 && bTotal === 21) {
            setBotResult("blackjack");
            setBotMessage("Blackjack!");
            setBotBalance(prev => prev + Math.floor(BOT_BET * 2.5));
            // Move to player turn or dealer turn
            setTimeout(() => {
                if (playerHasBJ) {
                    startDealerTurn(currentDealerHand, currentPlayerHand, currentBotHand);
                } else {
                    setPhase("playing");
                }
            }, 600);
            return;
        }

        if (bTotal < 17) {
            setTimeout(() => {
                const card = drawCard(true);
                const newHand = [...currentBotHand, card];
                setBotHand(newHand);
                sfx.cardSlide();

                if (handTotal(newHand) > 21) {
                    setBotResult("bust");
                    setBotMessage("Bust!");
                    setTimeout(() => {
                        if (playerHasBJ) {
                            startDealerTurn(currentDealerHand, currentPlayerHand, newHand);
                        } else {
                            setPhase("playing");
                        }
                    }, 500);
                } else {
                    botPlay(newHand, currentDealerHand, currentPlayerHand, playerHasBJ);
                }
            }, 600);
        } else {
            setBotMessage(`Stand (${bTotal})`);
            setTimeout(() => {
                if (playerHasBJ) {
                    startDealerTurn(currentDealerHand, currentPlayerHand, currentBotHand);
                } else {
                    setPhase("playing");
                }
            }, 500);
        }
    };

    // ─── Player Actions ─────────────────────────────────
    const hit = () => {
        const card = drawCard(true);
        const newHand = [...playerHand, card];
        setPlayerHand(newHand);
        sfx.cardSlide();

        if (handTotal(newHand) > 21) {
            setPlayerResult("bust");
            setMessage("Bust! 💥");
            sfx.lose();
            // Reveal dealer, then resolve bot
            const revealedDealer = dealerHand.map(c => ({ ...c, faceUp: true }));
            setDealerHand(revealedDealer);
            resolveBotAgainstDealer(revealedDealer, botHand);
            setPhase("result");
        }
    };

    const stand = () => {
        startDealerTurn(dealerHand, playerHand, botHand);
    };

    const doubleDown = () => {
        const currentBet = bet;
        if (currentBet > balance) return;

        setBalance(prev => prev - currentBet);
        setBet(currentBet * 2);

        const card = drawCard(true);
        const newHand = [...playerHand, card];
        setPlayerHand(newHand);
        sfx.cardSlide();

        if (handTotal(newHand) > 21) {
            setPlayerResult("bust");
            setMessage("Bust! 💥");
            sfx.lose();
            const revealedDealer = dealerHand.map(c => ({ ...c, faceUp: true }));
            setDealerHand(revealedDealer);
            resolveBotAgainstDealer(revealedDealer, botHand);
            setPhase("result");
        } else {
            // Auto-stand after double
            setTimeout(() => startDealerTurn(dealerHand, newHand, botHand), 300);
        }
    };

    // ─── Dealer Turn ────────────────────────────────────
    const startDealerTurn = (currentDealerHand: Card[], finalPlayerHand: Card[], finalBotHand: Card[]) => {
        setPhase("dealer-turn");
        const revealed = currentDealerHand.map(c => ({ ...c, faceUp: true }));
        setDealerHand(revealed);
        sfx.cardSlide();
        dealerDraw(revealed, finalPlayerHand, finalBotHand);
    };

    const dealerDraw = (currentHand: Card[], finalPlayerHand: Card[], finalBotHand: Card[]) => {
        if (handTotal(currentHand) < 17) {
            setTimeout(() => {
                const card = drawCard(true);
                const newHand = [...currentHand, card];
                setDealerHand(newHand);
                sfx.cardSlide();
                dealerDraw(newHand, finalPlayerHand, finalBotHand);
            }, 600);
        } else {
            setTimeout(() => resolveAll(currentHand, finalPlayerHand, finalBotHand), 400);
        }
    };

    // ─── Resolve ────────────────────────────────────────
    const resolveAll = (finalDealerHand: Card[], finalPlayerHand: Card[], finalBotHand: Card[]) => {
        const dTotal = handTotal(finalDealerHand);

        // Resolve player (only if not already resolved — e.g. bust or blackjack)
        if (!playerResult) {
            const pTotal = handTotal(finalPlayerHand);
            if (dTotal > 21) {
                setPlayerResult("win");
                setMessage("Dealer Busts — You Win! 🎉");
                setBalance(prev => prev + bet * 2);
                sfx.win();
            } else if (pTotal > dTotal) {
                setPlayerResult("win");
                setMessage("You Win! 🎉");
                setBalance(prev => prev + bet * 2);
                sfx.win();
            } else if (pTotal < dTotal) {
                setPlayerResult("lose");
                setMessage("Dealer Wins 😔");
                sfx.lose();
            } else {
                setPlayerResult("push");
                setMessage("Push — It's a Tie");
                setBalance(prev => prev + bet);
            }
        }

        // Resolve bot
        resolveBotAgainstDealer(finalDealerHand, finalBotHand);
        setPhase("result");
    };

    const resolveBotAgainstDealer = (finalDealerHand: Card[], finalBotHand: Card[]) => {
        if (botResult) return; // already resolved (bust or blackjack)

        const dTotal = handTotal(finalDealerHand);
        const bTotal = handTotal(finalBotHand);

        if (bTotal > 21) {
            // Already handled
        } else if (dTotal > 21) {
            setBotResult("win");
            setBotMessage("Won!");
            setBotBalance(prev => prev + BOT_BET * 2);
        } else if (bTotal > dTotal) {
            setBotResult("win");
            setBotMessage("Won!");
            setBotBalance(prev => prev + BOT_BET * 2);
        } else if (bTotal < dTotal) {
            setBotResult("lose");
            setBotMessage("Lost");
        } else {
            setBotResult("push");
            setBotMessage("Push");
            setBotBalance(prev => prev + BOT_BET);
        }
    };

    // ─── New Round ──────────────────────────────────────
    const startNewRound = useCallback(() => {
        if (deckRef.current.length < 20) deckRef.current = createDeck();
        setPlayerHand([]);
        setDealerHand([]);
        setBotHand([]);
        setBet(0);
        setPhase("betting");
        setPlayerResult(null);
        setBotResult(null);
        setMessage("");
        setBotMessage("");
    }, []);

    const resetGame = () => {
        deckRef.current = createDeck();
        setBalance(1000);
        setBotBalance(1000);
        startNewRound();
    };

    const isGameOver = balance <= 0 && phase === "betting";

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
                className="flex-1 flex flex-col items-center justify-between py-5 px-4 rounded-[1.5rem] mx-2 mt-2 mb-2 relative overflow-hidden"
                style={{
                    background: "radial-gradient(ellipse at 50% 30%, #1B6B3A 0%, #145A30 40%, #0D3D20 100%)",
                    transformStyle: "preserve-3d",
                    boxShadow: "inset 0 0 80px rgba(0,0,0,0.3), 0 20px 60px rgba(0,0,0,0.4)",
                }}
            >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E\")",
                }} />
                <div className="absolute inset-0 rounded-[1.5rem] border-[3px] border-yellow-700/30 pointer-events-none z-0" />

                {/* ── Dealer ────────────────────────────────────── */}
                <div className="flex flex-col items-center gap-2 z-10">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">Dealer</div>
                    <div className="flex gap-2 items-end min-h-[80px]">
                        <AnimatePresence>
                            {dealerHand.map((card, i) => (
                                <PlayingCard key={card.id} card={card} index={i} />
                            ))}
                        </AnimatePresence>
                    </div>
                    {dealerHand.length > 0 && (
                        <div className="text-[12px] font-bold text-white/40">
                            {dealerHand.some(c => !c.faceUp) ? `${visibleTotal(dealerHand)} + ?` : handTotal(dealerHand)}
                        </div>
                    )}
                </div>

                {/* ── Center Message ────────────────────────────── */}
                <div className="flex flex-col items-center gap-2 z-10">
                    <AnimatePresence mode="wait">
                        {playerResult ? (
                            <motion.div
                                key="result-msg"
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={`text-[16px] sm:text-[20px] font-black tracking-tight px-5 py-2 rounded-full backdrop-blur-md ${playerResult === "win" || playerResult === "blackjack"
                                    ? "text-emerald-300 bg-emerald-900/40 border border-emerald-500/20"
                                    : playerResult === "lose" || playerResult === "bust"
                                        ? "text-red-300 bg-red-900/40 border border-red-500/20"
                                        : "text-yellow-300 bg-yellow-900/40 border border-yellow-500/20"
                                    }`}
                            >
                                {message}
                            </motion.div>
                        ) : bet > 0 ? (
                            <motion.div key="pot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                    {[...Array(Math.min(Math.ceil(bet / 25), 5))].map((_, i) => (
                                        <div key={i} className="w-5 h-5 rounded-full border-2 border-yellow-400/80 bg-gradient-to-br from-yellow-500 to-yellow-700 shadow-md" style={{ transform: `translateY(${-i * 2}px)` }} />
                                    ))}
                                </div>
                                <span className="text-[14px] font-black text-yellow-400/90 ml-1">${bet}</span>
                            </motion.div>
                        ) : isGameOver ? (
                            <motion.div key="gameover" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
                                <div className="text-[18px] font-black text-red-400">Game Over</div>
                                <button onClick={resetGame} className="px-5 py-2 rounded-full text-[12px] font-bold bg-white text-black hover:bg-white/90 transition-all active:scale-95 shadow-lg flex items-center gap-2">
                                    <RotateCcw size={14} /> Reset ($1000)
                                </button>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                {/* ── Players Area (Bot + You) ─────────────────── */}
                <div className="flex gap-6 sm:gap-10 items-end z-10 w-full justify-center">
                    {/* Bot */}
                    <div className="flex flex-col items-center gap-2 opacity-80">
                        <div className="flex gap-1.5 items-end min-h-[70px]">
                            <AnimatePresence>
                                {botHand.map((card, i) => (
                                    <PlayingCard key={card.id} card={card} index={i} small />
                                ))}
                            </AnimatePresence>
                        </div>
                        {botHand.length > 0 && (
                            <div className="text-[11px] font-bold text-white/40">{handTotal(botHand)}</div>
                        )}
                        <div className="flex flex-col items-center">
                            <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/25">{BOT_NAME}</div>
                            <div className="text-[10px] font-bold text-white/30">${botBalance}</div>
                            {botMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-[9px] font-bold mt-0.5 ${botResult === "win" || botResult === "blackjack" ? "text-emerald-400" :
                                        botResult === "lose" || botResult === "bust" ? "text-red-400" : "text-yellow-400"
                                        }`}
                                >
                                    {botMessage}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] h-16 bg-white/10 rounded-full" />

                    {/* Player */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2 items-end min-h-[80px]">
                            <AnimatePresence>
                                {playerHand.map((card, i) => (
                                    <PlayingCard key={card.id} card={card} index={i} />
                                ))}
                            </AnimatePresence>
                        </div>
                        {playerHand.length > 0 && (
                            <div className="text-[12px] font-bold text-white/50">{handTotal(playerHand)}</div>
                        )}
                        <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/30">You</div>
                    </div>
                </div>
            </div>

            {/* ── Controls Panel ──────────────────────────────── */}
            <div className="shrink-0 px-4 py-3 flex items-center justify-between gap-3 bg-[#1A1A1C] border-t border-white/5">
                <div className="flex flex-col items-start min-w-[65px]">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Balance</span>
                    <span className="text-[16px] font-black text-white/90 tracking-tight">${balance}</span>
                </div>

                <div className="flex items-center gap-2">
                    <AnimatePresence mode="wait">
                        {phase === "betting" && !isGameOver && (
                            <motion.div key="bet-ctl" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-1.5">
                                {BET_OPTIONS.map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => placeBet(amount)}
                                        disabled={amount > balance - bet}
                                        className="px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 border border-white/5"
                                    >
                                        ${amount}
                                    </button>
                                ))}
                                {bet > 0 && (
                                    <button onClick={clearBet} className="p-1.5 rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-all" title="Clear Bet">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={deal}
                                    disabled={bet === 0}
                                    className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-emerald-900/30 ml-1"
                                >
                                    Deal
                                </button>
                            </motion.div>
                        )}

                        {phase === "bot-turn" && (
                            <motion.div key="bot-ctl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                <span className="text-[12px] text-white/40 font-medium animate-pulse">{BOT_NAME} is playing...</span>
                            </motion.div>
                        )}

                        {phase === "playing" && (
                            <motion.div key="play-ctl" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                                <ActionBtn onClick={hit} color="blue">Hit</ActionBtn>
                                <ActionBtn onClick={stand} color="amber">Stand</ActionBtn>
                                {playerHand.length === 2 && bet <= balance && (
                                    <ActionBtn onClick={doubleDown} color="purple">Double</ActionBtn>
                                )}
                            </motion.div>
                        )}

                        {phase === "dealer-turn" && (
                            <motion.div key="dealer-ctl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                <span className="text-[12px] text-white/40 font-medium animate-pulse">Dealer is playing...</span>
                            </motion.div>
                        )}

                        {phase === "result" && (
                            <motion.div key="result-ctl" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                                <button onClick={startNewRound} className="px-5 py-2 rounded-full text-[12px] font-bold bg-white text-black hover:bg-white/90 transition-all active:scale-95 shadow-lg flex items-center gap-2">
                                    <RotateCcw size={14} /> New Round
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col items-end min-w-[50px]">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Bet</span>
                    <span className="text-[16px] font-black text-yellow-400/90 tracking-tight">${bet}</span>
                </div>
            </div>
        </div>
    );
}

// ─── Playing Card ───────────────────────────────────────────────────────────
function PlayingCard({ card, index, small }: { card: Card; index: number; small?: boolean }) {
    const w = small ? 48 : 60;
    const h = small ? 68 : 85;

    return (
        <motion.div
            initial={{ opacity: 0, y: -30, rotateY: 180, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotateY: card.faceUp ? 0 : 180, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.1 }}
            className="relative"
            style={{ width: w, height: h, transformStyle: "preserve-3d", perspective: "600px" }}
        >
            {/* Front */}
            <div
                className="absolute inset-0 rounded-lg bg-white border border-black/10 flex flex-col justify-between shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                style={{ backfaceVisibility: "hidden", padding: small ? 3 : 6 }}
            >
                {/* Top Left */}
                <div className="absolute top-[3px] left-[3px] flex flex-col items-center leading-none" style={{ padding: small ? "2px" : "4px" }}>
                    <span className="font-black" style={{ color: suitColor(card.suit), fontSize: small ? 11 : 14 }}>{card.rank}</span>
                    <span style={{ color: suitColor(card.suit), fontSize: small ? 9 : 12, marginTop: "-1px" }}>{card.suit}</span>
                </div>

                {/* Center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span style={{ color: suitColor(card.suit), fontSize: small ? 22 : 32 }}>{card.suit}</span>
                </div>

                {/* Bottom Right */}
                <div className="absolute bottom-[3px] right-[3px] flex flex-col items-center leading-none transform rotate-180" style={{ padding: small ? "2px" : "4px" }}>
                    <span className="font-black" style={{ color: suitColor(card.suit), fontSize: small ? 11 : 14 }}>{card.rank}</span>
                    <span style={{ color: suitColor(card.suit), fontSize: small ? 9 : 12, marginTop: "-1px" }}>{card.suit}</span>
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
                    <div className="rounded-full bg-white/10 border border-white/20 flex items-center justify-center" style={{ width: small ? 20 : 32, height: small ? 20 : 32 }}>
                        <span className="text-white/40 font-black" style={{ fontSize: small ? 10 : 14 }}>♠</span>
                    </div>
                </div>
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)",
                }} />
            </div>
        </motion.div >
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
        <button onClick={onClick} className={`px-4 py-1.5 rounded-full text-[11px] font-bold text-white transition-all active:scale-95 shadow-lg ${styles[color]}`}>
            {children}
        </button>
    );
}
