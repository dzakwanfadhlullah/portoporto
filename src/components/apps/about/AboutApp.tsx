"use client";

import { useState, useRef, useEffect } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Code2,
    Trophy,
    Wrench,
    Linkedin,
    Mail,
    Github,
    ExternalLink
} from "lucide-react";
import Image from "next/image";

// ─── Constants & Types ───────────────────────────────────────────────────────

type SectionId = "intro" | "build" | "awards" | "skills";

interface NavItem {
    id: SectionId;
    label: string;
    icon: any;
}

const NAV_ITEMS: NavItem[] = [
    { id: "intro", label: "I'm Dzakwan", icon: User },
    { id: "build", label: "What I Build", icon: Code2 },
    { id: "awards", label: "Awards & Press", icon: Trophy },
    { id: "skills", label: "Skills & Tools", icon: Wrench },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AboutApp() {
    const [activeSection, setActiveSection] = useState<SectionId>("intro");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Observer to update active section on scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const sections = NAV_ITEMS.map(item => document.getElementById(`section-${item.id}`));

        const observerOptions = {
            root: container,
            rootMargin: "-20% 0px -70% 0px",
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id.replace("section-", "") as SectionId);
                }
            });
        }, observerOptions);

        sections.forEach(section => section && observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: SectionId) => {
        const element = document.getElementById(`section-${id}`);
        if (element && scrollContainerRef.current) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="h-full bg-background/80 backdrop-blur-xl flex flex-col overflow-hidden">
            <Group orientation="horizontal" className="h-full">
                {/* ── Sidebar Panel ────────────────────────────────────────── */}
                <Panel defaultSize={25} minSize={20} maxSize={35} className="bg-muted/30 border-r border-border/40">
                    <div className="flex flex-col h-full p-4 gap-6">
                        <div className="px-4 py-2">
                            <h2 className="text-xl font-black tracking-tight text-foreground/80">
                                About me
                            </h2>
                        </div>

                        <nav className="flex flex-col gap-1">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${activeSection === item.id
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/5"
                                        }`}
                                >
                                    {activeSection === item.id && (
                                        <motion.div
                                            layoutId="active-about-pill"
                                            className="absolute inset-0 bg-[#D26D4D] rounded-xl shadow-lg shadow-[#D26D4D]/20"
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}
                                    <item.icon size={16} className="relative z-10" strokeWidth={2.5} />
                                    <span className="relative z-10 text-[13px] font-bold tracking-tight">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </Panel>

                <Separator className="w-[1px] bg-border/20 hover:bg-primary/40 transition-colors" />

                {/* ── Main Content Panel ───────────────────────────────────── */}
                <Panel className="bg-transparent">
                    <div
                        ref={scrollContainerRef}
                        className="h-full overflow-y-auto scroll-smooth snap-y snap-proximity px-12 pb-24"
                    >
                        {/* ── Intro Section ────────────────────────────────── */}
                        <section id="section-intro" className="snap-start pt-16 min-h-[80%]">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="text-5xl font-black tracking-tighter leading-[0.9] mb-12 max-w-[600px]">
                                    Hello, my name is <span className="text-[#D26D4D]">Dzakwan</span> — I&apos;m a <span className="text-[#D26D4D]">frontend & mobile engineer.</span>
                                </h1>

                                {/* Gallery Placeholder Grid */}
                                <div className="grid grid-cols-3 gap-4 mb-16">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-muted border border-border/40 shadow-xl group">
                                            <Image
                                                src={`https://images.unsplash.com/photo-162${i === 1 ? '00673391' : i === 2 ? '0067340' : '0067341'}-850658428841?w=800&q=80`}
                                                alt="About image"
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-16">
                                    <div className="space-y-6">
                                        <h3 className="text-xs uppercase tracking-widest font-bold text-primary">What I Do</h3>
                                        <p className="text-xl font-medium text-muted-foreground leading-relaxed">
                                            Final-year Computer Science student at Universitas Padjadjaran specializing in Front-End and Mobile Development.
                                            I build performant, beautiful, and accessible digital experiences.
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-xs uppercase tracking-widest font-bold text-primary">My Approach</h3>
                                        <p className="text-lg text-muted-foreground/80 leading-relaxed font-medium italic border-l-2 border-primary/20 pl-6">
                                            &ldquo;I believe technology should serve human needs elegantly. I start by understanding the user and project goals, then iterate concepts until I find the perfect balance of form and function.&rdquo;
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-16 flex items-center gap-4">
                                    <SocialLink icon={Linkedin} href="https://linkedin.com" />
                                    <SocialLink icon={Github} href="https://github.com" />
                                    <SocialLink icon={Mail} href="mailto:example@gmail.com" />
                                    <div className="h-[1px] flex-1 bg-border/20 mx-4" />
                                </div>
                            </motion.div>
                        </section>

                        {/* ── Build Section ────────────────────────────────── */}
                        <section id="section-build" className="snap-start pt-32 min-h-[60%]">
                            <h2 className="text-xs uppercase tracking-[0.2em] font-black text-[#D26D4D] mb-8">
                                What I Build
                            </h2>
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <p className="text-2xl font-black tracking-tight leading-tight">
                                        Crafting seamless experiences from mobile to web.
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        I specialize in Flutter for mobile apps and Next.js for high-performance web applications,
                                        focusing on clean architecture and motion design.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <ExpertiseCard title="Mobile Architecture" desc="Clean architecture, Flutter, Dart" />
                                    <ExpertiseCard title="Web Performance" desc="Optimized Next.js, SEO, Core Web Vitals" />
                                    <ExpertiseCard title="Motion Design" desc="Framer Motion, animations, micro-interactions" />
                                </div>
                            </div>
                        </section>

                        {/* ── Awards Section ────────────────────────────────── */}
                        <section id="section-awards" className="snap-start pt-32 min-h-[40%]">
                            <h2 className="text-xs uppercase tracking-[0.2em] font-black text-[#D26D4D] mb-12">
                                Awards & Press
                            </h2>
                            <div className="group bg-muted/20 border border-border/40 p-8 rounded-3xl hover:bg-muted/30 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
                                            July 2023
                                        </span>
                                        <h3 className="text-3xl font-black tracking-tight">UBB National Trading Competition 3.0</h3>
                                    </div>
                                    <Trophy className="text-[#D26D4D]" size={32} />
                                </div>
                                <p className="text-lg text-muted-foreground font-medium">1st Place — National Competition</p>
                            </div>
                        </section>

                        {/* ── Skills Section ────────────────────────────────── */}
                        <section id="section-skills" className="snap-start pt-32 min-h-screen">
                            <h2 className="text-xs uppercase tracking-[0.2em] font-black text-[#D26D4D] mb-12">
                                Skills & Tools
                            </h2>
                            <div className="grid grid-cols-2 gap-16">
                                <SkillGroup title="Programming" items={["Python", "C++", "JavaScript", "Kotlin", "Dart", "TypeScript"]} />
                                <SkillGroup title="Frameworks" items={["Flutter", "Jetpack Compose", "Next.js", "React.js", "Tailwind CSS", "ML Kit"]} />
                                <SkillGroup title="Tools" items={["Git", "GitHub", "Supabase", "MySQL", "VSCode", "Android Studio"]} />
                                <SkillGroup title="Design" items={["UI/UX Design", "Figma", "Prototyping", "Wireframing"]} />
                            </div>
                        </section>
                    </div>
                </Panel>
            </Group>
        </div>
    );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function SocialLink({ icon: Icon, href }: { icon: any; href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        >
            <Icon size={18} />
        </a>
    );
}

function ExpertiseCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-4 rounded-2xl bg-muted/10 border border-border/20 flex flex-col gap-0.5">
            <span className="text-sm font-bold text-foreground">{title}</span>
            <span className="text-xs text-muted-foreground">{desc}</span>
        </div>
    );
}

function SkillGroup({ title, items }: { title: string, items: string[] }) {
    return (
        <div className="space-y-4">
            <h3 className="text-[11px] uppercase tracking-wider font-bold text-foreground/40">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {items.map(item => (
                    <span
                        key={item}
                        className="px-3 py-1 bg-muted/30 border border-border/20 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
