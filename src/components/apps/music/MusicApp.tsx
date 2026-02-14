"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Repeat,
    Shuffle,
    ListMusic,
    Mic2,
    Airplay,
    MoreHorizontal,
    Heart,
    Plus,
    Clock,
    Music2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SONGS, Song } from "./musicData";
import LyricsView from "./LyricsView";

export default function MusicApp() {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showLyrics, setShowLyrics] = useState(true);
    const [volume, setVolume] = useState(0.8);

    const audioRef = useRef<HTMLAudioElement>(null);
    const currentSong: Song = SONGS[currentSongIndex] || SONGS[0];

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSongIndex]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSongEnd = () => {
        handleNext();
    };

    const handleNext = () => {
        setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    };

    const handlePrev = () => {
        setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="h-full flex flex-col bg-[#F9F9F9] text-[#1C1C1E] overflow-hidden font-sans selection:bg-[#FA233B]/20">
            <div className="flex-1 flex overflow-hidden">
                {/* ── Sidebar ────────────────────────────────────────── */}
                <aside className="w-64 bg-[#EBEBEB]/50 border-r border-[#D1D1D1] flex flex-col p-5 h-full">
                    <div className="flex items-center gap-2 mb-8 px-2">
                        <div className="w-6 h-6 flex items-center justify-center bg-[#FA233B] rounded-md text-white">
                            <Music2 size={14} />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Music</span>
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-[11px] font-bold text-black/40 uppercase tracking-widest px-3 mb-2">Apple Music</h3>
                            <nav className="space-y-0.5">
                                {["Listen Now", "Browse", "Radio"].map((item) => (
                                    <button key={item} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-black/5 transition-colors text-left">
                                        {item}
                                    </button>
                                ))}
                            </nav>
                        </section>

                        <section>
                            <h3 className="text-[11px] font-bold text-black/40 uppercase tracking-widest px-3 mb-2">Library</h3>
                            <nav className="space-y-0.5">
                                {["Recently Added", "Artists", "Albums", "Songs"].map((item) => (
                                    <button
                                        key={item}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-left ${item === "Songs" ? "bg-[#FA233B] text-white shadow-sm" : "hover:bg-black/5"}`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </nav>
                        </section>
                    </div>
                </aside>

                {/* ── Main Content ─────────────────────────────────────── */}
                <main className="flex-1 flex flex-col overflow-hidden bg-white">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
                        <div className="max-w-[800px] mx-auto">
                            {/* Hero Header */}
                            <div className="flex gap-10 mb-12">
                                <motion.div
                                    layoutId={`cover-${currentSong.id}`}
                                    className="w-64 h-64 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex-shrink-0"
                                >
                                    <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
                                </motion.div>
                                <div className="flex flex-col justify-end py-2">
                                    <h1 className="text-4xl font-bold tracking-tight mb-1">{currentSong.title}</h1>
                                    <p className="text-2xl text-[#FA233B] font-medium mb-6">{currentSong.artist}</p>
                                    <p className="text-sm text-black/40 font-medium mb-8">
                                        POP · 2026 · <span className="uppercase">Dolby Atmos</span> · LOSSLESS
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className="flex items-center justify-center gap-2 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] px-8 py-2.5 rounded-lg font-bold transition-all min-w-[140px]"
                                        >
                                            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                            {isPlaying ? "Pause" : "Play"}
                                        </button>
                                        <button className="flex items-center justify-center gap-2 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] px-8 py-2.5 rounded-lg font-bold transition-all min-w-[140px]">
                                            <Shuffle size={18} />
                                            Shuffle
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Song List */}
                            <div className="mt-8">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-black/5 text-[11px] font-bold text-black/30 uppercase tracking-widest">
                                            <th className="py-3 pr-4 font-bold">#</th>
                                            <th className="py-3">Song</th>
                                            <th className="py-3 text-right"><Clock size={14} className="ml-auto" /></th>
                                            <th className="py-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {SONGS.map((song, index) => {
                                            const isSelected = index === currentSongIndex;
                                            return (
                                                <tr
                                                    key={song.id}
                                                    onClick={() => {
                                                        setCurrentSongIndex(index);
                                                        setIsPlaying(true);
                                                    }}
                                                    className={`group border-b border-black/5 hover:bg-black/[0.02] cursor-pointer transition-colors ${isSelected ? "bg-black/[0.04]" : ""}`}
                                                >
                                                    <td className="py-3 pr-4 text-black/40 font-medium w-8">
                                                        {isSelected && isPlaying ? (
                                                            <div className="flex items-end gap-[2px] h-3 mb-0.5">
                                                                <motion.div animate={{ height: [4, 12, 6, 10, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-[#FA233B] rounded-full" />
                                                                <motion.div animate={{ height: [8, 4, 10, 6, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-[#FA233B] rounded-full" />
                                                                <motion.div animate={{ height: [12, 4, 8, 4, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-[#FA233B] rounded-full" />
                                                            </div>
                                                        ) : index + 1}
                                                    </td>
                                                    <td className={`py-3 font-medium ${isSelected ? "text-[#FA233B]" : "text-black"}`}>
                                                        {song.title}
                                                    </td>
                                                    <td className="py-3 text-right text-black/40 tabular-nums">
                                                        {song.duration}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100 text-black/40 transition-opacity ml-auto" />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ── Lyrics View ───────────────────────────────────────── */}
                <AnimatePresence>
                    {showLyrics && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 450, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-white border-l border-[#D1D1D1] overflow-hidden hidden xl:block"
                        >
                            <LyricsView lyrics={currentSong.lyrics} currentTime={currentTime} />
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Player Bar ─────────────────────────────────────────── */}
            <footer className="h-20 bg-white/80 backdrop-blur-xl border-t border-[#D1D1D1] px-6 flex items-center justify-between z-10">
                {/* Track Info */}
                <div className="flex items-center gap-3 w-1/3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-black/5">
                        <img src={currentSong.cover} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-sm font-bold truncate">{currentSong.title}</h4>
                        <p className="text-[12px] text-black/40 font-medium truncate">{currentSong.artist}</p>
                    </div>
                    <Heart size={16} className="text-black/20 hover:text-[#FA233B] cursor-pointer ml-2" />
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-1.5 w-1/3">
                    <div className="flex items-center gap-6">
                        <button className="text-black/30 hover:text-black transition-colors"><Shuffle size={18} /></button>
                        <button onClick={handlePrev} className="text-black hover:text-[#FA233B] transition-colors"><SkipBack size={20} fill="currentColor" /></button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button onClick={handleNext} className="text-black hover:text-[#FA233B] transition-colors"><SkipForward size={20} fill="currentColor" /></button>
                        <button className="text-black/30 hover:text-black transition-colors"><Repeat size={18} /></button>
                    </div>

                    {/* Progress */}
                    <div className="w-full max-w-md flex items-center gap-3">
                        <span className="text-[10px] tabular-nums font-bold text-black/30 w-8 text-right">{formatTime(currentTime)}</span>
                        <div className="flex-1 h-1.5 bg-black/5 rounded-full relative group cursor-pointer">
                            <motion.div
                                className="h-full bg-black/60 rounded-full relative"
                                style={{ width: `${(currentTime / duration) * 100}%` || "0%" }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-black/20 rounded-full opacity-0 group-hover:opacity-100 shadow-sm transition-opacity" />
                            </motion.div>
                        </div>
                        <span className="text-[10px] tabular-nums font-bold text-black/30 w-8">-{formatTime(duration - currentTime)}</span>
                    </div>
                </div>

                {/* Extra Controls */}
                <div className="flex items-center justify-end gap-5 w-1/3">
                    <button
                        onClick={() => setShowLyrics(!showLyrics)}
                        className={`transition-colors ${showLyrics ? "text-[#FA233B]" : "text-black/30 hover:text-black"}`}
                    >
                        <Mic2 size={18} />
                    </button>
                    <div className="flex items-center gap-2 group">
                        <Volume2 size={18} className="text-black/30" />
                        <div className="w-24 h-1.5 bg-black/5 rounded-full overflow-hidden">
                            <div className="h-full bg-black/30" style={{ width: `${volume * 100}%` }} />
                        </div>
                    </div>
                    <button className="text-black/30 hover:text-black transition-colors"><Airplay size={18} /></button>
                    <button className="text-black/30 hover:text-black transition-colors"><ListMusic size={18} /></button>
                </div>
            </footer>

            <audio
                ref={audioRef}
                src={currentSong.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleSongEnd}
            />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
}
