import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dropbox Clone",
  description: "Clone of Dropbox interface to practice with React, Next.js, Tailwind, and Shadcn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <Header />
              {children}
              <Toaster position="bottom-right"/>
              <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
