"use client";

import { motion } from "framer-motion";
import {
    Mail,
    Phone,
    Linkedin,
    Globe,
    MapPin,
    Download,
    Send,
    MessageSquare,
    User,
    AtSign
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactApp() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Message sent! I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitting(false);
    };

    const handleDownloadCV = () => {
        // In a real app, this would be a link to a PDF in the public folder
        toast.info("Downloading Dzakwan's CV...");
        // window.open('/path-to-cv.pdf', '_blank');
    };

    return (
        <div className="h-full bg-background flex flex-col md:flex-row overflow-hidden selection:bg-primary/20">
            {/* ── Left Side: Contact Info ────────────────────────────────── */}
            <div className="flex-1 p-12 flex flex-col justify-center bg-muted/20">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-[#D26D4D]/10 flex items-center justify-center text-[#D26D4D] mb-6">
                            <MessageSquare size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter mb-4">Let&apos;s talk.</h1>
                        <p className="text-lg text-muted-foreground font-medium max-w-[400px]">
                            Have a project in mind or just want to say hi? I&apos;m always open to new opportunities.
                        </p>
                    </div>

                    <div className="space-y-6 mb-12">
                        <ContactItem
                            icon={Mail}
                            label="Email"
                            value="dzakwanfadlullah@gmail.com"
                            href="mailto:dzakwanfadlullah@gmail.com"
                        />
                        <ContactItem
                            icon={Phone}
                            label="Phone"
                            value="(+62) 859 4752 7937"
                            href="tel:+6285947527937"
                        />
                        <ContactItem
                            icon={Linkedin}
                            label="LinkedIn"
                            value="Dzakwan Fadhlullah"
                            href="https://linkedin.com/in/DzakwanFadhlullah"
                        />
                        <ContactItem
                            icon={Globe}
                            label="Portfolio"
                            value="bit.ly/Dzakwan-Portofolio"
                            href="https://bit.ly/Dzakwan-Portofolio"
                        />
                        <ContactItem
                            icon={MapPin}
                            label="Location"
                            value="Bandung, Indonesia"
                        />
                    </div>

                    <button
                        onClick={handleDownloadCV}
                        className="group flex items-center gap-3 bg-[#D26D4D] text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-[#D26D4D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Download size={18} />
                        Download CV
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white animate-pulse" />
                    </button>
                </motion.div>
            </div>

            {/* ── Right Side: Contact Form ───────────────────────────────── */}
            <div className="flex-1 p-12 flex flex-col justify-center bg-background border-l border-border/10">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-[480px] w-full mx-auto"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 ml-1">
                                Your Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-[#D26D4D] transition-colors" size={18} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Johnny Appleseed"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-muted/30 border border-border/40 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-[#D26D4D]/40 focus:bg-muted/50 transition-all placeholder:text-muted-foreground/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-[#D26D4D] transition-colors" size={18} />
                                <input
                                    required
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-muted/30 border border-border/40 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-[#D26D4D]/40 focus:bg-muted/50 transition-all placeholder:text-muted-foreground/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 ml-1">
                                Message
                            </label>
                            <textarea
                                required
                                rows={5}
                                placeholder="Tell me about your project..."
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-muted/30 border border-border/40 rounded-2xl p-6 text-sm font-bold focus:outline-none focus:border-[#D26D4D]/40 focus:bg-muted/50 transition-all placeholder:text-muted-foreground/30 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-3 bg-foreground text-background py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
                        >
                            {isSubmitting ? (
                                <div className="flex gap-1.5 items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-background animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-background animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-background animate-bounce" />
                                </div>
                            ) : (
                                <>
                                    Send Message
                                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

function ContactItem({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
    const content = (
        <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-[#D26D4D] group-hover:border-[#D26D4D]/20 transition-all shadow-sm">
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors">
                    {label}
                </p>
                <p className="text-sm font-bold text-foreground group-hover:text-[#D26D4D] transition-colors">
                    {value}
                </p>
            </div>
        </div>
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return content;
}
