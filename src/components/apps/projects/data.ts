export interface Project {
    id: string;
    name: string;
    role: string;
    brand: string;
    year: string;
    description: string;
    thumbnail: string;
    tags: string[];
}

export const projects: Project[] = [
    {
        id: "liftnode",
        name: "LiftNode",
        role: "Mobile App Dev & UI/UX",
        brand: "Personal Project",
        year: "2025",
        description: "Personal workout app with offline-first architecture, Bento-grid dashboard, real-time charts",
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
        tags: ["Flutter", "Dart", "Bento Grid"],
    },
    {
        id: "luminacal",
        name: "LuminaCal",
        role: "Android Dev & UI/UX",
        brand: "Personal Project",
        year: "2025",
        description: "AI calorie tracker with CameraX + ML Kit food recognition, Glassmorphism UI, Activity Ring animations",
        thumbnail: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80",
        tags: ["Kotlin", "Compose", "AI"],
    },
    {
        id: "kelas-kampus",
        name: "Kelas Kampus",
        role: "Frontend Dev & UI/UX",
        brand: "Freelance",
        year: "2025",
        description: "SNBT preparation platform with CBT simulation, analytics dashboard, 20+ responsive screens",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        tags: ["Next.js", "Tailwind", "Frontend"],
    },
    {
        id: "kpi-dashboard",
        name: "KPI Dashboard",
        role: "Software Dev",
        brand: "Bukit Asam",
        year: "2026",
        description: "Real-time KPI dashboard with smart Excel ingestion, bottleneck heatmap, DEV calculation engine",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bb848a4f691f?w=800&q=80",
        tags: ["Next.js", "FastAPI", "Excel"],
    },
    {
        id: "maqdis-design",
        name: "Maqdis Design System",
        role: "UI/UX Designer",
        brand: "Maqdis",
        year: "2026",
        description: "50+ reusable components, 20+ wireframes, usability testing",
        thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80",
        tags: ["Figma", "UI/UX", "System"],
    },
];
