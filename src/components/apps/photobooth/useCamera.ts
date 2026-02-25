import { useState, useEffect, useRef, useCallback } from "react";

interface UseCameraContext {
    stream: MediaStream | null;
    error: string | null;
    isInitializing: boolean;
    isRecording: boolean;
    startCamera: () => Promise<void>;
    stopCamera: () => void;
    takePhoto: (videoRef: React.RefObject<HTMLVideoElement | null>, effectFilter?: string) => string | null;
    startRecording: () => void;
    stopRecording: () => Promise<string | null>;
    saveToLocal: (dataUrl: string, type: "photo" | "video") => void;
}

export function useCamera(): UseCameraContext {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);

    // We keep track of the stream in a ref so we can definitively close it
    // if the component unmounts while initializing.
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            // Stop recording if active
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            setStream(null);
            setIsRecording(false);
        }
    }, []);

    const startCamera = useCallback(async () => {
        if (isInitializing || streamRef.current) return;

        setIsInitializing(true);
        setError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"
                },
                audio: false,
            });

            streamRef.current = mediaStream;
            setStream(mediaStream);
        } catch (err) {
            console.error("Failed to acquire camera stream", err);
            setError("Gagal mengakses kamera. Pastikan memberikan izin akses.");
        } finally {
            setIsInitializing(false);
        }
    }, [isInitializing]);

    // Draw video frame to canvas to get a data URL base64 image
    const takePhoto = useCallback((videoRef: React.RefObject<HTMLVideoElement | null>, effectFilter?: string): string | null => {
        if (!videoRef.current || !stream) return null;

        const video = videoRef.current;
        const canvas = document.createElement("canvas");

        // Match the internal video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        // Apply external filter if provided and not 'none'
        if (effectFilter && effectFilter !== 'none') {
            ctx.filter = effectFilter;
        }

        // Draw the current video frame
        // Photo Booth usually mirrors the video visually, so we might want to mirror the draw too
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL("image/jpeg", 0.9);
    }, [stream]);

    // ─── Video Recording ────────────────────────────────────────────────────────

    const startRecording = useCallback(() => {
        if (!stream) return;

        recordedChunksRef.current = [];
        const options = { mimeType: 'video/webm; codecs=vp9' };

        try {
            const recorder = new MediaRecorder(stream, options);
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting media recorder", err);
            setError("Browser tidak mendukung format perekaman ini.");
        }
    }, [stream]);

    const stopRecording = useCallback((): Promise<string | null> => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
                resolve(null);
                return;
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, {
                    type: "video/webm"
                });

                // Create object URL from blob
                const url = URL.createObjectURL(blob);
                recordedChunksRef.current = [];
                setIsRecording(false);
                resolve(url);
            };

            mediaRecorderRef.current.stop();
        });
    }, []);

    // ─── Save to Local (Downloads) ──────────────────────────────────────────────

    const saveToLocal = useCallback((dataUrl: string, type: "photo" | "video") => {
        const a = document.createElement("a");
        a.href = dataUrl;

        // Generate filename based on timestamp
        const date = new Date();
        const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;

        const extension = type === "photo" ? "jpg" : "webm";
        a.download = `Photo Booth ${timestamp}.${extension}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, []);

    // Ensure we clean up when the hook consumer unmounts
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return {
        stream,
        error,
        isInitializing,
        isRecording,
        startCamera,
        stopCamera,
        takePhoto,
        startRecording,
        stopRecording,
        saveToLocal
    };
}
