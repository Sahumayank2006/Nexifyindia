/**
 * Dashboard Quick Access - Landing Page
 */

'use client';

import Link from 'next/link';
import { Calendar, Users, GraduationCap, BookOpen, Sparkles, CheckCircle, QrCode, Award } from 'lucide-react';

export default function DashboardHome() {
  const dashboards = [
    {
      title: 'Event Management',
      description: 'Create and manage events with AI-powered poster analysis',
      href: '/events',
      icon: Calendar,
      color: 'from-indigo-500 to-purple-600',
      features: ['Create Events', 'AI Poster Analysis', 'Sub-user Management']
    },
    {
      title: 'Attendance Tracking',
      description: 'Mark attendance using manual entry, CSV upload, or QR codes',
      href: '/attendance',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      features: ['Manual Entry', 'Bulk CSV Upload', 'QR Code Check-in']
    },
    {
      title: 'Teacher Dashboard',
      description: 'View school events and grant Official Duty (OD) to students',
      href: '/teacher',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-600',
      features: ['School Events', 'Grant OD', 'Attendance Stats']
    },
    {
      title: 'Student Dashboard',
      description: 'View your attendance history and OD status',
      href: '/student',
      icon: GraduationCap,
      color: 'from-pink-500 to-rose-600',
      features: ['Attendance History', 'OD Status', 'Event Participation']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-4">
            <Sparkles className="text-yellow-500" size={20} />
            <span className="text-sm font-semibold text-gray-700">AI-Powered Event Management</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Campus Event System
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete event lifecycle management with AI poster analysis, attendance tracking, and OD management for Amity University
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            
            return (
              <Link
                key={dashboard.href}
                href={dashboard.href}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${dashboard.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {dashboard.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    {dashboard.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {dashboard.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="text-green-500" size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Open Dashboard
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">System Features</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="text-blue-600" size={28} />
              </div>
              <div className="font-semibold text-gray-800">Event CRUD</div>
              <div className="text-sm text-gray-600">Complete Management</div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="text-purple-600" size={28} />
              </div>
              <div className="font-semibold text-gray-800">AI Analysis</div>
              <div className="text-sm text-gray-600">Poster Recognition</div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode className="text-green-600" size={28} />
              </div>
              <div className="font-semibold text-gray-800">QR Check-in</div>
              <div className="text-sm text-gray-600">Easy Attendance</div>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="text-pink-600" size={28} />
              </div>
              <div className="font-semibold text-gray-800">OD System</div>
              <div className="text-sm text-gray-600">Official Duty</div>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">API Server: http://localhost:8001</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <a href="http://localhost:8001/docs" target="_blank" className="text-indigo-600 hover:underline">
              View API Documentation →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
