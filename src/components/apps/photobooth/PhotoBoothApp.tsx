import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCamera } from "./useCamera";
import { LayoutGrid, Camera, Video, Image as ImageIcon, StopCircle } from "lucide-react";

export default function PhotoBoothApp() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mode, setMode] = useState<"photo" | "video">("photo");
    const [snapshot, setSnapshot] = useState<string | null>(null);
    const [currentFilter, setCurrentFilter] = useState<string>("none");
    const [showEffects, setShowEffects] = useState<boolean>(false);
    const { stream, error, isInitializing, isRecording, startCamera, takePhoto, startRecording, stopRecording, saveToLocal } = useCamera();

    // Start the camera automatically when the app is opened
    useEffect(() => {
        startCamera();
        // Camera stops automatically from cleanup in useCamera hook
    }, [startCamera]);

    // Attach stream to video tag when stream is available
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
    }, [stream]);

    const handleTakeMedia = async () => {
        if (mode === "photo") {
            const photoData = takePhoto(videoRef);
            if (photoData) {
                setSnapshot(photoData);
                // Save out photo automatically
                saveToLocal(photoData, "photo");

                setTimeout(() => {
                    setSnapshot(null);
                }, 3000);
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

    const filters = [
        { name: "Normal", value: "none" },
        { name: "Grayscale", value: "grayscale(100%)" },
        { name: "Sepia", value: "sepia(100%)" },
        { name: "Invert", value: "invert(100%)" },
        { name: "High Contrast", value: "contrast(200%)" },
        { name: "Blur", value: "blur(4px)" },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-black overflow-hidden relative">

            {/* ── Video Area ────────────────────────────────────────────────────────── */}
            <div className="flex-1 relative bg-zinc-900 border-b border-white/10 overflow-hidden">
                {error ? (
                    <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
                        <div className="text-white text-sm bg-red-500/80 px-4 py-2 rounded-md backdrop-blur-md text-center shadow-lg">
                            {error}
                        </div>
                    </div>
                ) : isInitializing ? (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="text-neutral-400 text-sm flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin" />
                            Initializing Camera...
                        </div>
                    </div>
                ) : null}

                {showEffects && (
                    <div className="absolute top-0 w-full p-4 bg-black/60 backdrop-blur-md z-30 flex gap-4 overflow-x-auto shadow-sm">
                        {filters.map(filter => (
                            <button
                                key={filter.name}
                                onClick={() => setCurrentFilter(filter.value)}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
                                    ${currentFilter === filter.value ? 'bg-white text-black border-white' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                            >
                                {filter.name}
                            </button>
                        ))}
                    </div>
                )}

                <video
                    ref={videoRef}
                    muted
                    playsInline
                    style={{ filter: currentFilter }}
                    className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${snapshot ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                />

                {snapshot && (
                    <Image
                        src={snapshot}
                        alt="Snapshot"
                        fill
                        unoptimized
                        style={{ filter: currentFilter }}
                        className="absolute inset-0 object-cover z-10 animate-in fade-in zoom-in-95 duration-200"
                    />
                )}
            </div>

            {/* ── Bottom Control Bar ──────────────────────────────────────────────── */}
            <div className="h-[76px] flex-shrink-0 flex items-center justify-between px-6 bg-white z-40 relative">

                {/* Left Controls (Layout Grid, Main, Video) */}
                <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/5 text-black/60 transition-colors">
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setMode("photo")}
                        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${mode === "photo" ? "bg-black/10 text-black/80" : "hover:bg-black/5 text-black/60"}`}
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setMode("video")}
                        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${mode === "video" ? "bg-black/10 text-black/80" : "hover:bg-black/5 text-black/60"}`}
                    >
                        <Video className="w-5 h-5" />
                    </button>
                </div>

                {/* Center Capture Button */}
                <div className="absolute left-1/2 top-[calc(100%-86px)] -translate-x-1/2 h-[76px] flex items-center justify-center">
                    <button
                        onClick={handleTakeMedia}
                        disabled={!stream || !!error}
                        className="w-14 h-14 rounded-full bg-[#FF3B30] flex items-center justify-center shadow-sm 
                                 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center relative">
                            {mode === "video" && isRecording ? (
                                <StopCircle className="w-6 h-6 text-white" />
                            ) : mode === "video" ? (
                                <Video className="w-6 h-6 text-white" />
                            ) : (
                                <ImageIcon className="w-6 h-6 text-white" />
                            )}
                        </div>
                    </button>
                </div>

                {/* Right Controls (Effects Button) */}
                <button
                    onClick={() => setShowEffects(!showEffects)}
                    className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm border border-black/5
                        ${showEffects ? 'bg-black/15 text-black/80' : 'bg-black/5 hover:bg-black/10 text-black/70'}`}
                >
                    Effects
                </button>
            </div>

        </div>
    );
}
