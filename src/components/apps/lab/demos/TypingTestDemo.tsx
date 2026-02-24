/* eslint-disable react-hooks/exhaustive-deps, react-hooks/purity */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Settings2, Volume2, VolumeX } from "lucide-react";

// --- Sound Effects (Web Audio API) ---
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

    keyPress() { this.playTone(440, 0.05, "sine", 0.08); }
    keyError() { this.playTone(150, 0.1, "sawtooth", 0.1); }
    complete() { [523, 659, 784].forEach((f, i) => setTimeout(() => this.playTone(f, 0.3, "sine", 0.12), i * 150)); }
}

const sfx = new SoundEngine();

// --- Word Banks ---
const SENTENCES_ID = {
    easy: [
        "buku di atas meja ada warna merah.", "kucing hitam itu tidur di kursi.", "hujan turun rintik dari awan.", "pisang manis ini buah kesukaan saya.", "langit cerah membawa angin pagi.", "sepeda biru itu melaju dengan pelan."
    ],
    medium: [
        "hari ini adalah milik kita bersama selamanya, sebuah cerita yang belum selesai.", "matahari bersinar menembus putihnya awan memberi harapan di dunia ini.", "perjalanan panjang dimulai dari langkah kecil yang berani menghadapi dunia.", "angin malam berhembus pelan menyapa daun yang berguguran di halaman rumah."
    ],
    hard: [
        "Kehidupan memang penuh dengan misteri! Sesuatu yang belum terungkap sepenuhnya.", "Jangan pernah menyerah, walau rintangan menghadang di depan! Teruslah melangkah...", "Apakah teknologi akan menggantikan peran manusia 100%? Atau sekadar alat bantu?", "Tahun 2024 mencatat banyak sejarah: AI, ekonomi, serta pemanasan global."
    ]
};

const SENTENCES_EN = {
    easy: [
        "the red book is on the table.", "the black cat sleeps on the chair.", "rain falls gently from the dark cloud.", "sweet banana is my favorite fruit.", "clear sky brings cold morning wind.", "blue bicycle moves slowly on the road."
    ],
    medium: [
        "today belongs to us together forever, an unfinished story waiting to be told.", "sun shines brightly through white clouds giving hope to this beautiful world.", "a long journey starts with a small brave step facing the vast open world.", "night wind blows softly greeting the falling leaves in the silent backyard."
    ],
    hard: [
        "Life is indeed full of mysteries! Something that is not yet fully revealed.", "Never give up, even if obstacles stand in front! Keep stepping forward...", "Will technology replace our roles 100%? Or is it just a powerful assistant?", "Year 2024 marks a lot of history: AI, global economy, and warming trends."
    ]
};

type Level = "easy" | "medium" | "hard";
type Language = "id" | "en";
type Duration = 15 | 30 | 60;

const generateText = (level: Level, lang: Language, targetWordCount: number = 30) => {
    const bank = lang === "id" ? SENTENCES_ID[level] : SENTENCES_EN[level];
    let combinedText = "";

    // Better shuffle
    const shuffleArray = (array: string[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
        }
        return shuffled;
    };

    let wordsGenerated = 0;
    while (wordsGenerated < targetWordCount * 1.5) {
        const phrases = shuffleArray(bank);
        for (const phrase of phrases) {
            combinedText += phrase + " ";
            wordsGenerated += phrase.split(" ").length;
            if (wordsGenerated >= targetWordCount * 1.5) break;
        }
    }
    return combinedText.trim();
};

