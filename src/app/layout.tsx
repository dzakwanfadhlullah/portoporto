import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dzakwan — Frontend & Mobile Engineer",
  description:
    "DzakOS — An interactive, OS-inspired portfolio of Dzakwan Fadhlullah. Built with Next.js, TypeScript, and Framer Motion.",
  keywords: [
    "Dzakwan Fadhlullah",
    "Frontend Engineer",
    "Mobile Developer",
    "Portfolio",
    "Next.js",
    "React",
    "Flutter",
    "Kotlin",
  ],
  authors: [{ name: "Dzakwan Fadhlullah" }],
  openGraph: {
    title: "Dzakwan — Frontend & Mobile Engineer",
    description: "An interactive, OS-inspired personal portfolio.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5EFE6" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1917" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--card)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-os-md)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
