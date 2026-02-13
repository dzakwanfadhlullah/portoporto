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
        id: "agents",
        name: "Agents",
        role: "Framer",
        brand: "Web Design",
        year: "2025",
        description: "AI-driven autonomous agents platform with real-time process visualization",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        tags: ["Framer", "AI", "React"],
    },
    {
        id: "portia",
        name: "Portia",
        role: "Framer",
        brand: "Web Design",
        year: "2024",
        description: "Minimalist fashion e-commerce with high-end editorial layout",
        thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
        tags: ["Design", "E-commerce"],
    },
    {
        id: "cosmos",
        name: "Cosmos",
        role: "Galactic",
        brand: "Branding",
        year: "2025",
        description: "Space exploration dashboard and visual identity system",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        tags: ["Branding", "UI/UX"],
    },
    {
        id: "showu",
        name: "Showu",
        role: "Framer",
        brand: "Web Design",
        year: "2024",
        description: "Portfolio platform for creative professionals with custom transitions",
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
        tags: ["Framer", "Portfolio"],
    },
    {
        id: "dream",
        name: "Dream",
        role: "Academy",
        brand: "Social Media",
        year: "2024",
        description: "Social networking app focused on structured goal sharing",
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        tags: ["Mobile", "Community"],
    },
    {
        id: "swifty",
        name: "Swifty",
        role: "Framer",
        brand: "Web Design",
        year: "2024",
        description: "Ultra-fast delivery service landing page with 3D animations",
        thumbnail: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80",
        tags: ["Framer", "Animation"],
    },
    {
        id: "desert",
        name: "Desert",
        role: "Lume",
        brand: "Visual Identity",
        year: "2023",
        description: "Organic skincare brand branding and packaging design",
        thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        tags: ["Packaging", "Natural"],
    },
    {
        id: "moon",
        name: "Moon",
        role: "Galactic",
        brand: "Creative Direction",
        year: "2025",
        description: "Cinematic production studio website with immersive storytelling",
        thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
        tags: ["Cinema", "Web Design"],
    },
];
