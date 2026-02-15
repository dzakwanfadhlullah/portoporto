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
        cover: "/musicalbumphoto/Bruno Major - A Song For Every Moon.jpg",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/BrunoMajor-Easily.mp3",
        lyrics: [
            { time: 0, text: "Easily..." },
            { time: 5, text: "Wait for the light to come" },
            { time: 10, text: "Every part of you is beautiful" }
        ],
        lrcContents: `[ar: Bruno Major]
[al: A Song for Every Moon]
[ti: Easily]
[au: Bruno Major & Emily Caroline Elbert]
[length: 03:30]

[00:00.16]Don't you tell me that it wasn't meant to be
[00:06.39]Call it quits, call it destiny
[00:12.34]Just because it won't come easily
[00:18.48]Doesn't mean we shouldn't try

[00:27.44]We had a good thing going lately
[00:31.88]Might not have always been a fairytale
[00:35.66]But you know and I know that they ain't real
[00:43.96]I'll take the truth over the story

[00:51.67]You might have tried my patience greatly
[00:55.97]But I'm not about to let us fail
[00:59.88]I'll be the wind picking up your sail
[01:08.36]But won't you do something for me

[01:12.92]Don't you tell me that it wasn't meant to be
[01:18.79]Call it quits, call it destiny
[01:24.99]Just because it won't come easily
[01:31.10]Doesn't mean we shouldn't try

[01:39.92]Coming and going
[01:42.22]Inside out and back to front
[01:44.93]All tangled and messy
[01:47.98]That's how we've and we'll always be
[01:56.72]And that's alright with me

[02:01.38]Don't you tell me that it wasn't meant to be
[02:07.28]Call it quits, call it destiny
[02:13.47]Just because it won't come easily
[02:19.50]Doesn't mean we shouldn't try

[02:22.99]Try, try
[02:25.58]Just because it won't come easily
[02:31.62]Doesn't mean we shouldn't try

[03:01.98]Just because it won't come easily
[03:07.86]Doesn't mean we shouldn't try
[03:11.47]Try, try
[03:14.07]Just because it won't come easily
[03:20.35]Doesn't mean we shouldn't try`
    },
    {
        id: "2",
        title: "Sofia",
        artist: "Clairo",
        album: "Immunity",
        duration: "3:08",
        cover: "/musicalbumphoto/Clairo - Sofia.jpg",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/Clairo_Sofia.mp3",
        lyrics: [
            { time: 0, text: "Sofia, know that you and I..." },
            { time: 8, text: "Shouldn't feel like a crime" }
        ],
        lrcContents: `[id: pshzyxxn]
[ti:Sofia]
[ar:Clairo]
[al:Immunity]
[length: 3:08]

[00:15.40]I think we could do it if we tried
[00:18.40]If only to say you're mine
[00:22.70]Sofia, know that you and I
[00:26.60]Shouldn't feel like a crime
[00:30.90]I think we could do it if we tried
[00:35.00]If only to say, you're mine
[00:39.90]Sofia, know that you and I
[00:43.80]Shouldn't feel like a crime

[00:48.30]You know I'll do anything you ask me to
[00:56.50]But, oh my God, I think I'm in love with you
[01:05.00]Standing here alone now
[01:08.40]Think that we can drive around
[01:10.50]I just wanna say
[01:12.50]How I love you with your hair down
[01:15.00]Baby, you don't gotta fight
[01:17.00]I'll be here 'til the end of time
[01:19.50]Wishing that you were mine
[01:21.70]Pull you in, it's alright

[01:23.30]I think we could do it if we tried
[01:26.30]If only to say, you're mine
[01:30.40]Sofia, know that you and I
[01:34.90]Shouldn't feel like a crime

[01:57.20]Honey, I don't want it to fade
[02:00.90]There's things that I don't know 
[02:03.70]Could get in the way
[02:05.80]I don't want to say goodbye
[02:09.40]And I think that we could do it if we tried

[02:14.30]I think we could do it if we tried
[02:17.60]If only to say, you're mine
[02:21.70]Sofia, know that you and I
[02:26.10]Shouldn't feel like a crime

[02:31.40]I think we could do it if we tried
[02:36.80]I think we could do it if we tried
[02:45.20]Sofia, know that you and I
[02:52.10]shouldn't feel like a crime
[02:56.00]( Sofia, know that you and I ) 
[02:59.90]( Shouldn't feel like a crime )`
    },
    {
        id: "3",
        title: "Best Part",
        artist: "Daniel Caesar",
        album: "Freudian",
        duration: "3:29",
        cover: "/musicalbumphoto/Daniel Caesar - Freudian.jpg",
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
        cover: "/musicalbumphoto/LANY - Malibu Nights.jpg",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/lany_malibu_nights.mp3",
        lyrics: [
            { time: 0, text: "I've got way too much time to be this hurt" },
            { time: 12, text: "Somebody help me, it's getting worse" }
        ],
        lrcContents: `[id: yrhhdtfl]
[ar: LANY]
[al: Malibu Nights]
[ti: Malibu Nights]
[au: Paul Jason Klein & Tobias Jesso Jr.]
[length: 04:46]

[00:13.21]There's no reason, there's no rhyme
[00:16.34]I found myself blindsided by
[00:19.55]A feeling that I've never known
[00:22.78]I'm dealing with it on my own

[00:26.19]Phone is quiet, walls are bare
[00:29.31]I drink myself to sleep, who cares?
[00:32.70]No one even has to know
[00:35.74]I'm dealing with it on my own

[00:44.40]I've got way too much time to be this hurt
[00:48.04]Somebody help, it's getting worse
[00:51.36]What do you do with a broken heart?
[00:54.59]Once the light fades, everything is dark

[00:57.82]Way too much whiskey in my blood
[01:01.08]I feel my body giving up
[01:04.34]Can I hold on for another night?
[01:07.59]What do I do with all this time?

[01:24.58]Heavy thoughts when it gets late
[01:27.83]Put me in a fragile state
[01:30.94]I wish I wasn't going home
[01:34.34]Dealing with it on my own

[01:37.43]I'm praying but it's not enough
[01:40.65]I'm done, I don't believe in love
[01:44.06]Learning how to let it go
[01:47.33]Dealing with it on my own

[01:49.24]I've got way too much time to be this hurt
[01:52.93]Somebody help, it's getting worse
[01:56.23]What do you do with a broken heart?
[01:59.48]Once the light fades, everything is dark

[02:02.70]Way too much whiskey in my blood
[02:05.95]I feel my body giving up
[02:09.20]Can I hold on for another night?
[02:12.45]What do I do with all this time? Yeah

[02:16.51]I drive circles under street lights
[02:21.35]Nothing seems to clear my mind, I can't forget
[02:27.46]Get this out my head, so
[02:29.49]I drive, chasing Malibu nights
[02:34.35]Nothing seems to heal my mind, I can't forget

[02:41.25]I've got way too much time to be this hurt
[02:44.85]Somebody help, it's getting worse
[02:48.07]What do you do with a broken heart?
[02:51.36]Once the light fades, everything is dark

[02:54.59]Way too much whiskey in my blood
[02:57.84]I feel my body giving up
[03:01.04]Can I hold on for another night?
[03:04.33]What do I do with all this time? Yeah

[03:21.37]I drive circles under street lights
[03:26.22]Nothing seems to clear my mind, I can't forget
[03:32.30]Get this out my head, so
[03:34.34]I drive, chasing Malibu nights
[03:39.23]Nothing seems to heal my mind, I can't forget
[03:45.31]Get this out my head, so
[03:47.34]I drive, chasing Malibu nights`
    },
    {
        id: "5",
        title: "From The Start",
        artist: "Laufey",
        album: "Bewitched",
        duration: "2:49",
        cover: "/musicalbumphoto/Laufey - Bewitched.jpg",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/Laufey_FromTheStart.mp3",
        lyrics: [
            { time: 0, text: "Don't you notice how I get quiet when there's no one else around?" },
            { time: 15, text: "Me and you and awkward silence" }
        ],
        lrcContents: `[id: pshxersh]
[ti:From The Start]
[ar:Laufey]
[by:Generated using SongSync]
[00:04.85]Don't you notice how
[00:08.54]I get quiet when there's no one else around?
[00:14.11]Me and you and awkward silence
[00:17.35]Don't you dare look at me that way
[00:23.00]I don't need reminders of how you don't feel the same
[00:28.38]Oh, the burning pain
[00:31.86]Listening to you harp on 'bout some new soulmate
[00:37.68]"She's so perfect", blah, blah, blah
[00:40.44]Oh, how I wish you'll wake up one day
[00:46.48]Run to me, confess your love, at least just let me say
[00:51.72]That when I talk to you
[00:55.25]Oh, Cupid walks right through
[00:58.16]And shoots an arrow through my heart
[01:03.51]And I sound like a loon
[01:06.85]But don't you feel it, too?
[01:09.75]Confess I loved you from the start

[01:38.63]What's a girl to do?
[01:41.98]Lying on my bed, staring into the blue
[01:47.84]Unrequited, terrifying
[01:51.09]Love is driving me a bit insane
[01:56.72]Have to get this off my chest, I'm telling you today
[02:01.94]That when I talk to you
[02:05.48]Oh, Cupid walks right through
[02:08.35]And shoots an arrow through my heart
[02:13.73]And I sound like a loon
[02:17.03]But don't you feel it, too?
[02:19.98]Confess I loved you from the start
[02:25.66]Confess I loved you
[02:28.65]Just thinking of you
[02:33.18]I know I've loved you from the start
[02:40.74]`
    },
    {
        id: "6",
        title: "Sunflower",
        artist: "Rex Orange County",
        album: "Sunflower",
        duration: "4:12",
        cover: "/musicalbumphoto/Rex Orange County - Sunflower.jpg",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/RexOrangeCounty_Sunflower.mp3",
        lyrics: [
            { time: 0, text: "I want to know where I can go" },
            { time: 20, text: "When you're not around" }
        ],
        lrcContents: `[id: pshxfrhw]
[ti: Sunflower]
[ar: Rex Orange County]
[al: Sunflower]
[yr: 2017]
[ge: Alternative]
[du: 4:12]
[by: ADarmawan4]
[Intro]
[00:01.08]Woah
[00:05.69]I want to know where I can go
[00:11.45]When you're not around, and I'm feeling down
[00:17.48]So won't you stay for a moment so I can say
[00:25.16]I
[00:29.58]I need you so? 'Cause right now, you know
[00:35.64]That nothing here's new, and I'm obsessed with you
[00:41.37]Then I fell to the ground, and you smiled at me and said

[Verse 1]
[00:49.25]I don't wanna see you cry
[00:53.37]You don't have to feel this emptiness
[00:57.38]She said, "I'll love you till the day that I die"
[01:04.43]Well, maybe she's right
[01:07.89]'Cause I don't wanna feel like I'm not me
[01:12.09]And to be honest, I don't even know why
[01:16.35]I let myself get down in the first place

[Chorus]
[01:23.46]Tryna keep my mind at bay
[01:27.04]Sunflower still grows at night
[01:31.13]Waiting for a minute till the sun's seen through my eyes
[01:38.37]Make it down, down, do-down-down
[01:41.98]Diggy, dig down, doo-doo-doo-doo
[01:45.95]Waiting for a minute till the sun's seen through my eyes

[Verse 2]
[01:54.01]You know you need to get yourself to sleep and dream
[01:57.04]A dream of you and I
[02:00.34]There's no need to keep an open eye
[02:04.27]I promise I'm the one for you
[02:06.07]Just let me hold you in these arms tonight
[02:09.75]I'm lucky to be me and you can see it in my face
[02:14.96]Back when I fucked my shit up too many times
[02:17.99]Why would I let myself get down in the first place?

[Chorus]
[02:26.16]Tryna keep my mind at bay
[02:29.87]Sunflower still grows at night
[02:33.93]Waiting for a minute till the sun's seen through my eyes
[02:41.11]Make it down, down, do-down-down
[02:44.75]Diggy, dig down, doo-doo-doo-doo
[02:48.68]Waiting for a minute till the sun's seen through my eyes

[Bridge]
[02:55.28]And so she sat me down and told me that I didn't have to cry
[02:59.75]Said I didn't need to get down or feel empty inside
[03:03.59]And told me that she'll love me for as long as she's alive
[03:08.48]And well, maybe she's right
[03:10.92]'Cause I hate it when I feel like I'm not me
[03:14.07]See, I honestly don't even know why
[03:17.78]I-I honestly don't even know why

[Chorus]
[03:40.16]Tryna keep my mind at bay
[03:43.69]Sunflower still grows at night
[03:47.70]Waiting for a minute till the sun's seen through my eyes
[03:55.11]Make it down, down, do-down-down
[03:58.70]Diggy, dig down, doo-doo-doo-doo
[04:02.46]Waiting for a minute till the sun's seen through my eyes`
    },
    {
        id: "7",
        title: "Slow Dancing In The Dark",
        artist: "Joji",
        album: "BALLADS 1",
        duration: "3:29",
        cover: "/musicalbumphoto/Joji - BALLADS 1.jpg",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/SLOWDANCINGINTHEDARK.mp3",
        lyrics: [
            { time: 0, text: "I don't want a friend, I want my life in two" },
            { time: 20, text: "Give me the truth" }
        ],
        lrcContents: `[id: pshzivhy]
[ar: JOJI]
[ti: JOJI - Slow Dancing In The Dark]

[re: LRC Editor - Android app]
[ve: Version 3.2.6]

[01:04.29]Give me reasons we should be complete
[01:12.57]You should be with him, I can't compete
[01:17.98]You looked at me like I was someone else, oh well
[01:24.74]Can't you see?
[01:28.94]I don't wanna slow dance
[01:35.62]In the dark, dark
[01:48.27]When you gotta run
[01:51.30]Just hear my voice in you (My voice in you)
[01:57.27]Shutting me out of you (shutting me out of you)
[02:02.33]Doing so great (So great, so great)
[02:06.11]You
[02:09.28]Used to be the one to hold you when you fall
[02:16.93]Yeah, yeah, yeah (When you fall, when you fall)
[02:18.89]I don't fuck with your tone (I don't fuck with your tone)
[02:21.73]I don't wanna go home (I don't wanna go home)
[02:24.19]Can it be one night?
[02:26.40]Can you?
[02:29.14]Can you?
[02:33.05]Give me reasons we should be complete
[02:38.64]You should be with him, I can't compete
[02:44.11]You looked at me like I was someone else, oh well
[02:51.22]Can't you see?
[02:56.49]I don't wanna slow dance (I don't wanna slow dance)
[03:01.89]In the dark, dark
[03:12.69]In the dark, dark`
    },
    {
        id: "8",
        title: "Good Days",
        artist: "SZA",
        album: "Good Days",
        duration: "4:39",
        cover: "/musicalbumphoto/SZA - SOS.jpg",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/SZA-GoodDays.mp3",
        lyrics: [
            { time: 0, text: "Good day in my mind, safe to take a step out" },
            { time: 30, text: "Get some air, let it out" }
        ],
        lrcContents: `[id: pshzyvyv]
[ti:Good Days]
[ar:SZA]
[al:Good Days]
[length: 4:39]

[00:22.30]Good day in my mind, 
[00:24.60]safe to take a step out
[00:26.10]Get some air now, let yo edge out
[00:28.80]Too soon, I spoke - you
[00:30.50]You be heavy in my mind, 
[00:32.30]Can you get the heck out?
[00:33.70]I need rest now, got me bummed out
[00:36.70]You so, you so, you
[00:38.60]Baby, baby, babe
[00:40.50]I've been on my empty mind shit

[00:44.90]I try to keep from losin' the rest of me
[00:48.70]I worry that I wasted 
[00:51.20]The best of me on you, babe
[00:52.90]You don't care
[00:54.30]Said, "Not tryna be a nuisance, this is urgent"
[00:58.10]Tryna make sense of loose change
[01:00.70]Got me a war in my mind
[01:02.90]Gotta let go of weight, 
[01:04.70]can't keep what's holdin' me
[01:06.00]Choose to watch 
[01:07.50]while the world break up in front of me

[01:10.00]All the while, 
[01:12.00]I'll await my armored fate with a smile
[01:15.10]I still wanna try, still believe in
[01:18.20]Good days, good days, always
[01:21.60]Always inside
[01:23.70]Good day living in my mind
[01:26.00]Tell me I'm not my fears, my limitations
[01:30.60]I disappear if you let me
[01:33.70]Feelin' like, yeah (On your own)
[01:35.30]Feelin' like Jericho
[01:36.80]Feelin' like Job when he lost his shit
[01:39.20]Gotta hold my own, my cross to bear alone, I
[01:41.90]Ooh, played and dipped, 
[01:44.40]way to kill the mood
[01:46.70]Know you like that shit
[01:49.30]Can't groove it, ba-baby
[01:52.20]Heavy on my empty mind shit

[01:56.20]I gotta keep from losin' the rest of me
[02:00.10]Still worry that I wasted 
[02:02.60]The best of me on you, babe
[02:05.00]You don't care!
[02:06.30]Said, "Not tryna be a nuisance, this is urgent"
[02:09.80]Tryna make sense of loose change
[02:12.20]Got me a war in my mind
[02:14.20]Gotta let go of weight, 
[02:16.20]can't keep what's holdin' me
[02:18.10]Choose to watch 
[02:19.50]while the world break up in front of me

[02:21.60]All the while,
[02:23.00]I'll await my armored fate with a smile
[02:25.80]I still wanna try, still believe in
[02:29.70]Good days, good days, always 
[02:32.30]Sunny inside
[02:34.90]Good day living in my mind
[02:37.00]Gotta get right
[02:38.40]Tryna free my mind 
[02:39.70]before the end of the world
[02:41.80]I don't miss no ex, I don't miss no text
[02:43.90]I choose not to respond
[02:45.70]I don't regret, just pretend 
[02:47.40]shit never happened
[02:48.50]Half of us layin' waste to our youth, 
[02:51.50]it's in the present
[02:53.10](Na-na, na-na, na-na, na)
[02:56.20]Half of us chasin' fountains of youth 
[03:00.00]and it's in the present now

[04:00.50]Always in my mind, 
[04:02.30]always in my mind, mind
[04:04.00]You've been making me feel like I'm
[04:08.90]Always in my mind, 
[04:10.30]always in my mind, mind`
    },
    {
        id: "9",
        title: "About You",
        artist: "The 1975",
        album: "Being Funny in a Foreign Language",
        duration: "5:26",
        cover: "/musicalbumphoto/The 1975 - Being Funny In A Foreign Language.jpg",
        audioUrl: "https://aoumvyjzxiucihncptnz.supabase.co/storage/v1/object/public/music/The1975-AboutYou.mp3",
        lyrics: [
            { time: 0, text: "I know a place, it's somewhere I go" },
            { time: 30, text: "When I need to be alone" }
        ],
        lrcContents: `[id: pshzocyh]
[ar: The 1975]
[al: Being Funny In a Foreign Language]
[ti: About You]
[au: Matthew Healy & George Daniel]
[length: 05:26]

[00:44.85]I know a place
[00:54.53]It's somewhere I go when I need to remember your face
[01:04.16]We get married in our heads
[01:14.77]Something to do while we try to recall how we met

[01:24.21]Do you think I have forgotten?
[01:29.22]Do you think I have forgotten?
[01:34.12]Do you think I have forgotten about you?

[01:44.27]You and I
[01:49.12]Were alive
[01:54.44]With nothing to do I could lay and just look in your eyes
[02:04.81]Wait and pretend
[02:14.84]Hold on and hope that we'll find our way back in the end

[02:24.28]Do you think I have forgotten?
[02:29.16]Do you think I have forgotten?
[02:34.10]Do you think I have forgotten about you?
[02:44.25]Do you think I have forgotten?
[02:49.23]Do you think I have forgotten?
[02:54.12]Do you think I have forgotten about you?

[03:04.60]There was something about you that now I can't remember
[03:09.51]It's the same damn thing that made my heart surrender
[03:14.51]And I'll miss you on a train
[03:16.98]I'll miss you in the morning
[03:19.50]I never know what to think about

[03:23.63]I think about you
[03:29.23]About you
[03:34.24]Do you think I have forgotten about you?
[03:44.17]About you
[03:49.30]About you
[03:54.22]Do you think I have forgotten about you?`
    }
];

