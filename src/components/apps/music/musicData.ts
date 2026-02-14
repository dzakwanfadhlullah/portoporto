export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    cover: string;
    audioUrl: string;
    lyrics: { time: number; text: string }[];
    lrcContents?: string;
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
        ],
        lrcContents: `[ar: Daniel Caesar]
[ti: Best Part (ft. H.E.R.)]
[by: wonpei]
[length: 03:30]
[Intro: H.E.R.]
[00:07.19]Oh, ey

[Verse 1: H.E.R.]
[00:14.88]You don't know babe
[00:18.00]When you hold me
[00:21.25]And kiss me slowly
[00:23.13]It's the sweetest thing
[00:27.50]And it don't change
[00:30.44]If I had it my way
[00:34.44]You would know that you are

[Pre-Chorus 1: H.E.R.]
[00:39.81]You're the coffee that I need in the morning
[00:42.69]You're my sunshine in the rain when it's pouring
[00:46.25]Won't you give yourself to me
[00:48.25]Give it all, oh

[Chorus: Daniel Caesar & H.E.R.]
[00:51.63]I just wanna see
[00:53.13]I just wanna see how beautiful you are
[00:59.31]You know that I see it
[01:02.69]I know you're a star
[01:06.06]Where you go I follow
[01:09.00]No matter how far
[01:12.19]If life is a movie
[01:15.56]Oh you're the best part, oh
[01:22.44]You're the best part, oh
[01:29.44]Best part

[Verse 2: Daniel Caesar]
[01:31.38]It's the sunrise
[01:34.50]And those brown eyes
[01:37.31]You're the one that I desire
[01:44.00]When we wake up
[01:47.56]And then we make love
[01:51.06]It makes me feel so nice

[Pre-Chorus 2: Daniel Caesar]
[01:56.25]You're my water when I'm stuck in the desert
[01:59.63]You're the Tylenol I take when my head hurts
[02:03.38]You're the sunshine on my life

[Chorus: Daniel Caesar & H.E.R.]
[02:10.31]I just wanna see how beautiful you are
[02:16.06]You know that I see it
[02:19.44]I know you're a star
[02:22.88]Where you go I follow
[02:25.88]No matter how far
[02:28.81]If life is a movie
[02:32.25]Then you're the best part, oh
[02:39.31]You're the best part, oh
[02:46.56]Best part

[Outro: Daniel Caesar & H.E.R.]
[02:47.88]If you love me won't you say something
[02:50.44]If you love me won't you
[02:52.75]Won't you
[02:53.88]If you love me won't you say something
[02:56.75]If you love me won't you
[02:59.00]Love me, won't you
[03:00.44]If you love me won't you say something
[03:03.31]If you love me won't you
[03:06.75]If you love me won't you say something
[03:10.00]If you love me won't you
[03:11.94]Love me, won't you
[03:13.13]If you love me won't you say something
[03:16.06]If you love me won't you
[03:19.56]If you love me won't you say something
[03:22.44]If you love me won't you
[03:24.94]Love me, won't you`
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

