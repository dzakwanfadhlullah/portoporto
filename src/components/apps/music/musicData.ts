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
        title: "Wildflowers",
        artist: "Nao",
        album: "Jupiter",
        duration: "3:25",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop",
        audioUrl: "/music/song1.mp3",
        lyrics: [
            { time: 0, text: "I'm picking wildflowers" },
            { time: 5, text: "In the middle of the night" },
            { time: 10, text: "Wait for the morning sun" },
            { time: 15, text: "Everything will be alright" },
            { time: 20, text: "All day, all night" },
            { time: 25, text: "Searching for the light" }
        ]
    },
    {
        id: "2",
        title: "Elevate",
        artist: "Nao",
        album: "Jupiter",
        duration: "3:06",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&h=800&fit=crop",
        audioUrl: "/music/song2.mp3",
        lyrics: [
            { time: 0, text: "Let's elevate our minds" },
            { time: 8, text: "To a place we've never been" },
            { time: 16, text: "Beyond the clouds above" },
            { time: 24, text: "Where the colors never end" }
        ]
    },
    {
        id: "3",
        title: "Happy People",
        artist: "Nao",
        album: "Jupiter",
        duration: "3:20",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop",
        audioUrl: "/music/song3.mp3",
        lyrics: [
            { time: 0, text: "See all the happy people" },
            { time: 10, text: "Dancing in the street" },
            { time: 20, text: "No more worries now" },
            { time: 30, text: "Just the rhythm in their feet" }
        ]
    },
    {
        id: "4",
        title: "Light Years",
        artist: "Nao",
        album: "Jupiter",
        duration: "3:47",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=800&fit=crop",
        audioUrl: "/music/song4.mp3",
        lyrics: [
            { time: 0, text: "We're light years away" },
            { time: 12, text: "From where we used to be" },
            { time: 24, text: "In another galaxy" },
            { time: 36, text: "Just you and me" }
        ]
    },
    {
        id: "5",
        title: "We All Win",
        artist: "Nao",
        album: "Jupiter",
        duration: "3:10",
        cover: "https://images.unsplash.com/photo-1514525253344-f81f3f776a26?w=800&h=800&fit=crop",
        audioUrl: "/music/song5.mp3",
        lyrics: [
            { time: 0, text: "When we stand together" },
            { time: 15, text: "We all win the race" },
            { time: 30, text: "In this beautiful life" },
            { time: 45, text: "In this sacred space" }
        ]
    },
    {
        id: "6",
        title: "Poolside",
        artist: "Nao",
        album: "Jupiter",
        duration: "3:07",
        cover: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&h=800&fit=crop",
        audioUrl: "/music/song6.mp3",
        lyrics: [
            { time: 0, text: "Sitting by the poolside" },
            { time: 20, text: "Watching waves go by" },
            { time: 40, text: "Summer's here at last" },
            { time: 60, text: "Underneath the sky" }
        ]
    },
    {
        id: "7",
        title: "30 Something",
        artist: "Nao",
        album: "Jupiter",
        duration: "3:31",
        cover: "https://images.unsplash.com/photo-1514525253344-f81f3f776a26?w=800&h=800&fit=crop",
        audioUrl: "/music/song7.mp3",
        lyrics: [
            { time: 0, text: "Thirty something years" },
            { time: 10, text: "And I'm still feeling young" },
            { time: 20, text: "With a heart full of songs" },
            { time: 30, text: "And a life that's just begun" }
        ]
    },
    {
        id: "8",
        title: "Jupiter",
        artist: "Nao",
        album: "Jupiter",
        duration: "4:12",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop",
        audioUrl: "/music/song8.mp3",
        lyrics: [
            { time: 0, text: "Jupiter is rising" },
            { time: 30, text: "In the midnight sky" },
            { time: 60, text: "A giant in the dark" },
            { time: 90, text: "Passing slowly by" }
        ]
    },
    {
        id: "9",
        title: "Wait",
        artist: "Nao",
        album: "Jupiter",
        duration: "3:55",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&h=800&fit=crop",
        audioUrl: "/music/song9.mp3",
        lyrics: [
            { time: 0, text: "Wait just a moment" },
            { time: 15, text: "Let the time go slow" },
            { time: 30, text: "There's so much to learn" },
            { time: 45, text: "So much more to know" }
        ]
    },
    {
        id: "10",
        title: "Afterglow",
        artist: "Nao",
        album: "Jupiter",
        duration: "3:42",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop",
        audioUrl: "/music/song10.mp3",
        lyrics: [
            { time: 0, text: "In the afterglow" },
            { time: 20, text: "When the party's done" },
            { time: 40, text: "We'll remember this" },
            { time: 60, text: "We're the lucky ones" }
        ]
    }
];
