"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
    Music2,
    Search,
    ChevronDown,
    ChevronRight,
    Radio
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SONGS, Song, RADIO_STATIONS, FEATURED_SHOWS } from "./musicData";
import LyricsView from "./LyricsView";
import { parseLRC } from "@/lib/lrcParser";

export default function MusicApp() {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showLyrics, setShowLyrics] = useState(true);
    const [volume, setVolume] = useState(0.8);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState<"none" | "all" | "one">("none");
    const [lyricsWidth, setLyricsWidth] = useState(450);
    const [isResizing, setIsResizing] = useState(false);
    const [activeTab, setActiveTab] = useState("Songs"); // "Library" | "Search"
    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const appRef = useRef<HTMLDivElement>(null);
    const currentSong = (SONGS[currentSongIndex] || SONGS[0]) as Song;

    // Use parsed LRC if available, otherwise fallback to static lyrics array
    const displayLyrics = currentSong.lrcContents
        ? parseLRC(currentSong.lrcContents)
        : currentSong.lyrics;

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSongIndex]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !appRef.current) return;
            const rect = appRef.current.getBoundingClientRect();
            const newWidth = rect.right - e.clientX;
            // Limit width between 300px and 800px
            if (newWidth > 300 && newWidth < 800) {
                setLyricsWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current && duration) {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = percent * duration;
        }
    };

    const handleSeekTo = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            if (!isPlaying) setIsPlaying(true);
        }
    };

    const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const newVolume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setVolume(newVolume);
    };

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
        if (isRepeat === "one") {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else if (isShuffle) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * SONGS.length);
            } while (nextIndex === currentSongIndex && SONGS.length > 1);
            setCurrentSongIndex(nextIndex);
        } else if (isRepeat === "all") {
            handleNext();
        } else {
            // Repeat none: only play next if it's not the last song
            if (currentSongIndex < SONGS.length - 1) {
                handleNext();
            } else {
                setIsPlaying(false);
            }
        }
    };

    const handleNext = () => {
        setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    };

    const handleSelectSong = (index: number) => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
        if (window.innerWidth < 768) {
            setIsPlayerExpanded(true);
        }
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
        <div
            ref={appRef}
            className="h-full flex flex-col bg-[#F9F9F9] text-[#1C1C1E] overflow-hidden font-sans selection:bg-[#FA233B]/20 rounded-2xl relative"
        >
            <div className="flex-1 flex overflow-hidden">
                {/* ── Sidebar (Desktop Only) ────────────────────────── */}
                <aside className="hidden md:flex w-64 bg-[#EBEBEB]/50 border-r border-[#D1D1D1] flex-col p-5 h-full">
                    <div className="flex items-center gap-2 mb-8 px-2">
                        <Image src="/musicapple.png" alt="Music" width={24} height={24} className="object-contain" />
                        <span className="font-bold text-lg tracking-tight">Music</span>
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-[11px] font-bold text-black/40 uppercase tracking-widest px-3 mb-2">Apple Music</h3>
                            <nav className="space-y-0.5">
                                {["Listen Now", "Browse", "Radio"].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setActiveTab(item)}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-left ${activeTab === item ? "bg-black/5" : "hover:bg-black/5"}`}
                                    >
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
                                        onClick={() => setActiveTab(item)}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-left ${activeTab === item ? "bg-[#FA233B] text-white shadow-sm" : "hover:bg-black/5"}`}
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
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Mobile View Switching */}
                        <div className="md:hidden">
                            {activeTab === "Songs" && (
                                <div className="p-4">
                                    <h1 className="text-3xl font-bold mb-6">Songs</h1>
                                    <SongListView
                                        songs={SONGS}
                                        currentSongIndex={currentSongIndex}
                                        onSelectSong={handleSelectSong}
                                        isPlaying={isPlaying}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Desktop View (Traditional) */}
                        <div className="hidden md:block p-12">
                            <div className="max-w-[800px] mx-auto">
                                {/* Hero Header */}
                                <div className="flex gap-10 mb-12">
                                    <motion.div
                                        layoutId={`cover-${currentSong.id}`}
                                        className="relative w-64 h-64 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex-shrink-0"
                                    >
                                        <Image src={currentSong.cover} alt={currentSong.title} fill className="object-cover" unoptimized />
                                    </motion.div>
                                    <div className="flex flex-col justify-end py-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Image src="/musicapple.png" alt="Music" width={20} height={20} className="object-contain" />
                                            <div className="text-[10px] font-bold text-[#FA233B] uppercase tracking-widest">Apple Music</div>
                                        </div>
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
                                            <button
                                                onClick={() => setIsShuffle(!isShuffle)}
                                                className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-bold transition-all min-w-[140px] ${isShuffle ? "bg-[#FA233B] text-white shadow-md" : "bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E]"}`}
                                            >
                                                <Shuffle size={18} />
                                                Shuffle
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Song List */}
                                <SongListView
                                    songs={SONGS}
                                    currentSongIndex={currentSongIndex}
                                    onSelectSong={(index: number) => {
                                        setCurrentSongIndex(index);
                                        setIsPlaying(true);
                                    }}
                                    isPlaying={isPlaying}
                                />
                            </div>
                        </div>
                    </div>
                </main>

                {/* ── Lyrics View (Desktop Only) ───────────────────────── */}
                <AnimatePresence>
                    {showLyrics && (
                        <>
                            {/* Resizer Divider */}
                            <div
                                className="w-[1px] bg-[#D1D1D1] hover:bg-[#FA233B] hover:w-1 cursor-col-resize transition-all z-20 group relative h-full hidden xl:block"
                                onMouseDown={() => setIsResizing(true)}
                            >
                                <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
                            </div>

                            <motion.aside
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: lyricsWidth, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="bg-white overflow-hidden hidden xl:block"
                                style={{ width: lyricsWidth }}
                            >
                                <LyricsView
                                    lyrics={displayLyrics}
                                    currentTime={currentTime}
                                    onSeek={handleSeekTo}
                                />
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Mobile Player & Nav Block ──────────────────────────── */}
            <div className="md:hidden flex flex-col bg-white/80 backdrop-blur-xl border-t border-[#D1D1D1] px-4 pb-2 pt-1 z-30">
                {/* Floating Player (Compact) */}
                <div
                    className="flex items-center justify-between bg-white/40 backdrop-blur-md rounded-xl p-2 mb-2 shadow-sm border border-black/5"
                    onClick={() => setIsPlayerExpanded(true)}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                            <Image src={currentSong.cover} alt="" fill className="object-cover" unoptimized />
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-[13px] font-bold truncate leading-tight">{currentSong.title}</h4>
                            <p className="text-[11px] text-black/40 font-medium truncate">{currentSong.artist}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-2">
                        <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}>
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                            <SkipForward size={20} fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-around py-1">
                    {[
                        { id: "Songs", icon: ListMusic, label: "Library" },
                        { id: "Search", icon: Search, label: "Search" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? "text-[#FA233B]" : "text-black/30"}`}
                        >
                            <tab.icon size={22} fill={activeTab === tab.id ? "currentColor" : "none"} />
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Full Expanded Player Overlay */}
            <AnimatePresence>
                {isPlayerExpanded && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 flex items-center justify-between">
                            <button onClick={() => setIsPlayerExpanded(false)} className="text-black/40">
                                <ChevronDown size={28} />
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-[11px] font-bold text-black/30 uppercase tracking-widest">Playing From Songs</span>
                                <span className="text-sm font-bold">{currentSong.album}</span>
                            </div>
                            <button className="text-black/40">
                                <MoreHorizontal size={24} />
                            </button>
                        </div>

                        {/* Content Split: Poster vs Lyrics */}
                        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-12 flex flex-col gap-10">
                            {/* Poster Area */}
                            <div className="flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative w-full aspect-square rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden"
                                >
                                    <Image src={currentSong.cover} alt={currentSong.title} fill className="object-cover" unoptimized />
                                </motion.div>

                                <div className="w-full mt-8 flex items-center justify-between">
                                    <div className="overflow-hidden">
                                        <h2 className="text-2xl font-bold truncate">{currentSong.title}</h2>
                                        <p className="text-lg text-[#FA233B] font-medium truncate">{currentSong.artist}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Heart size={24} className="text-black/20" />
                                    </div>
                                </div>
                            </div>

                            {/* Lyrics integration in Mobile Player */}
                            <div className="h-[400px]">
                                <LyricsView
                                    lyrics={displayLyrics}
                                    currentTime={currentTime}
                                    onSeek={handleSeekTo}
                                />
                            </div>

                            {/* Controls Area */}
                            <div className="flex flex-col gap-8">
                                {/* Progress */}
                                <div className="space-y-2">
                                    <div
                                        className="h-1.5 bg-black/5 rounded-full relative overflow-hidden"
                                        onClick={handleSeek}
                                    >
                                        <div
                                            className="h-full bg-black/80 transition-all duration-100"
                                            style={{ width: `${(currentTime / duration) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold text-black/30 tabular-nums">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>-{formatTime(duration - currentTime)}</span>
                                    </div>
                                </div>

                                {/* Main Actions */}
                                <div className="flex items-center justify-center gap-12">
                                    <button onClick={handlePrev} className="text-black active:scale-90 transition-transform"><SkipBack size={32} fill="currentColor" /></button>
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-20 h-20 flex items-center justify-center bg-black rounded-full text-white active:scale-95 transition-transform"
                                    >
                                        {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
                                    </button>
                                    <button onClick={handleNext} className="text-black active:scale-90 transition-transform"><SkipForward size={32} fill="currentColor" /></button>
                                </div>

                                {/* Bottom Options */}
                                <div className="flex items-center justify-between px-4 mt-4">
                                    <Volume2 size={20} className="text-black/30" />
                                    <div className="flex gap-8">
                                        <Shuffle size={20} className={isShuffle ? "text-[#FA233B]" : "text-black/30"} onClick={() => setIsShuffle(!isShuffle)} />
                                        <Repeat size={20} className={isRepeat !== "none" ? "text-[#FA233B]" : "text-black/30"} onClick={() => setIsRepeat(isRepeat === "none" ? "all" : isRepeat === "all" ? "one" : "none")} />
                                    </div>
                                    <Airplay size={20} className="text-black/30" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Desktop Player Bar ─────────────────────────────────── */}
            <footer className="hidden md:flex h-20 bg-white/80 backdrop-blur-xl border-t border-[#D1D1D1] px-6 items-center justify-between z-10">
                {/* Track Info */}
                <div className="flex items-center gap-3 w-1/3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-black/5">
                        <Image src={currentSong.cover} alt="" fill className="object-cover" unoptimized />
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
                        <button
                            onClick={() => setIsShuffle(!isShuffle)}
                            className={`transition-colors ${isShuffle ? "text-[#FA233B]" : "text-black/30 hover:text-black"}`}
                        >
                            <Shuffle size={18} />
                        </button>
                        <button onClick={handlePrev} className="text-black hover:text-[#FA233B] transition-colors"><SkipBack size={20} fill="currentColor" /></button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button onClick={handleNext} className="text-black hover:text-[#FA233B] transition-colors"><SkipForward size={20} fill="currentColor" /></button>
                        <button
                            onClick={() => setIsRepeat(isRepeat === "none" ? "all" : isRepeat === "all" ? "one" : "none")}
                            className={`transition-colors relative ${isRepeat !== "none" ? "text-[#FA233B]" : "text-black/30 hover:text-black"}`}
                        >
                            <Repeat size={18} />
                            {isRepeat === "one" && <span className="absolute -top-1 -right-1 text-[8px] font-bold">1</span>}
                        </button>
                    </div>

                    {/* Progress */}
                    <div className="w-full max-w-md flex items-center gap-3">
                        <span className="text-[10px] tabular-nums font-bold text-black/30 w-8 text-right">{formatTime(currentTime)}</span>
                        <div
                            className="flex-1 h-1.5 bg-black/5 rounded-full relative group cursor-pointer"
                            onClick={handleSeek}
                        >
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
                        <div
                            className="w-24 h-1.5 bg-black/5 rounded-full overflow-hidden cursor-pointer"
                            onClick={handleVolumeChange}
                        >
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

// ── Subcomponents ────────────────────────────────────────────────────────────

function MusicRadioView() {
    return (
        <div className="p-4 bg-white min-h-full pb-20">
            {/* Apple Music Banner Mock */}
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-sm">
                <div className="absolute inset-0 bg-[#FA233B] flex items-center justify-between px-6 py-4">
                    <div className="text-white max-w-[70%]">
                        <div className="flex items-center gap-2 mb-1">
                            <Image src="/musicapple.png" alt="" width={16} height={16} className="brightness-0 invert" />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Music</span>
                        </div>
                        <h3 className="text-sm font-bold leading-tight">Get first 3 months for the price of 1.</h3>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Radio</h1>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-black/5">
                    <Image src="https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/radio/matt_wilkinson.jpg" alt="" fill className="object-cover" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-10">
                {RADIO_STATIONS.slice(0, 6).map((station) => (
                    <div key={station.id} className="flex flex-col gap-2">
                        <div className="aspect-square relative rounded-xl bg-[#F5F5F7] border border-black/5 overflow-hidden shadow-sm active:scale-95 transition-transform">
                            <Image src={station.logo} alt={station.title} fill className="object-contain p-4" unoptimized />
                        </div>
                        <div className="flex items-center gap-1 justify-center">
                            <Image src="/musicapple.png" alt="" width={8} height={8} className="object-contain" />
                            <span className="text-[8px] font-bold text-black/80">Radio</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Live Radio</h2>
                </div>
                <p className="text-[11px] text-black/40 font-medium -mt-3 mb-4">Tap a station to hear non-stop music and more.</p>

                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 no-scrollbar">
                    {FEATURED_SHOWS.map((show) => (
                        <div key={show.id} className="w-[85%] shrink-0 flex flex-col gap-3">
                            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-md active:scale-[0.98] transition-all">
                                <Image src={show.image} alt={show.title} fill className="object-cover" unoptimized />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h4 className="font-bold text-lg leading-tight uppercase max-w-[150px]">{show.title}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="w-8 shrink-0" /> {/* Padding end */}
                </div>
            </div>
        </div>
    );
}

function SongListView({ songs, currentSongIndex, onSelectSong, isPlaying }: any) {
    return (
        <div className="mt-4">
            <table className="w-full text-left border-collapse">
                <thead className="hidden md:table-header-group">
                    <tr className="border-b border-black/5 text-[11px] font-bold text-black/30 uppercase tracking-widest">
                        <th className="py-3 pr-4 font-bold">#</th>
                        <th className="py-3">Song</th>
                        <th className="py-3 text-right"><Clock size={14} className="ml-auto" /></th>
                        <th className="py-3 w-10"></th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {songs.map((song: any, index: any) => {
                        const isSelected = index === currentSongIndex;
                        return (
                            <tr
                                key={song.id}
                                onClick={() => onSelectSong(index)}
                                className={`group border-b border-black/5 hover:bg-black/[0.02] cursor-pointer transition-colors ${isSelected ? "bg-black/[0.04]" : ""}`}
                            >
                                <td className="py-2.5 md:py-3 pr-4 text-black/40 font-medium w-8">
                                    {isSelected && isPlaying ? (
                                        <div className="flex items-end gap-[2px] h-3 mb-0.5">
                                            <motion.div animate={{ height: [4, 12, 6, 10, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-[#FA233B] rounded-full" />
                                            <motion.div animate={{ height: [8, 4, 10, 6, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-[#FA233B] rounded-full" />
                                            <motion.div animate={{ height: [12, 4, 8, 4, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-[#FA233B] rounded-full" />
                                        </div>
                                    ) : (
                                        <div className="hidden md:block">{index + 1}</div>
                                    )}
                                </td>
                                <td className="py-2.5 md:py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="md:hidden relative w-12 h-12 rounded-lg overflow-hidden border border-black/5 flex-shrink-0 bg-gray-50">
                                            <Image src={song.cover} alt="" fill className="object-cover" unoptimized />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className={`font-semibold md:font-medium truncate ${isSelected ? "text-[#FA233B]" : "text-black"}`}>
                                                {song.title}
                                            </span>
                                            <span className="md:hidden text-[11px] text-black/40 font-medium truncate">{song.artist}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2.5 md:py-3 text-right text-black/40 tabular-nums">
                                    {song.duration}
                                </td>
                                <td className="py-2.5 md:py-3 text-right hidden md:table-cell">
                                    <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100 text-black/40 transition-opacity ml-auto" />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
