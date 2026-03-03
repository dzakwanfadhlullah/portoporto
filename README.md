# DzakOS — A Desktop Experience Built for the Web 🚀

Check it out here: **[portofolio-dzak.vercel.app](https://portofolio-dzak.vercel.app)**

***

Most portfolios are just static grids—a list of links that you scroll through and forget. I wanted to build something that felt **alive**.

**DzakOS** is my take on a browser-based operating system, heavily inspired by the refined aesthetics and fluid physics of **macOS**. It’s not just a website; it’s a functional, interactive workspace designed to tell a story through a familiar interface.

### The "Desktop" Philosophy
I didn't want to just copy the look; I wanted to replicate the **feel**. The goal was to make the browser feel like a real environment where you can actually "work."
- **Functional Windowing**: These aren't just pop-ups. You can drag, resize, stack, and minimize windows. Each app has its own state and behavior.
- **The "Squishy" Dock**: It’s interactive, magnified, and weighted. It feels organic because every movement is backed by actual physics (not just static transitions).
- **Deep Search (Spotlight)**: Press a shortcut and find anything instantly. Powered by *Fuse.js*, it handles fuzzy searching across all apps and commands.
- **Premium Aesthetics**: Every icon, shadow, and glassmorphism effect was hand-tuned to match that high-end *Apple* vibe.

### Optimized for the "Side-Handed" Mobile Experience
Mobile design is often an afterthought for desktop-heavy projects, but for DzakOS, I reimagined the layout:
- **The Vertical Side-Dock**: On mobile, having a dock at the bottom eats up valuable vertical real estate. I shifted it to the **left side**—perfect for one-handed thumb navigation while keeping the center of the screen clear.
- ** distraction-Free View**: I’ve stripped away the status bar (clock, battery, wifi) on mobile. When you’re on your phone, you want to see the project, not your battery percentage. It's clean, immersive, and focused.

### What’s Under the Hood?
Building a simulation this complex without it feeling "laggy" requires a very specific stack:
- **Next.js 16 (Turbopack)**: Pushing the edge with the latest builds for lightning-fast refresh rates.
- **Framer Motion**: This is the "magic sauce" behind the organic window movement and dock magnification.
- **Zustand**: A lightweight state engine that handles everything from window positions to system-wide theme toggles.
- **Tailwind CSS**: For high-performance, utility-first styling that stays sharp on any retina display.


***

*Built with an obsessive focus on detail by **Dzakwan Fadhlullah**. Because the best web experiences shouldn't feel like a website—they should feel like a destination.*
