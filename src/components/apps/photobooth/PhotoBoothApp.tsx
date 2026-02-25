import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useCamera } from "./useCamera";
import { LayoutGrid, Camera, Video, Image as ImageIcon, StopCircle, ChevronLeft, ChevronRight } from "lucide-react";

type ViewState = 'camera-live' | 'effects-grid' | 'camera-with-filter';

interface Effect {
    name: string;
    filter: string;
    transform?: string;
    className?: string;
}

const EFFECT_PAGES: Effect[][] = [
    // Page 1: Effects (Distortion / Creative)
    [
        { name: "Space Alien", filter: "url(#alien-filter) hue-rotate(120deg) saturate(2)" },
        { name: "Nose Twirl", filter: "url(#twirl-filter)" },
        { name: "Chipmunk", filter: "saturate(2.5) brightness(1.1)", transform: "scaleX(0.7) scaleY(1.3)" },
        { name: "Lovestruck", filter: "sepia(0.3) saturate(1.8) hue-rotate(330deg)", className: "lovestruck-effect" },
        { name: "Normal", filter: "none" },
        { name: "Dizzy", filter: "hue-rotate(90deg) blur(1px)", className: "animate-shake" },
        { name: "Blockhead", filter: "url(#posterize-filter) contrast(2)" },
        { name: "Bug Out", filter: "url(#bugout-filter)" },
        { name: "Frog", filter: "hue-rotate(80deg) saturate(1.5) brightness(0.9)", transform: "scaleY(0.8)" },
    ],
    // Page 2: Filters (Photographic Styles)
    [
        { name: "Sepia", filter: "sepia(100%)" },
        { name: "Black And White", filter: "grayscale(100%)" },
        { name: "Plastic Camera", filter: "contrast(1.4) saturate(1.8) brightness(0.9)" },
        { name: "Comic Book", filter: "contrast(2.5) grayscale(100%) brightness(1.2)" },
        { name: "Normal", filter: "none" },
        { name: "Color Pencil", filter: "saturate(0.3) contrast(1.8) brightness(1.1)" },
        { name: "Glow", filter: "brightness(1.4) contrast(0.8) blur(1px)" },
        { name: "Thermal Camera", filter: "hue-rotate(180deg) saturate(3) contrast(1.5)" },
        { name: "X-Ray", filter: "invert(100%) grayscale(100%) contrast(1.3)" },
    ],
    // Page 3: More Effects (Geometric)
    [
        { name: "Bulge", filter: "url(#bulge-filter)" },
        { name: "Dent", filter: "url(#dent-filter)" },
        { name: "Twirl", filter: "url(#twirl-filter) hue-rotate(45deg) saturate(1.5)" },
        { name: "Squeeze", filter: "none", transform: "scaleX(0.6) scaleY(1.3)" },
        { name: "Normal", filter: "none" },
        { name: "Mirror", filter: "none", transform: "scaleX(1)" }, // Unflip to mirror
        { name: "Light Tunnel", filter: "brightness(1.5) contrast(1.5) saturate(2)", className: "tunnel-effect" },
        { name: "Fish Eye", filter: "url(#fisheye-filter)" },
        { name: "Stretch", filter: "none", transform: "scaleX(1.5) scaleY(0.7)" },
    ]
];

