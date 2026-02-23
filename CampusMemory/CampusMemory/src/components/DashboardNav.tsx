/**
 * Dashboard Navigation Component
 * Quick access to all event management dashboards
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, GraduationCap, BookOpen, Home } from 'lucide-react';

export default function DashboardNav() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      color: 'bg-blue-500'
    },
    {
      name: 'Dashboards',
      href: '/dashboard',
      icon: Calendar,
      color: 'bg-gray-500',
      description: 'All Dashboards'
    },
    {
      name: 'Events',
      href: '/events',
      icon: Calendar,
      color: 'bg-indigo-500',
      description: 'Manage Events'
    },
    {
      name: 'Attendance',
      href: '/attendance',
      icon: Users,
      color: 'bg-green-500',
      description: 'Track Attendance'
    },
    {
      name: 'Teacher',
      href: '/teacher',
      icon: BookOpen,
      color: 'bg-purple-500',
      description: 'Grant OD'
    },
    {
      name: 'Student',
      href: '/student',
      icon: GraduationCap,
      color: 'bg-pink-500',
      description: 'My Attendance'
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 tracking-wider uppercase">
              Campus Memory
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-lg shadow-blue-400"></div>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'bg-gradient-to-r from-gray-800/80 to-gray-900/80 text-blue-300 hover:text-blue-100 hover:shadow-lg hover:shadow-blue-500/30 border border-gray-700 backdrop-blur-sm hover:scale-105'
                  }`}
                  title={item.description}
                >
                  {/* Gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <Icon size={18} className={`relative z-10 ${isActive ? 'drop-shadow-lg' : ''}`} />
                  <span className="hidden md:inline font-semibold uppercase tracking-wide text-sm relative z-10">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <>
                      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-200 opacity-70"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-200 opacity-70"></div>
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
