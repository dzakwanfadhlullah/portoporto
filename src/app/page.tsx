"use client";

import { Desktop } from "@/components/os/Desktop";
import { motion } from "framer-motion";
import {
  Share,
  Plus,
  Copy,
  Download,
  ShieldCheck,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  ArrowDownCircle,
  Layout
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden flex items-center justify-center bg-[#E5E5E5]">
      {/* ── Studio Background ────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        <div className="absolute bottom-0 w-full h-[30vh] bg-black/5 blur-[100px]" />
      </div>

      {/* ── Safari Window Chrome (High-Fidelity) ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-[95vw] h-[92vh] max-w-[1600px] flex flex-col rounded-2xl overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.3)] bg-white"
      >
        {/* Safari Header */}
        <div className="safari-chrome shrink-0 pr-4">
          {/* Traffic Lights & Sidebar Toggle */}
          <div className="flex items-center gap-4 w-48">
            <div className="flex gap-2.5 ml-1">
              <div className="w-[11.5px] h-[11.5px] rounded-full bg-[#FF5F57] border border-black/5 shadow-sm" />
              <div className="w-[11.5px] h-[11.5px] rounded-full bg-[#FEBC2E] border border-black/5 shadow-sm" />
              <div className="w-[11.5px] h-[11.5px] rounded-full bg-[#28C840] border border-black/5 shadow-sm" />
            </div>
            <div className="text-black/30 hover:text-black/60 cursor-pointer transition-colors ml-2">
              <PanelLeft size={19} strokeWidth={1.5} />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-6 items-center text-black/20">
            <ChevronLeft size={22} strokeWidth={2} />
            <ChevronRight size={22} strokeWidth={2} />
          </div>

          {/* Address Bar */}
          <div className="safari-address-bar mx-4 group">
            <div className="flex items-center gap-1.5 opacity-30 group-hover:opacity-50 transition-opacity">
              <ShieldCheck size={14} strokeWidth={2.5} />
            </div>
            <div className="flex items-center justify-center flex-1 ml--4">
              <span className="text-[13px] font-medium tracking-tight text-black/70">dzakwan.portfolio</span>
            </div>
            <div className="opacity-0 group-hover:opacity-30 transition-opacity">
              <Copy size={13} strokeWidth={2} />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-5 ml-auto text-black/40">
            <div className="opacity-60"><ArrowDownCircle size={20} strokeWidth={1.5} /></div>
            <Share size={20} strokeWidth={1.5} />
            <Plus size={20} strokeWidth={1.5} />
            <Layout size={20} strokeWidth={1.5} />
          </div>
        </div>

        {/* The Actual OS / Inner Viewport */}
        <div className="flex-1 relative overflow-hidden">
          <Desktop />
        </div>
      </motion.div>

      {/* ── Subtle Floor shadow/reflection ────────────────────────────── */}
      <div className="absolute bottom-4 w-[80vw] h-1 bg-black/10 blur-[40px] rounded-full mix-blend-multiply" />
    </main>
  );
}