export default function PhotoBoothApp() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [viewState, setViewState] = useState<ViewState>('camera-live');
    const [mode, setMode] = useState<"photo" | "video">("photo");
    const [snapshot, setSnapshot] = useState<string | null>(null);
    const [currentEffect, setCurrentEffect] = useState<Effect>(EFFECT_PAGES[0]?.[4] || { name: 'Normal', filter: 'none' }); // Initial Normal
    const [effectsPage, setEffectsPage] = useState<number>(0);
    const [gridSnapshot, setGridSnapshot] = useState<string | null>(null);

    const { stream, error, isInitializing, isRecording, startCamera, takePhoto, startRecording, stopRecording, saveToLocal } = useCamera();

    // Start the camera automatically when the app is opened
    useEffect(() => {
        startCamera();
    }, [startCamera]);

    // Attach stream to video tag when stream is available
    useEffect(() => {
        if (videoRef.current && stream && viewState !== 'effects-grid') {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
    }, [stream, viewState]);

    const captureGridSnapshot = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !stream) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        // Draw mirrored (like photo booth)
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Use lower quality for grid snapshot to save memory
        return canvas.toDataURL("image/jpeg", 0.7);
    }, [stream]);

    const handleEffectsClick = () => {
        if (viewState === 'camera-live' || viewState === 'camera-with-filter') {
            const snap = captureGridSnapshot();
            if (snap) {
                setGridSnapshot(snap);
                // Pause video stream to save resources while in grid view
                if (videoRef.current) {
                    videoRef.current.pause();
                }
                setViewState('effects-grid');
            }
        }
    };

    const handleBackClick = () => {
        setViewState('effects-grid');
    };

    const selectEffect = (effect: Effect) => {
        if (effect.name === "Normal" && effect.filter === "none") {
            setCurrentEffect(effect);
            setViewState('camera-live');
        } else {
            setCurrentEffect(effect);
            setViewState('camera-with-filter');
        }

        // Resume video play
        if (videoRef.current && stream) {
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
    };

    const nextPage = () => setEffectsPage(p => (p + 1) % EFFECT_PAGES.length);
    const prevPage = () => setEffectsPage(p => (p - 1 + EFFECT_PAGES.length) % EFFECT_PAGES.length);

    const handleTakeMedia = async () => {
        if (mode === "photo") {
            const photoData = takePhoto(videoRef);
            if (photoData) {
                setSnapshot(photoData);
                saveToLocal(photoData, "photo");
                setTimeout(() => setSnapshot(null), 3000);
            }
        } else {
            if (isRecording) {
                const videoDataUrl = await stopRecording();
                if (videoDataUrl) {
                    saveToLocal(videoDataUrl, "video");
                }
            } else {
                startRecording();
            }
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-black overflow-hidden relative font-sans">
            {/* SVG Filters Definition Container (Hidden) */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
                <defs>
                    <filter id="alien-filter" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="B" />
                    </filter>

                    <filter id="twirl-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
                    </filter>

                    <filter id="posterize-filter">
                        <feComponentTransfer>
                            <feFuncR type="discrete" tableValues="0 0.5 1" />
                            <feFuncG type="discrete" tableValues="0 0.5 1" />
                            <feFuncB type="discrete" tableValues="0 0.5 1" />
                        </feComponentTransfer>
                    </filter>

                    <filter id="bugout-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" result="warp" />
                        <feDisplacementMap in="SourceGraphic" in2="warp" scale="60" xChannelSelector="R" yChannelSelector="G" />
                    </filter>

                    <filter id="bulge-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="warp" />
                        <feDisplacementMap in="SourceGraphic" in2="warp" scale="80" xChannelSelector="R" yChannelSelector="G" />
                    </filter>

                    <filter id="dent-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="warp" />
                        <feDisplacementMap in="SourceGraphic" in2="warp" scale="-80" xChannelSelector="R" yChannelSelector="G" />
                    </filter>

                    <filter id="fisheye-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="1" result="warp" />
                        <feDisplacementMap in="SourceGraphic" in2="warp" scale="120" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            {/* Hidden Canvas for Snapshots */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Custom Styles for dynamic effects (Hearts, Shake, Tunnel) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pb-shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .animate-shake {
                    animation: pb-shake 0.5s infinite;
                }
                .tunnel-effect::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%);
                    pointer-events: none;
                }
                .lovestruck-effect::before {
                    content: '\\1F496  \\1F496  \\1F496  \\1F496';
                    position: absolute;
                    top: 10%;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 2rem;
                    letter-spacing: 1rem;
                    z-index: 10;
                    opacity: 0.8;
                    animation: pb-float 2s ease-in-out infinite alternate;
                }
                @keyframes pb-float {
                    from { transform: translateY(0); }
                    to { transform: translateY(-15px); }
                }
                @keyframes pb-flash {
                    0% { background-color: rgba(255,255,255,0); opacity: 0; }
                    20% { background-color: rgba(255,255,255,1); opacity: 1; }
                    100% { background-color: rgba(255,255,255,0); opacity: 0; }
                }
            ` }} />

            {/* ── View Area ────────────────────────────────────────────────────────── */}
            <div className="flex-1 relative bg-zinc-900 border-b border-black overflow-hidden flex items-center justify-center">

                {/* Error/Loading Overlays */}
                {error ? (
                    <div className="absolute inset-0 flex items-center justify-center p-4 z-50 bg-black/50">
                        <div className="text-white text-sm bg-red-500/90 px-6 py-3 rounded-lg backdrop-blur-md text-center shadow-xl">
                            {error}
                        </div>
                    </div>
                ) : isInitializing ? (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">
                        <div className="text-neutral-300 text-sm flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-neutral-400 border-t-white animate-spin" />
                            Initializing Camera...
                        </div>
                    </div>
                ) : null}

                {/* 1. Camera Live / Camera with Filter View */}
                {(viewState === 'camera-live' || viewState === 'camera-with-filter') && (
                    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${(viewState === 'camera-with-filter' && currentEffect.className) ? currentEffect.className : ''}`}>
                        <video
                            ref={videoRef}
                            muted
                            playsInline
                            style={{
                                filter: viewState === 'camera-with-filter' ? currentEffect.filter : 'none',
                                transform: (viewState === 'camera-with-filter' && currentEffect.transform)
                                    ? `${currentEffect.transform} scaleX(-1)`
                                    : 'scaleX(-1)' // Base is always mirrored
                            }}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${snapshot ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        />

                        {/* Snapshot animation overlay */}
                        {snapshot && (
                            <div className="absolute inset-0 bg-white z-20 animate-[pb-flash_0.5s_ease-out_forwards]" />
                        )}
                        {snapshot && (
                            <Image
                                src={snapshot}
                                alt="Snapshot"
                                fill
                                unoptimized
                                style={{
                                    filter: currentEffect.filter,
                                    transform: currentEffect.transform ? `${currentEffect.transform} scaleX(-1)` : 'scaleX(-1)' // Maintain mirror for saved photo visually
                                }}
                                className="absolute inset-0 object-cover z-10 animate-in fade-in zoom-in-95 duration-200"
                            />
                        )}
                    </div>
                )}

                {/* 2. Effects Grid View */}
                {viewState === 'effects-grid' && gridSnapshot && (
                    <div className="absolute inset-0 bg-[#1a1a1a] p-[6px] flex items-center justify-center">
                        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-[6px]">
                            {EFFECT_PAGES[effectsPage]?.map((effect, idx) => (
                                <div
                                    key={`${effect.name}-${idx}`}
                                    onClick={() => selectEffect(effect)}
                                    className="relative w-full h-full bg-black cursor-pointer overflow-hidden group rounded-sm"
                                >
                                    <div className={`w-full h-full relative ${effect.className || ''}`}>
                                        <img
                                            src={gridSnapshot}
                                            alt={effect.name}
                                            style={{
                                                filter: effect.filter,
                                                transform: effect.transform ? `${effect.transform} scaleX(-1)` : 'scaleX(-1)'
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                    <div className="absolute bottom-3 left-0 right-0 text-center z-10">
                                        <span className="bg-black/60 px-4 py-1.5 rounded-full text-white text-[13px] font-medium tracking-wide shadow-sm border border-white/20">
                                            {effect.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bottom Control Bar ──────────────────────────────────────────────── */}
            <div className="h-[76px] flex-shrink-0 flex items-center justify-between px-6 bg-[#f5f5f7] border-t border-black/10 z-40 relative">

                {/* Left Controls (Layout Grid, Main, Video) */}
                <div className="flex items-center space-x-1">
                    <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/5 text-black/50 transition-colors">
                        <LayoutGrid className="w-[22px] h-[22px]" />
                    </button>
                    <button
                        onClick={() => setMode("photo")}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${mode === "photo" ? "bg-black/10 text-black/80 shadow-sm" : "hover:bg-black/5 text-black/50"}`}
                    >
                        <Camera className="w-[20px] h-[20px]" />
                    </button>
                    <button
                        onClick={() => setMode("video")}
                        className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${mode === "video" ? "bg-black/10 text-black/80 shadow-sm" : "hover:bg-black/5 text-black/50"}`}
                    >
                        <Video className="w-[20px] h-[20px]" />
                    </button>
                </div>

                {/* Center Capture / Pagination Controls */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    {viewState === 'effects-grid' ? (
                        <div className="flex items-center space-x-4">
                            <button onClick={prevPage} className="p-2 text-black/40 hover:text-black/70 transition-colors">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="flex items-center space-x-3">
                                {EFFECT_PAGES.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setEffectsPage(i)}
                                        className={`w-2.5 h-2.5 rounded-full transition-colors ${i === effectsPage ? 'bg-[#ff3b30]' : 'bg-black/20 hover:bg-black/30'}`}
                                    />
                                ))}
                            </div>
                            <button onClick={nextPage} className="p-2 text-black/40 hover:text-black/70 transition-colors">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleTakeMedia}
                            disabled={!stream || !!error}
                            className="w-[60px] h-[60px] rounded-full bg-white border border-black/10 flex items-center justify-center shadow-sm 
                                     hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:hover:scale-100 group"
                        >
                            <div className="w-[48px] h-[48px] rounded-full bg-[#ff3b30] border-2 border-white flex items-center justify-center shadow-inner group-hover:bg-[#ff4b40] transition-colors relative overflow-hidden">
                                {mode === "video" && isRecording ? (
                                    <div className="w-4 h-4 rounded-sm bg-white animate-pulse" />
                                ) : mode === "video" ? (
                                    <Video className="w-5 h-5 text-white/90" />
                                ) : (
                                    <ImageIcon className="w-5 h-5 text-white/90" />
                                )}
                            </div>
                        </button>
                    )}
                </div>

                {/* Right Controls (Effects / Back Button) */}
                <div className="w-[100px] flex justify-end">
                    {viewState === 'camera-live' ? (
                        <button
                            onClick={handleEffectsClick}
                            disabled={!stream || !!error}
                            className="px-5 py-1.5 rounded-full text-[13px] font-medium transition-all shadow-sm border border-black/10 bg-white hover:bg-black/5 text-black/80 disabled:opacity-50"
                        >
                            Effects
                        </button>
                    ) : viewState === 'camera-with-filter' ? (
                        <button
                            onClick={handleBackClick}
                            className="bg-white/80 hover:bg-white px-5 py-1.5 rounded-full text-[13px] font-medium text-black shadow-sm backdrop-blur-md border border-black/10 transition-all flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4 -ml-1" />
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setViewState('camera-live');
                                setCurrentEffect(EFFECT_PAGES[0]?.[4] || { name: 'Normal', filter: 'none' });
                                if (videoRef.current) videoRef.current.play();
                            }}
                            className="bg-[#e5e5ea] hover:bg-[#d1d1d6] px-5 py-1.5 rounded-full text-[13px] font-medium text-black/80 transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>



        </div>
    );
}
