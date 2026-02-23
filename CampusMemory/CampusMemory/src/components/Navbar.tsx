"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Menu,
  X,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { images } from "@/lib/images";

const navItems = [
  { label: "Problems", href: "#problems" },
  { label: "Patterns", href: "#patterns" },
  { label: "Warnings", href: "#warnings" },
  { label: "Pulse", href: "#pulse" },
  { label: "Wisdom", href: "#wisdom" },
  { label: "Achievements", href: "#gamification" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 relative overflow-hidden ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        {/* Background Image Pattern */}
        {scrolled && (
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <img 
              src={images.patterns.abstract1}
              alt="Pattern"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Decorative Gradient */}
        {!scrolled && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-pink-600/20 pointer-events-none" />
        )}
        
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative z-10">
          {/* Logo with Background Circle */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-xl transition-all ${
                scrolled ? "bg-primary/20" : "bg-white/30"
              }`} />
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                scrolled ? "bg-gradient-to-br from-primary to-purple-600" : "bg-white/20 backdrop-blur-sm"
              }`}>
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>
            <span
              className={`font-heading font-bold text-lg ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Campus<span className="text-saffron">Memory</span>
            </span>
            <Sparkles className={`w-4 h-4 ${scrolled ? "text-saffron" : "text-yellow-300"} opacity-70 group-hover:opacity-100 transition-opacity`} />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-gray-600 hover:text-primary hover:bg-primary/5"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg ${
              scrolled ? "text-gray-600" : "text-white"
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 text-sm font-medium"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
