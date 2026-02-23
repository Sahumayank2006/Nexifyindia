"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Github,
  Twitter,
  Mail,
  Heart,
  Award,
  Users,
  TrendingUp,
} from "lucide-react";

export default function Footer() {
  const links = {
    platform: [
      { name: "Problem Portal", href: "#problems" },
      { name: "Pattern Visualizer", href: "#patterns" },
      { name: "Warning Dashboard", href: "#warnings" },
      { name: "Campus Pulse", href: "#pulse" },
    ],
    community: [
      { name: "Wisdom Feed", href: "#wisdom" },
      { name: "Achievements", href: "#gamification" },
      { name: "Leaderboard", href: "#gamification" },
      { name: "Alumni Portal", href: "#" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-950 pointer-events-none" />

      {/* Links Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 relative">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="font-heading font-bold text-lg">
              Campus<span className="text-saffron">Memory</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            The first self-learning college platform. Where every student&apos;s
            experience becomes permanent wisdom.
          </p>
          
          {/* Feature Badges with Icons */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-green-400" />
              </div>
              <span>AI-Powered Insights</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                <Users className="w-3 h-3 text-purple-400" />
              </div>
              <span>Community Driven</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center">
                <Award className="w-3 h-3 text-yellow-400" />
              </div>
              <span>Gamified Learning</span>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Platform */}
        <div>
          <h4 className="font-heading font-semibold mb-4 text-sm">
            Platform
          </h4>
          <ul className="space-y-2">
            {links.platform.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-saffron transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className="font-heading font-semibold mb-4 text-sm">
            Community
          </h4>
          <ul className="space-y-2">
            {links.community.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-saffron transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-heading font-semibold mb-4 text-sm">
            Resources
          </h4>
          <ul className="space-y-2">
            {links.resources.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-saffron transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2025 Campus Memory. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-current" />{" "}
            for Indian campuses
          </p>
        </div>
      </div>
    </footer>
  );
}
