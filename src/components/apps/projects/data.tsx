import type { ReactNode } from "react";

export interface Project {
    id: string;
    name: string;
    role: string;
    brand: string;
    year: string;
    description: ReactNode;
    thumbnail: string;
    tags: string[];
    detailImages?: string[];
}

export const projects: Project[] = [
    {
        id: "bongkarops",
        name: "BongkarOps",
        role: "Fullstack Developer",
        brand: "Operations Dashboard",
        year: "2026",
        description: (
            <div className="space-y-2">
                <p>{"BongkarOPS was developed during my internship as a comprehensive dashboard system for managing coal unloading operations at PT Bukit Asam Tbk. I contributed as a full-stack developer, shaping both the analytical framework and system architecture, ensuring that operational data could move from scattered reports into a structured, real-time view of performance."}</p>
                <p>{"The idea was to turn field operations into clarity. Instead of static spreadsheets, the platform translates unloading activity into visible patterns \u2014 performance trends, bottlenecks, and comparative metrics that reveal where time and efficiency intersect. It isn\u2019t just a monitoring dashboard; it becomes "}<i>{"an operational lens where complexity is distilled into measurable insight"}</i>{", allowing decisions to be grounded in visibility rather than assumption."}</p>
            </div>
        ),
        thumbnail: "/bukit-asam-logo.png",
        tags: ["Next.js", "Fullstack", "Dashboard"],
        detailImages: [
            "/assets/images/about/LoginBongkarOps.png",
            "/assets/images/about/DashboarBongkarOps.png",
            "/assets/images/about/RegistBongkarOps.png",
            "/assets/images/about/identitasoperasiBongkarOps.png",
            "/assets/images/about/ReviewHasilBongkarOps.png"
        ],
    },
    {
        id: "luminacal",
        name: "LuminaCal",
        role: "Mobile Developer",
        brand: "Mobile App",
        year: "2026",
        description: (
            <div className="space-y-2">
                <p>{"For LuminaCal, I designed a privacy-first calorie tracking app built around clarity and control. I shaped the product from system architecture to interface, with the idea of making health data feel "}<i>{"personal and self-contained"}</i>{". Rather than relying on accounts or cloud services, everything lives on the device \u2014 quiet, fast, and intentionally minimal."}</p>
                <p>{"The concept centers on turning metrics into presence. Camera-based food recognition simplifies logging, while activity rings and fluid glass-inspired surfaces translate calories, macros, hydration, and weight trends into something visual and immediate. It isn\u2019t just a tracker \u2014 it feels more like "}<i>{"a private space for awareness"}</i>{", where progress is seen, not imposed."}</p>
            </div>
        ),
        thumbnail: "/luminacal-logo.png",
        tags: ["React Native", "Mobile", "Productivity"],
        detailImages: [
            "/assets/images/about/Home_LuminaCAL.png",
            "/assets/images/about/Camera_LuminaCal.png",
            "/assets/images/about/Stats_LuminaCal.png",
            "/assets/images/about/eXPLORE_lUMINACal (2).png",
            "/assets/images/about/Profile_LuminaCAL.png"
        ],
    },
    {
        id: "liftnode",
        name: "LiftNode",
        role: "Mobile Developer",
        brand: "Mobile App",
        year: "2026",
        description: (
            <div className="space-y-2">
                <p>{"LiftNode began as an attempt to simplify how workouts are remembered. I developed it as a focused, offline-first mobile application where every session, set, and progression is stored locally \u2014 private, immediate, and entirely within the user\u2019s control. My role spanned from defining the product structure to shaping the interface language, ensuring that tracking feels "}<i>{"intentional rather than mechanical"}</i>{"."}</p>
                <p>{"The idea was to treat performance data not as scattered numbers, but as continuity. Real-time logging, structured exercise libraries, and visual performance summaries come together to form a clear rhythm of progress. Instead of overwhelming the user with analytics, the dashboard distills effort into visible patterns \u2014 streaks, volume, milestones. It feels less like a fitness app, and more like "}<i>{"a personal record of discipline taking shape over time"}</i>{"."}</p>
            </div>
        ),
        thumbnail: "/liftnode-logo.png",
        tags: ["Mobile", "Health", "Fitness"],
    },
    {
        id: "kelaskampus",
        name: "Kelas Kampus",
        role: "Front-End Developer & UI/UX Designer",
        brand: "Web Platform",
        year: "2025",
        description: (
            <div className="space-y-2">
                <p>{"Kelas Kampus was developed as a focused preparation platform for UTBK-SNBT candidates, bringing tryouts, analysis, and university guidance into a single system. I worked on shaping the product structure and digital experience, ensuring that complex exam preparation could feel "}<i>{"organized and measurable rather than overwhelming"}</i>{"."}</p>
                <p>{"The idea was to turn preparation into visibility. CBT simulations mirror real exam pressure, while performance dashboards translate scores into patterns \u2014 strengths, gaps, progression. College recommendations extend that data into direction, grounding ambition in probability. Instead of being just another tryout platform, it becomes a structured pathway, where "}<i>{"readiness is not guessed, but gradually revealed"}</i>{"."}</p>
            </div>
        ),
        thumbnail: "/kelas-kampus-clean.png",
        tags: ["React", "UI/UX", "Education"],
    },
    {
        id: "verda",
        name: "Verda",
        role: "Front-End Developer & UI/UX Designer",
        brand: "Mobile App",
        year: "2025",
        description: (
            <p>{"Verda was conceived as an interactive mobile learning space focused on sustainability and responsible consumption. I contributed to shaping its structure and experience, grounding the platform in Global Citizenship Education and Education for Sustainable Development principles. The idea was to make environmental awareness feel "}<i>{"participatory rather than instructional"}</i>{" \u2014 combining illustrated modules, reflective quizzes, and an AI-driven assistant that responds to real questions in real time. Articles, simulations, and progress tracking come together as a continuous learning flow. It feels less like a static educational app, and more like "}<i>{"a guided conversation about living responsibly in a shared world"}</i>{"."}</p>
        ),
        thumbnail: "/verda-logo.png",
        tags: ["Mobile", "Eco", "Sustainability"],
    },
    {
        id: "arguardianforest",
        name: "AR Guardian Forest",
        role: "Asset Creator & Testing Team",
        brand: "AR Game",
        year: "2025",
        description: (
            <p>{"AR Forest Guardian was developed as an augmented reality game that brings forest conservation into the player\u2019s physical space. I worked on shaping the experience so that deforestation isn\u2019t just explained, but "}<i>{"encountered"}</i>{" \u2014 a virtual forest emerging through the camera, vulnerable and alive. The concept balances strategy and action: observing and placing traps during the night phase, then actively protecting trees during the day. Framed by the narrative of "}<i>{"Pamali Rimba"}</i>{", the guardian spirit of the forest, every interaction carries consequence \u2014 conservation builds resilience, failure transforms the landscape into a symbol of loss. It feels less like a conventional game, and more like "}<i>{"a small act of responsibility staged in the real world"}</i>{"."}</p>
        ),
        thumbnail: "/ar-guardian-forest-logo.png",
        tags: ["AR", "Game Design", "3D Assets"],
    },
];
