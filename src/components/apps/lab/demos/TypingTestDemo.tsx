"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Settings2 } from "lucide-react";

// --- Word Banks (Natural Paragraphs/Sentences) ---
// Using full sentences or cohesive phrases for better typing rhythm,
// rather than completely random disconnected word strings.
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
type Duration = 15 | 30 | 60 | 120;

const generateText = (level: Level, lang: Language, targetWordCount: number = 30) => {
    const bank = lang === "id" ? SENTENCES_ID[level] : SENTENCES_EN[level];

    // We shuffle phrases and combine them until we hit the rough target length
    let combinedText = "";

    // Shuffle helper
    const shuffleArray = (array: string[]) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    let wordsGenerated = 0;
    while (wordsGenerated < targetWordCount * 1.5) { // generate slightly more
        const phrases = shuffleArray(bank);
        for (const phrase of phrases) {
            if (phrase) {
                combinedText += phrase + " ";
                wordsGenerated += phrase.split(" ").length;
            }
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

    // Test States
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Stats States
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [rawWpm, setRawWpm] = useState(0);
    const [showSettings, setShowSettings] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);

    const initTest = useCallback(() => {
        // Calculate rough target length to generate text longer than user can type
        // e.g. 150 WPM * 2 minutes = 300 words generated to be safe
        const baseWords = selectedDuration === 15 ? 40 : selectedDuration === 30 ? 80 : 160;

        setTargetText(generateText(selectedLevel, selectedLang, baseWords));
        setInput("");
        setTimeLeft(selectedDuration);
        setIsActive(false);
        setIsFinished(false);
        setWpm(0);
        setRawWpm(0);
        setAccuracy(100);
        setShowSettings(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedDuration, selectedLevel, selectedLang]);

    useEffect(() => {
        initTest();
    }, [initTest]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft <= 0 && isActive) {
            endTest();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const endTest = () => {
        setIsActive(false);
        setIsFinished(true);
        setShowSettings(false);
        calculateStats();
    };

    const calculateStats = () => {
        let correctChars = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] === targetText[i]) {
                correctChars++;
            }
        }

        // International Standard Formula
        const timeInMinutes = selectedDuration / 60;
        const calcRawWpm = Math.round((input.length / 5) / timeInMinutes);
        const calcNetWpm = Math.round((correctChars / 5) / timeInMinutes);
        const calcAccuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 0;

        setRawWpm(Math.max(0, calcRawWpm));
        setWpm(Math.max(0, calcNetWpm));
        setAccuracy(calcAccuracy);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isFinished) return;

        const val = e.target.value;
        if (!isActive && val.length > 0) {
            setIsActive(true);
            setShowSettings(false);
        }
        setInput(val);

        // Auto end test if user finishes the text
        if (val.length >= targetText.length) {
            endTest();
        }
    };

    const handleContainerClick = () => {
        if (inputRef.current && !isFinished) {
            inputRef.current.focus();
        }
    };

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-start py-8 px-4 sm:px-8 relative cursor-text select-none overflow-y-auto hide-scrollbar"
            onClick={handleContainerClick}
        >
            {/* Input field captures keystrokes without being visible */}
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-text z-0"
                disabled={isFinished}
                autoComplete="off"
                spellCheck="false"
            />

            <AnimatePresence mode="wait">
                {showSettings && !isFinished && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                        className="w-full max-w-4xl flex justify-center mb-8 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Settings Toolbar: Fixed wrapping and spacing */}
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
                    <motion.div
                        key="typing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className={`w-full max-w-4xl flex flex-col gap-6 z-10 transition-all duration-300 ${!showSettings ? "mt-4" : ""}`}
                    >
                        <div className="flex justify-between items-center px-2">
                            {/* Subtle minimal Timer */}
                            <div className="text-black/60 dark:text-white/60 font-semibold text-xl flex items-center gap-3">
                                <motion.span
                                    animate={{ opacity: isActive ? [1, 0.4, 1] : 1 }}
                                    transition={{ repeat: isActive ? Infinity : 0, duration: 1 }}
                                    className="w-2.5 h-2.5 rounded-full bg-[#007AFF]"
                                />
                                {timeLeft}
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); initTest(); }}
                                className="p-2 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center"
                                title="Reset Test"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>

                        {/* Typing Area with responsive typography */}
                        <div className="relative text-[18px] sm:text-[20px] md:text-[24px] leading-[1.6] sm:leading-[1.7] font-medium tracking-wide mt-2" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
                            {targetText.split("").map((char, index) => {
                                let colorClass = "text-black/20 dark:text-white/20"; // un-typed
                                if (index < input.length) {
                                    colorClass = input[index] === char
                                        ? (document.documentElement.classList.contains('dark') ? "text-white drop-shadow-[0_0_1px_rgba(255,255,255,0.4)]" : "text-black drop-shadow-[0_0_1px_rgba(0,0,0,0.4)]")
                                        : "text-red-500 bg-red-500/10 rounded-sm"; // typed wrong
                                }

                                return (
                                    <span key={index} className={`transition-colors duration-75 ${colorClass}`}>
                                        {char}
                                    </span>
                                );
                            })}

                            {/* Cursor */}
                            {isActive && input.length < targetText.length && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                                    className="absolute w-[2px] h-[1.2em] bg-[#007AFF] rounded-full shadow-[0_0_8px_rgba(0,122,255,0.6)]"
                                    style={{ display: 'none' }} // Hidden CSS cursor, relying on natural browser cursor behavior 
                                // if an absolute overlay cursor is tricky for word-wrap. 
                                />
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="flex flex-col items-center justify-center gap-10 w-full h-full z-10 py-10"
                    >
                        {/* Results Grid - Responsive layout for stats cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl">
                            <StatCard label="WPM" value={wpm} highlight tooltip="Net Words Per Minute" />
                            <StatCard label="Accuracy" value={`${accuracy}%`} />
                            <StatCard label="Raw WPM" value={rawWpm} tooltip="Gross Words Per Minute" />
                            <StatCard
                                label="Level"
                                value={selectedLevel === 'easy' ? 'Mudah' : selectedLevel === 'medium' ? 'Sedang' : 'Sulit'}
                                isText
                            />
                        </div>

                        <div className="flex gap-4 sm:gap-6">
                            <button
                                onClick={(e) => { e.stopPropagation(); initTest(); }}
                                className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 hover:scale-[1.03] transition-transform active:scale-95 shadow-md shadow-black/10 dark:shadow-white/10 min-w-[140px]"
                            >
                                <RotateCcw size={16} />
                                Coba Lagi
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowSettings(true); setIsFinished(false); }}
                                className="px-6 py-3.5 bg-transparent border border-black/10 dark:border-white/20 text-black/70 dark:text-white/80 rounded-full font-semibold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-95 min-w-[140px]"
                            >
                                <Settings2 size={16} />
                                Pengaturan
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
        <button
            onClick={onClick}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[12px] sm:rounded-xl text-[12px] sm:text-[13px] font-bold transition-all duration-200 select-none ${active
                ? "bg-white dark:bg-[#2C2C2E] text-black dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-100"
                : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 scale-95 hover:scale-100"
                }`}
        >
            {children}
        </button>
    );
}

function StatCard({ label, value, highlight, tooltip, isText }: { label: string, value: string | number, highlight?: boolean, tooltip?: string, isText?: boolean }) {
    return (
        <div
            className={`flex flex-col items-center justify-center p-5 sm:p-6 bg-white/40 dark:bg-[#1C1C1E]/40 rounded-3xl border border-black/[0.04] dark:border-white/[0.05] backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all group`}
            title={tooltip}
        >
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40 mb-2 sm:mb-3">{label}</span>
            <span className={`text-[28px] sm:text-[34px] xl:text-[40px] tracking-tight leading-none ${highlight ? 'text-[#007AFF] font-black' : isText ? 'text-black/80 dark:text-white/80 font-bold tracking-normal' : 'text-black/80 dark:text-white/80 font-black'}`}>
                {value}
            </span>
        </div>
    );
}