export function TypingTestDemo() {
    const [targetText, setTargetText] = useState("");
    const [input, setInput] = useState("");

    // Config States
    const [selectedDuration, setSelectedDuration] = useState<Duration>(30);
    const [selectedLevel, setSelectedLevel] = useState<Level>("medium");
    const [selectedLang, setSelectedLang] = useState<Language>("en");
    const [soundOn, setSoundOn] = useState(true);

    // Test States
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Live Stats
    const [liveWpm, setLiveWpm] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [rawWpm, setRawWpm] = useState(0);
    const [showSettings, setShowSettings] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);

    const initTest = useCallback(() => {
        const baseWords = selectedDuration === 15 ? 40 : selectedDuration === 30 ? 80 : 160;
        setTargetText(generateText(selectedLevel, selectedLang, baseWords));
        setInput("");
        setTimeLeft(selectedDuration);
        setIsActive(false);
        setIsFinished(false);
        setStartTime(null);
        setWpm(0);
        setLiveWpm(0);
        setRawWpm(0);
        setAccuracy(100);
        setShowSettings(true);
        sfx.enabled = soundOn;
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [selectedDuration, selectedLevel, selectedLang, soundOn]);

    useEffect(() => { initTest(); }, [initTest]);

    // Timer and Live WPM updates
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                const now = Date.now();
                const start = startTime || now;
                const elapsedSeconds = (now - start) / 1000;

                setTimeLeft(Math.max(0, selectedDuration - Math.floor(elapsedSeconds)));

                // Live WPM calculation
                if (elapsedSeconds > 1) {
                    const timeInMins = elapsedSeconds / 60;
                    setLiveWpm(Math.round((input.length / 5) / timeInMins));
                }
            }, 100);
        } else if (timeLeft <= 0 && isActive) {
            endTest(input); // Pass current input to avoid closure issues
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, startTime, input, selectedDuration]);

    function endTest(finalInput: string) {
        setIsActive(false);
        setIsFinished(true);
        setShowSettings(false);
        sfx.complete();
        calculateFinalStats(finalInput);
    }

    function calculateFinalStats(finalInput: string) {
        let correctChars = 0;
        for (let i = 0; i < finalInput.length; i++) {
            if (finalInput[i] === targetText[i]) correctChars++;
        }

        const elapsed = startTime ? (Date.now() - startTime) / 1000 : selectedDuration;
        const timeInMinutes = Math.max(elapsed, 1) / 60;

        const calcRawWpm = Math.round((finalInput.length / 5) / timeInMinutes);
        const calcNetWpm = Math.round((correctChars / 5) / timeInMinutes);
        const calcAccuracy = finalInput.length > 0 ? Math.round((correctChars / finalInput.length) * 100) : 0;

        setRawWpm(Math.max(0, calcRawWpm));
        setWpm(Math.max(0, calcNetWpm));
        setAccuracy(calcAccuracy);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isFinished) return;
        const val = e.target.value;
        const charCount = val.length;

        // Prevent typing more than target text
        if (charCount > targetText.length) return;

        // Sound logic
        if (charCount > input.length) {
            const lastChar = val[charCount - 1];
            const targetChar = targetText[charCount - 1];
            if (lastChar === targetChar) sfx.keyPress();
            else sfx.keyError();
        }

        if (!isActive && charCount > 0) {
            setIsActive(true);
            setStartTime(Date.now());
            setShowSettings(false);
        }

        setInput(val);
        if (charCount === targetText.length) endTest(val);
    };

    const handleContainerClick = () => {
        if (!isFinished) inputRef.current?.focus();
    };

    // Calculate progress for the bar
    const progress = (timeLeft / selectedDuration) * 100;

    return (
        <div className="w-full h-full flex flex-col items-center justify-start py-8 px-4 sm:px-8 relative cursor-text select-none overflow-y-auto hide-scrollbar" onClick={handleContainerClick}>
            <input ref={inputRef} type="text" value={input} onChange={handleInputChange} className="opacity-0 absolute inset-0 w-0 h-0 pointer-events-none" disabled={isFinished} autoComplete="off" spellCheck="false" />

            {/* Sound Toggle */}
            <button onClick={(e) => { e.stopPropagation(); setSoundOn(!soundOn); }} className="absolute top-4 right-4 p-2 text-black/30 dark:text-white/30 hover:text-blue-500 transition-colors z-20">
                {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <AnimatePresence mode="wait">
                {showSettings && !isFinished && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }} className="w-full max-w-4xl flex justify-center mb-8 z-10" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-black/5 dark:bg-white/5 rounded-2xl p-1.5 border border-black/5 dark:border-white/5 backdrop-blur-md">
                            <ToolbarButton active={selectedLang === "id"} onClick={() => setSelectedLang("id")}>ID</ToolbarButton>
                            <ToolbarButton active={selectedLang === "en"} onClick={() => setSelectedLang("en")}>EN</ToolbarButton>
                            <div className="w-[1px] h-5 bg-black/10 dark:bg-white/10 mx-1 sm:mx-2 rounded-full" />
                            <ToolbarButton active={selectedLevel === "easy"} onClick={() => setSelectedLevel("easy")}>Mudah</ToolbarButton>
                            <ToolbarButton active={selectedLevel === "medium"} onClick={() => setSelectedLevel("medium")}>Sedang</ToolbarButton>
                            <ToolbarButton active={selectedLevel === "hard"} onClick={() => setSelectedLevel("hard")}>Sulit</ToolbarButton>
                            <div className="w-[1px] h-5 bg-black/10 dark:bg-white/10 mx-1 sm:mx-2 rounded-full" />
                            <ToolbarButton active={selectedDuration === 15} onClick={() => setSelectedDuration(15)}>15s</ToolbarButton>
                            <ToolbarButton active={selectedDuration === 30} onClick={() => setSelectedDuration(30)}>30s</ToolbarButton>
                            <ToolbarButton active={selectedDuration === 60} onClick={() => setSelectedDuration(60)}>60s</ToolbarButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`w-full max-w-4xl flex flex-col gap-4 z-10 transition-all duration-300 ${!showSettings ? "mt-4" : ""}`}>
                        {/* Stats Bar */}
                        <div className="flex flex-col gap-2 px-2">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-black/30 dark:text-white/30">Time</span>
                                        <div className="text-blue-500 font-black text-2xl leading-none">{timeLeft}s</div>
                                    </div>
                                    {isActive && (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-black/30 dark:text-white/30">Live WPM</span>
                                            <div className="text-black/60 dark:text-white/60 font-black text-2xl leading-none">{liveWpm}</div>
                                        </motion.div>
                                    )}
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); initTest(); }} className="p-2 text-black/20 hover:text-black/60 dark:text-white/20 dark:hover:text-white/60 transition-colors">
                                    <RotateCcw size={18} />
                                </button>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-1 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-blue-500" initial={{ width: "100%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
                            </div>
                        </div>

                        {/* Typing Area */}
                        <div className="relative text-[18px] sm:text-[20px] md:text-[24px] leading-[1.6] sm:leading-[1.7] font-medium tracking-wide mt-2" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
                            {!isActive && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-black/10 dark:text-white/10 italic text-[14px]">
                                    Click here and start typing to begin...
                                </div>
                            )}
                            {targetText.split("").map((char, index) => {
                                const isCurrent = index === input.length && isActive;
                                const isTyped = index < input.length;
                                const isCorrect = isTyped && input[index] === char;

                                return (
                                    <span key={index} className={`relative transition-colors duration-75 ${isTyped ? (isCorrect ? "text-black dark:text-white" : "text-red-500 bg-red-500/10 rounded-sm") : "text-black/20 dark:text-white/20"
                                        }`}>
                                        {isCurrent && (
                                            <motion.span layoutId="cursor" className="absolute left-0 top-[10%] w-[2px] h-[80%] bg-blue-500" animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                                        )}
                                        {char}
                                    </span>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="flex flex-col items-center justify-center gap-10 w-full h-full z-10 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl">
                            <StatCard label="WPM" value={wpm} highlight tooltip="Net Words Per Minute" />
                            <StatCard label="Accuracy" value={`${accuracy}%`} />
                            <StatCard label="Raw WPM" value={rawWpm} tooltip="Gross Words Per Minute" />
                            <StatCard label="Level" value={selectedLevel === 'easy' ? 'Mudah' : selectedLevel === 'medium' ? 'Sedang' : 'Sulit'} isText />
                        </div>
                        <div className="flex gap-4 sm:gap-6">
                            <button onClick={(e) => { e.stopPropagation(); initTest(); }} className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 hover:scale-[1.03] transition-transform active:scale-95 shadow-md min-w-[140px]">
                                <RotateCcw size={16} /> Coba Lagi
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); initTest(); setShowSettings(true); }} className="px-6 py-3.5 bg-transparent border border-black/10 dark:border-white/20 text-black/70 dark:text-white/80 rounded-full font-semibold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-95 min-w-[140px]">
                                <Settings2 size={16} /> Pengaturan
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ToolbarButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
    return (
        <button onClick={onClick} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[12px] sm:rounded-xl text-[12px] sm:text-[13px] font-bold transition-all duration-200 select-none ${active ? "bg-white dark:bg-[#2C2C2E] text-black dark:text-white shadow-sm" : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}`}>
            {children}
        </button>
    );
}

function StatCard({ label, value, highlight, tooltip, isText }: { label: string, value: string | number, highlight?: boolean, tooltip?: string, isText?: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center p-5 sm:p-6 bg-white/40 dark:bg-[#1C1C1E]/40 rounded-3xl border border-black/[0.04] dark:border-white/[0.05] backdrop-blur-xl shadow-sm hover:shadow-md transition-all" title={tooltip}>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40 mb-2 sm:mb-3">{label}</span>
            <span className={`text-[28px] sm:text-[34px] xl:text-[40px] tracking-tight leading-none ${highlight ? 'text-blue-500 font-black' : isText ? 'text-black/80 dark:text-white/80 font-bold' : 'text-black/80 dark:text-white/80 font-black'}`}>
                {value}
            </span>
        </div>
    );
}
