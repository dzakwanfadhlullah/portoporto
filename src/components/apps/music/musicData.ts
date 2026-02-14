export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    cover: string;
    audioUrl: string;
    lyrics: { time: number; text: string }[];
}

export const SONGS: Song[] = [
    {
        id: "1",
        title: "Easily",
        artist: "Bruno Major",
        album: "A Song For Every Moon",
        duration: "3:32",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/BrunoMajor-Easily.mp3",
        lyrics: [
            { time: 0, text: "Easily..." },
            { time: 5, text: "Wait for the light to come" },
            { time: 10, text: "Every part of you is beautiful" }
        ]
    },
    {
        id: "2",
        title: "Sofia",
        artist: "Clairo",
        album: "Immunity",
        duration: "3:08",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&h=800&fit=crop",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/Clairo_Sofia.mp3",
        lyrics: [
            { time: 0, text: "Sofia, know that you and I..." },
            { time: 8, text: "Shouldn't feel like a crime" }
        ]
    },
    {
        id: "3",
        title: "Best Part",
        artist: "Daniel Caesar",
        album: "Freudian",
        duration: "3:29",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/DanielCaesar_BestPart.mp3",
        lyrics: [
            { time: 0, text: "You're the coffee that I need in the morning" },
            { time: 10, text: "You're my sunshine in the rain when it's pouring" }
        ]
    },
    {
        id: "4",
        title: "Malibu Nights",
        artist: "Lany",
        album: "Malibu Nights",
        duration: "4:46",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=800&fit=crop",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/lany_malibu_nights.mp3",
        lyrics: [
            { time: 0, text: "I've got way too much time to be this hurt" },
            { time: 12, text: "Somebody help me, it's getting worse" }
        ]
    },
    {
        id: "5",
        title: "From The Start",
        artist: "Laufey",
        album: "Bewitched",
        duration: "2:49",
        cover: "https://images.unsplash.com/photo-1514525253344-f81f3f776a26?w=800&h=800&fit=crop",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/Laufey_FromTheStart.mp3",
        lyrics: [
            { time: 0, text: "Don't you notice how I get quiet when there's no one else around?" },
            { time: 15, text: "Me and you and awkward silence" }
        ]
    },
    {
        id: "6",
        title: "Sunflower",
        artist: "Rex Orange County",
        album: "Sunflower",
        duration: "4:12",
        cover: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&h=800&fit=crop",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/RexOrangeCounty_Sunflower.mp3",
        lyrics: [
            { time: 0, text: "I want to know where I can go" },
            { time: 20, text: "When you're not around" }
        ]
    },
    {
        id: "7",
        title: "Slow Dancing In The Dark",
        artist: "Joji",
        album: "BALLADS 1",
        duration: "3:29",
        cover: "https://images.unsplash.com/photo-1514525253344-f81f3f776a26?w=800&h=800&fit=crop",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/SLOWDANCINGINTHEDARK.mp3",
        lyrics: [
            { time: 0, text: "I don't want a friend, I want my life in two" },
            { time: 20, text: "Give me the truth" }
        ]
    },
    {
        id: "8",
        title: "Good Days",
        artist: "SZA",
        album: "Good Days",
        duration: "4:39",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/SZA-GoodDays.mp3",
        lyrics: [
            { time: 0, text: "Good day in my mind, safe to take a step out" },
            { time: 30, text: "Get some air, let it out" }
        ]
    },
    {
        id: "9",
        title: "About You",
        artist: "The 1975",
        album: "Being Funny in a Foreign Language",
        duration: "5:26",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&h=800&fit=crop",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/The1975-AboutYou.mp3",
        lyrics: [
            { time: 0, text: "I know a place, it's somewhere I go" },
            { time: 30, text: "When I need to be alone" }
        ]
    }
];

