"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";

const WORDS = [
    "waktu", "harapan", "cerita", "dunia", "langit", "bintang", "malam", "cinta",
    "sebuah", "perjalanan", "kembali", "untuk", "melihat", "sesuatu", "dengan", "jelas",
    "seperti", "senyum", "yang", "indah", "ketika", "pagi", "datang", "menyapamu",
    "karena", "hari", "ini", "adalah", "milik", "kita", "bersama", "selamanya", "lalu",
    "matahari", "bersinar", "terang", "menembus", "awan", "putih", "di", "angkasa",
    "membawa", "kedamaian", "bagi", "semua", "orang", "yang", "sedang", "berjuang",
    "jangan", "pernah", "menyerah", "walau", "rintangan", "menghadang", "di", "depan",
    "teruslah", "melangkah", "dengan", "pasti", "menuju", "impian", "yang", "dicita",
    "kehidupan", "memang", "penuh", "dengan", "misteri", "yang", "belum", "terungkap",
    "maka", "nikmatilah", "setiap", "detik", "yang", "tersisa", "dengan", "penuh", "syukur"
];

const generateText = (wordCount: number = 30) => {
    let text = [];
    for (let i = 0; i < wordCount; i++) {
        text.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    return text.join(" ");
};

export function TypingTestDemo() {
    const [targetText, setTargetText] = useState("");
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    const inputRef = useRef<HTMLInputElement>(null);

    const initTest = useCallback(() => {
        setTargetText(generateText(40));
        setInput("");
        setTimeLeft(30);
        setIsActive(false);
        setIsFinished(false);
        setWpm(0);
        setAccuracy(100);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        initTest();
    }, [initTest]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            endTest();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const endTest = () => {
        setIsActive(false);
        setIsFinished(true);
        calculateStats();
    };

    const calculateStats = () => {
        let correctChars = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] === targetText[i]) {
                correctChars++;
            }
        }

        const calculatedWpm = Math.round((correctChars / 5) / (30 / 60));
        const calcAccuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 0;

        setWpm(calculatedWpm);
        setAccuracy(calcAccuracy);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isFinished) return;

        const val = e.target.value;
        if (!isActive && val.length > 0) {
            setIsActive(true);
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
            className="w-full h-full flex flex-col items-center justify-center p-6 relative cursor-text select-none"
            onClick={handleContainerClick}
        >
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-text"
                disabled={isFinished}
                autoComplete="off"
                spellCheck="false"
            />

            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div
                        key="typing"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl flex flex-col gap-6"
                    >
                        <div className="flex justify-between items-center px-4">
                            <div className="text-[#007AFF] font-bold text-xl drop-shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />
                                {timeLeft}s
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); initTest(); }}
                                className="p-2 text-black/40 hover:text-black/70 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>

                        <div className="relative text-[22px] leading-relaxed font-medium tracking-wide" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
                            {targetText.split("").map((char, index) => {
                                let colorClass = "text-black/30 dark:text-white/30";
                                if (index < input.length) {
                                    colorClass = input[index] === char ? "text-black dark:text-white font-semibold" : "text-red-500 bg-red-500/10 rounded-sm";
                                }

                                return (
                                    <span key={index} className={"transition-colors duration-100 " + colorClass}>
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
                                    className="absolute w-[2px] h-[26px] bg-[#007AFF] rounded-full shadow-[0_0_8px_rgba(0,122,255,0.6)]"
                                    style={{
                                        // This is a rough estimation for cursor position, a more robust way is getting character width
                                        // but since it's hard to position a cursor exactly over wrapped text without complex logic,
                                        // we render the cursor inline if possible. Actually, inline cursor is better.
                                        display: 'none'
                                    }}
                                />
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center gap-8 w-full"
                    >
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center p-6 bg-white/40 dark:bg-black/20 rounded-3xl border border-black/5 dark:border-white/5 backdrop-blur-md shadow-lg min-w-[140px]">
                                <span className="text-[12px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40 mb-2">WPM</span>
                                <span className="text-5xl font-black text-[#007AFF] tracking-tighter">{wpm}</span>
                            </div>
                            <div className="flex flex-col items-center p-6 bg-white/40 dark:bg-black/20 rounded-3xl border border-black/5 dark:border-white/5 backdrop-blur-md shadow-lg min-w-[140px]">
                                <span className="text-[12px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40 mb-2">Accuracy</span>
                                <span className="text-5xl font-black text-black/80 dark:text-white/80 tracking-tighter">{accuracy}%</span>
                            </div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); initTest(); }}
                            className="mt-4 px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-md"
                        >
                            <RotateCcw size={16} />
                            Try Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
