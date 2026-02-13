"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useWindowStore } from "@/stores/useWindowStore";

// ─── Constants & Types ───────────────────────────────────────────────────────

type SectionId = "intro" | "offer" | "awards" | "clients";

interface NavItem {
    id: SectionId;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: "intro", label: "I'm Dzakwan" },
    { id: "offer", label: "What I Offer" },
    { id: "awards", label: "Awards & Press" },
    { id: "clients", label: "Clients" },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AboutApp() {
    const [activeSection, setActiveSection] = useState<SectionId>("intro");

    const windows = useWindowStore((s) => s.windows);
    const closeWindow = useWindowStore((s) => s.closeWindow);
    const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
    const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
    const restoreWindow = useWindowStore((s) => s.restoreWindow);

    const windowId = Object.keys(windows).find(id => windows[id]?.appId === "about") as any;
    const win = windowId ? windows[windowId] : null;

    if (!win) return null;

    return (
        <div className="h-full bg-white flex flex-row overflow-hidden font-sans border border-black/10 rounded-[16px] shadow-sm select-none">
            {/* ── Sidebar ────────────────────────────────────────── */}
            <div className="w-[200px] shrink-0 bg-[#EFEBE6] border-r border-black/5 flex flex-col pt-4 px-3 pb-2 window-drag-handle cursor-default">
                <div className="flex items-center gap-[7px] mb-8 px-2 relative z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); closeWindow(windowId); }}
                        className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/5 hover:brightness-90 transition-all flex items-center justify-center cursor-pointer"
                    />
                    <button
                        onClick={(e) => { e.stopPropagation(); minimizeWindow(windowId); }}
                        className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/5 hover:brightness-90 transition-all flex items-center justify-center cursor-pointer"
                    />
                    <button
                        onClick={(e) => { e.stopPropagation(); win.isMaximized ? restoreWindow(windowId) : maximizeWindow(windowId); }}
                        className="w-3 h-3 rounded-full bg-[#28C840] border border-black/5 hover:brightness-90 transition-all flex items-center justify-center cursor-pointer"
                    />
                </div>

                <h2 className="text-[11px] font-bold tracking-tight text-black/25 uppercase px-2 mb-4">
                    About me
                </h2>

                <nav className="flex flex-col gap-0.5 relative z-20">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={(e) => { e.stopPropagation(); setActiveSection(item.id); }}
                            className={`relative flex items-center px-4 py-1.5 transition-colors duration-200 group text-[13px] font-semibold rounded-md cursor-pointer ${activeSection === item.id
                                ? "text-black"
                                : "text-black/50 hover:text-black"
                                }`}
                        >
                            {activeSection === item.id && (
                                <motion.div
                                    layoutId="active-about-bar"
                                    className="absolute inset-0 bg-[#FFD600] rounded-md shadow-sm"
                                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                />
                            )}
                            <span className="relative z-10">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* ── Main Content Area ───────────────────────────────────── */}
            <div className="flex-1 h-full bg-white relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="h-full w-full overflow-y-auto hide-scrollbar"
                    >
                        <div className="w-full max-w-[800px] mx-auto px-10 pt-12 pb-16">
                            {activeSection === "intro" && <IntroView />}
                            {activeSection === "offer" && <OfferView />}
                            {activeSection === "awards" && <AwardsView />}
                            {activeSection === "clients" && <ClientsView />}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── View Components ────────────────────────────────────────────────────────

function IntroView() {
    return (
        <div className="w-full">
            <h1 className="text-[22px] sm:text-[26px] font-bold tracking-tight leading-snug mb-6">
                Hello, my name is <span className="text-[#007AFF]">Dzakwan</span> — I&apos;m a <span className="text-[#FF3B30] bg-[#FFF0F0] px-1.5 py-0.5 rounded-md">creative designer.</span>
            </h1>

            <div className="grid grid-cols-3 gap-3 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[3/4] relative rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-black/5">
                        <div className="absolute inset-0 flex items-center justify-center text-black/10 text-[10px] font-bold uppercase">Portrait {i}</div>
                        <Image
                            src={`https://images.unsplash.com/photo-${i === 1 ? '1534528741775-53994a69daeb' : i === 2 ? '1506794778202-cad84cf45f1d' : '1507003211169-0a1dd7228f2d'}?w=400&h=533&q=80&fit=crop`}
                            alt="About image"
                            fill
                            className="object-cover relative z-10"
                            sizes="(max-width: 1024px) 30vw, 250px"
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-[13px] font-bold text-black uppercase opacity-60">What I Do</h3>
                        <p className="text-[14px] text-black/80 leading-relaxed font-medium">
                            I craft websites, visual identities, and interactive projects that are both
                            beautiful and user-friendly. My work focuses on translating complex
                            ideas into clear, engaging experiences.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[13px] font-bold text-black uppercase opacity-60">My Approach</h3>
                        <p className="text-[14px] text-black/80 leading-relaxed font-medium">
                            I believe design should tell a story and solve problems. I start by
                            understanding the user and project goals, then iterate concepts until I
                            find the perfect balance of form and function.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[13px] font-bold text-black uppercase opacity-60">Connect</h3>
                    <div className="flex flex-col gap-3">
                        <TextSocialLink label="Instagram" href="https://instagram.com" />
                        <TextSocialLink label="X (Twitter)" href="https://twitter.com" />
                        <TextSocialLink label="LinkedIn" href="https://linkedin.com" />
                        <TextSocialLink label="GitHub" href="https://github.com" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function OfferView() {
    return (
        <div className="w-full">
            <h2 className="text-[22px] sm:text-[26px] font-bold mb-8 tracking-tight">What I Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                <OfferItem title="UI/UX Design" desc="Focusing on user-centric interfaces and seamless interactions." />
                <OfferItem title="Web Development" desc="High-performance, responsive websites built with modern tech." />
                <OfferItem title="Visual Identity" desc="Crafting unique visual stories for products and companies." />
                <OfferItem title="Art Direction" desc="Leading creative vision for digital and physical projects." />
            </div>
        </div>
    );
}

function AwardsView() {
    return (
        <div className="w-full">
            <h2 className="text-[22px] sm:text-[26px] font-bold mb-8 tracking-tight">Awards & Press</h2>
            <div className="grid grid-cols-1 gap-1">
                < AwardItem year="2024" title="Site of the Year" source="Awwwards" />
                <AwardItem year="2023" title="Design Excellence" source="Behance" />
                <AwardItem year="2023" title="Mobile App of the month" source="FWA" />
                <AwardItem year="2022" title="Young Talent Award" source="Adobe" />
            </div>
        </div>
    );
}

function ClientsView() {
    return (
        <div className="w-full">
            <h2 className="text-[22px] sm:text-[26px] font-bold mb-8 tracking-tight">Selected Clients</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {['Apple', 'Stripe', 'Nike', 'Vercel', 'Linear', 'Airbnb'].map(client => (
                    <div key={client} className="p-8 rounded-2xl bg-[#F5F5F7] border border-black/5 flex items-center justify-center font-bold text-[18px] text-black/30 grayscale hover:grayscale-0 hover:bg-white hover:shadow-md transition-all">
                        {client}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Helpers ───────────────────────────────────────────────────────────

function TextSocialLink({ label, href }: { label: string; href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-[#007AFF] hover:underline w-fit font-semibold"
        >
            {label}
        </a>
    );
}

function OfferItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="space-y-2">
            <h4 className="font-bold text-[16px]">{title}</h4>
            <p className="text-[13px] text-black/50 leading-relaxed font-medium">{desc}</p>
        </div>
    );
}

function AwardItem({ year, title, source }: { year: string, title: string, source: string }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-black/5 hover:bg-[#F5F5F7]/50 px-4 -mx-4 rounded-xl transition-all">
            <div className="flex flex-col">
                <span className="text-[15px] font-bold">{title}</span>
                <span className="text-[13px] text-black/40 font-medium">{source}</span>
            </div>
            <span className="text-[13px] font-bold text-black/30 bg-[#F5F5F7] px-3 py-1 rounded-full">{year}</span>
        </div>
    );
}
