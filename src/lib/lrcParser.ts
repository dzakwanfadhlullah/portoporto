/**
 * Parses a standard LRC string into an array of lyric objects with timestamps.
 * Supports [mm:ss.xx] or [mm:ss] formats.
 */
export interface LyricLine {
    time: number;
    text: string;
}

export function parseLRC(lrc: string): LyricLine[] {
    const lines = lrc.split("\n");
    const lyrics: LyricLine[] = [];
    const timeRegex = /\[(\d{2}):(\d{2})(\.\d{2,3})?\]/;

    lines.forEach((line) => {
        const match = timeRegex.exec(line);
        if (match && match[1] && match[2]) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const milliseconds = match[3] ? parseFloat(match[3]) : 0;
            const time = minutes * 60 + seconds + milliseconds;
            const text = line.replace(timeRegex, "").trim();

            if (text) {
                lyrics.push({ time, text });
            }
        }
    });

    return lyrics.sort((a, b) => a.time - b.time);
}
