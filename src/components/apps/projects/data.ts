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
        id: "bongkarops",
        name: "BongkarOps",
        role: "Fullstack Developer",
        brand: "Operations Dashboard",
        year: "2026",
        description: "Advanced fullstack operations dashboard with real-time analytics and management systems.",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&q=80",
        tags: ["Next.js", "Fullstack", "Dashboard"],
    },
    {
        id: "luminacal",
        name: "LuminaCal",
        role: "Mobile Developer",
        brand: "Mobile App",
        year: "2026",
        description: "Sophisticated calendar and productivity mobile application with smart scheduling features.",
        thumbnail: "https://images.unsplash.com/photo-1506784919141-935049915272?w=800&q=80",
        tags: ["React Native", "Mobile", "Productivity"],
    },
    {
        id: "liftnode",
        name: "LiftNode",
        role: "Mobile Developer",
        brand: "Mobile App",
        year: "2026",
        description: "Fitness and workout tracking mobile platform for enthusiasts and professional athletes.",
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
        tags: ["Mobile", "Health", "Fitness"],
    },
    {
        id: "kelaskampus",
        name: "Kelas Kampus",
        role: "Front-End Developer & UI/UX Designer",
        brand: "Web Platform",
        year: "2025",
        description: "Comprehensive education management platform connecting students and educators seamlessly.",
        thumbnail: "https://images.unsplash.com/photo-1523050335191-51ff08820842?w=800&q=80",
        tags: ["React", "UI/UX", "Education"],
    },
    {
        id: "verda",
        name: "Verda",
        role: "Front-End Developer & UI/UX Designer",
        brand: "Mobile App",
        year: "2025",
        description: "Eco-friendly lifestyle tracking application encouraging sustainable daily habits.",
        thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
        tags: ["Mobile", "Eco", "Sustainability"],
    },
    {
        id: "arguardianforest",
        name: "AR Guardian Forest",
        role: "Asset Creator & Testing Team",
        brand: "AR Game",
        year: "2025",
        description: "Immersive augmented reality experience focused on forest conservation and education.",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
        tags: ["AR", "Game Design", "3D Assets"],
    },
];
