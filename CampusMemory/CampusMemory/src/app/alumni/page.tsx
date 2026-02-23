"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  UserCheck,
  Users,
  Briefcase,
  MessageCircle,
  Search,
  MapPin,
  Filter,
  Plus,
  X,
  Calendar,
  Heart,
  Send,
  User,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Globe,
  Building2,
  GraduationCap,
  Star,
  Award,
  TrendingUp,
  Bell,
  Settings,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Map,
  List,
  Grid,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Rocket,
  Crown,
  Shield,
} from "lucide-react";

// Types
interface AlumniProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  coverImage?: string;
  graduationYear: number;
  degree: string;
  currentJob: string;
  company: string;
  bio: string;
  skills: string[];
  location: string;
  city: string;
  country: string;
  coordinates?: { lat: number; lng: number };
  linkedin?: string;
  twitter?: string;
  website?: string;
  privacy: "public" | "alumni-only" | "private";
  mentorshipAvailable: boolean;
  points: number;
  badges: string[];
  createdAt: string;
}

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  images?: string[];
  hashtags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface AlumniEvent {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  capacity: number;
  rsvps: { userId: string; status: "yes" | "no" | "maybe" }[];
  createdAt: string;
}

interface Job {
  id: string;
  posterId: string;
  posterName: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  applicationLink?: string;
  applicationInstructions?: string;
  isFilled: boolean;
  applications: JobApplication[];
  createdAt: string;
}

interface JobApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  resume: string;
  coverLetter: string;
  createdAt: string;
}

interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  alumniId: string;
  subject: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Notification {
  id: string;
  userId: string;
  type: "like" | "comment" | "mentorship" | "event" | "message";
  content: string;
  read: boolean;
  createdAt: string;
}

export default function AlumniPage() {
  // State
  const [currentUser, setCurrentUser] = useState<AlumniProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"directory" | "posts" | "events" | "jobs" | "mentorship">("directory");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AlumniProfile | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState<"post" | "event" | "job" | null>(null);
  
  // Data states
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<AlumniEvent[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Filters
  const [filters, setFilters] = useState({
    graduationYear: { min: 1990, max: new Date().getFullYear() },
    industries: [] as string[],
    locations: [] as string[],
    skills: [] as string[],
    mentorshipOnly: false,
  });

  // Load data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("alumniCurrentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const storedAlumni = localStorage.getItem("alumniProfiles");
    if (storedAlumni) {
      setAlumni(JSON.parse(storedAlumni));
    } else {
      // Seed with sample data
      const sampleAlumni: AlumniProfile[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          profilePicture: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=D4AF37&color=fff",
          graduationYear: 2019,
          degree: "Computer Science",
          currentJob: "Senior Software Engineer",
          company: "Google",
          bio: "Passionate about AI and machine learning. Love mentoring students!",
          skills: ["Python", "Machine Learning", "Cloud Architecture"],
          location: "Mountain View, CA",
          city: "Mountain View",
          country: "USA",
          linkedin: "https://linkedin.com/in/sarahjohnson",
          privacy: "public",
          mentorshipAvailable: true,
          points: 1250,
          badges: ["Top Mentor", "Early Adopter"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Rahul Sharma",
          email: "rahul.s@example.com",
          profilePicture: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=059669&color=fff",
          graduationYear: 2020,
          degree: "Business Administration",
          currentJob: "Product Manager",
          company: "Microsoft",
          bio: "Building products that matter. Alumni network enthusiast.",
          skills: ["Product Management", "Strategy", "Data Analysis"],
          location: "Seattle, WA",
          city: "Seattle",
          country: "USA",
          mentorshipAvailable: true,
          points: 890,
          badges: ["Rising Star"],
          privacy: "public",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Emily Chen",
          email: "emily.c@example.com",
          profilePicture: "https://ui-avatars.com/api/?name=Emily+Chen&background=8B5CF6&color=fff",
          graduationYear: 2018,
          degree: "Marketing",
          currentJob: "Marketing Director",
          company: "Meta",
          bio: "Digital marketing expert. Helping startups grow their brand.",
          skills: ["Digital Marketing", "Brand Strategy", "Analytics"],
          location: "New York, NY",
          city: "New York",
          country: "USA",
          mentorshipAvailable: true,
          points: 1580,
          badges: ["Top Contributor", "Mentor of the Year"],
          privacy: "public",
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "David Martinez",
          email: "david.m@example.com",
          profilePicture: "https://ui-avatars.com/api/?name=David+Martinez&background=3B82F6&color=fff",
          graduationYear: 2021,
          degree: "Mechanical Engineering",
          currentJob: "R&D Engineer",
          company: "Tesla",
          bio: "Innovating in sustainable energy. Open to collaborate!",
          skills: ["CAD Design", "Product Development", "Sustainability"],
          location: "Austin, TX",
          city: "Austin",
          country: "USA",
          mentorshipAvailable: false,
          points: 650,
          badges: ["Innovator"],
          privacy: "public",
          createdAt: new Date().toISOString(),
        },
      ];
      setAlumni(sampleAlumni);
      localStorage.setItem("alumniProfiles", JSON.stringify(sampleAlumni));
    }

    // Load posts
    const storedPosts = localStorage.getItem("alumniPosts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }

    // Load events
    const storedEvents = localStorage.getItem("alumniEvents");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }

    // Load jobs
    const storedJobs = localStorage.getItem("alumniJobs");
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    }
  }, []);

  // Filtered alumni
  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesYear =
      alum.graduationYear >= filters.graduationYear.min &&
      alum.graduationYear <= filters.graduationYear.max;
    
    const matchesMentorship = !filters.mentorshipOnly || alum.mentorshipAvailable;
    
    return matchesSearch && matchesYear && matchesMentorship;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700"
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                y: ["-20%", "120%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur transition hover:bg-white/20"
              >
                <Bell className="h-5 w-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </motion.button>

              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-semibold text-white">{currentUser.name}</div>
                    <div className="text-xs text-amber-100">{currentUser.points} points</div>
                  </div>
                  <img
                    src={currentUser.profilePicture}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border-2 border-white/50"
                  />
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileModal(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 font-semibold text-amber-700 shadow-lg transition hover:shadow-xl"
                >
                  <User className="h-4 w-4" />
                  Join Alumni Network
                </motion.button>
              )}
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center text-white">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 mb-6 backdrop-blur"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span className="text-sm font-semibold">Connect • Grow • Give Back</span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-4"
            >
              Alumni Network Portal
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-amber-100 max-w-3xl mx-auto mb-8"
            >
              Your gateway to lifelong connections, career opportunities, and giving back to your alma mater
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {[
                { icon: Users, label: "Alumni", value: alumni.length },
                { icon: Briefcase, label: "Job Openings", value: jobs.filter((j) => !j.isFilled).length },
                { icon: Calendar, label: "Events", value: events.length },
                { icon: MessageCircle, label: "Active Mentors", value: alumni.filter((a) => a.mentorshipAvailable).length },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur rounded-2xl p-4"
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-amber-100">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex gap-1 flex-wrap">
              {[
                { id: "directory", label: "Directory", icon: Users },
                { id: "posts", label: "Community Feed", icon: MessageSquare },
                { id: "events", label: "Events", icon: Calendar },
                { id: "jobs", label: "Job Board", icon: Briefcase },
                { id: "mentorship", label: "Mentorship", icon: Target },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {currentUser && activeTab !== "mentorship" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowCreateModal(true);
                  if (activeTab === "posts") setCreateModalType("post");
                  else if (activeTab === "events") setCreateModalType("event");
                  else if (activeTab === "jobs") setCreateModalType("job");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-semibold text-white shadow-lg transition hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">
                  {activeTab === "posts" && "New Post"}
                  {activeTab === "events" && "Create Event"}
                  {activeTab === "jobs" && "Post Job"}
                  {activeTab === "directory" && "Create"}
                </span>
              </motion.button>
            )}
          </div>

          {/* Directory Tab */}
          {activeTab === "directory" && (
            <div className="p-6">
             {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, company, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none transition"
                  />
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-amber-500 transition font-semibold"
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                  </motion.button>

                  <div className="flex gap-1 border-2 border-gray-200 rounded-xl p-1">
                    {[
                      { mode: "grid", icon: Grid },
                      { mode: "list", icon: List },
                      { mode: "map", icon: Map },
                    ].map(({ mode, icon: Icon }) => (
                      <motion.button
                        key={mode}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setViewMode(mode as any)}
                        className={`p-2 rounded-lg transition ${
                          viewMode === mode ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-gray-50 rounded-xl p-6 mb-6 overflow-hidden"
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Graduation Year Range
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={filters.graduationYear.min}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                graduationYear: { ...filters.graduationYear, min: parseInt(e.target.value) },
                              })
                            }
                            className="w-24 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:outline-none"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="number"
                            value={filters.graduationYear.max}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                graduationYear: { ...filters.graduationYear, max: parseInt(e.target.value) },
                              })
                            }
                            className="w-24 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.mentorshipOnly}
                            onChange={(e) => setFilters({ ...filters, mentorshipOnly: e.target.checked })}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-sm font-semibold text-gray-700">Mentors Only</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Alumni Grid View */}
              {viewMode === "grid" && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAlumni.map((alum, idx) => (
                    <motion.div
                      key={alum.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Cover Image */}
                      <div className="h-24 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 relative">
                        {alum.mentorshipAvailable && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-amber-700 shadow-lg"
                          >
                            <Star className="w-3 h-3 inline mr-1" />
                            Mentor
                          </motion.div>
                        )}
                      </div>

                      {/* Profile Picture */}
                      <div className="relative px-6 -mt-12">
                        <img
                          src={alum.profilePicture}
                          alt={alum.name}
                          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                        />
                      </div>

                      {/* Content */}
                      <div className="px-6 pb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 mt-2">{alum.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{alum.currentJob}</p>
                        <p className="text-sm font-semibold text-amber-600 mb-3">{alum.company}</p>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{alum.bio}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            Class of {alum.graduationYear}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alum.city}
                          </span>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {alum.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                          {alum.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">
                              +{alum.skills.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedProfile(alum);
                              setShowProfileModal(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </motion.button>

                          {alum.linkedin && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={alum.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
                            >
                              <Linkedin className="w-5 h-5 text-blue-600" />
                            </motion.a>
                          )}
                        </div>
                      </div>

                      {/* Badges */}
                      {alum.badges && alum.badges.length > 0 && (
                        <div className="absolute top-28 left-3">
                          {alum.badges.slice(0, 2).map((badge, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full mb-1 mr-1"
                            >
                              <Award className="w-3 h-3" />
                              {badge}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-4">
                  {filteredAlumni.map((alum, idx) => (
                    <motion.div
                      key={alum.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 8 }}
                      className="flex items-center gap-6 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                    >
                      <img
                        src={alum.profilePicture}
                        alt={alum.name}
                        className="w-20 h-20 rounded-full border-4 border-amber-100"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{alum.name}</h3>
                            <p className="text-gray-600">{alum.currentJob} at {alum.company}</p>
                          </div>
                          {alum.mentorshipAvailable && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                              <Target className="w-3 h-3" />
                              Available for Mentorship
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{alum.bio}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {alum.degree} &bull; {alum.graduationYear}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {alum.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {alum.points} points
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedProfile(alum);
                          setShowProfileModal(true);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
                      >
                        View Profile
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Map View Placeholder */}
              {viewMode === "map" && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Map className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Interactive Map Coming Soon!</h3>
                  <p className="text-gray-600 mb-6">
                    Explore alumni locations on an interactive world map with clustering and filters.
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-600">
                    <Zap className="w-5 h-5" />
                    Feature in development
                  </div>
                </div>
              )}

              {filteredAlumni.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-24 h-24 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No alumni found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}

          {/* Posts, Events, Jobs, Mentorship Tabs - Simplified for now */}
          {activeTab !== "directory" && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-6 py-3 rounded-full font-bold mb-4">
                <Sparkles className="w-5 h-5" />
                Feature Coming Soon!
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {activeTab === "posts" && "Community Feed"}
                {activeTab === "events" && "Alumni Events"}
                {activeTab === "jobs" && "Job Board"}
                {activeTab === "mentorship" && "Mentorship Program"}
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                This feature is under active development. Check back soon for updates, or contribute to the platform!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profile View Modal */}
      <AnimatePresence>
        {showProfileModal && selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Cover Image */}
              <div className="h-48 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600 relative">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="relative px-8 pb-8">
                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20">
                  <img
                    src={selectedProfile.profilePicture}
                    alt={selectedProfile.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedProfile.name}</h2>
                        <p className="text-lg text-gray-600 mb-1">{selectedProfile.currentJob}</p>
                        <p className="text-lg font-semibold text-amber-600 mb-3">{selectedProfile.company}</p>
                      </div>
                      {selectedProfile.mentorshipAvailable && (
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                          <Star className="w-4 h-4" />
                          Available for Mentorship
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {selectedProfile.degree} &bull; Class of {selectedProfile.graduationYear}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedProfile.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {selectedProfile.email}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {selectedProfile.linkedin && (
                        <a
                          href={selectedProfile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
                        >
                          <Linkedin className="w-5 h-5 text-blue-600" />
                        </a>
                      )}
                      {selectedProfile.twitter && (
                        <a
                          href={selectedProfile.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition"
                        >
                          <Twitter className="w-5 h-5 text-blue-400" />
                        </a>
                      )}
                      {selectedProfile.website && (
                        <a
                          href={selectedProfile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition"
                        >
                          <Globe className="w-5 h-5 text-gray-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedProfile.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                {selectedProfile.badges && selectedProfile.badges.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Achievements</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedProfile.badges.map((badge, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-xl font-bold"
                        >
                          <Crown className="w-5 h-5" />
                          {badge}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {currentUser && currentUser.id !== selectedProfile.id && (
                  <div className="mt-8 flex gap-4">
                    {selectedProfile.mentorshipAvailable && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg text-lg"
                      >
                        <Target className="w-5 h-5" />
                        Request Mentorship
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-500 text-white font-bold shadow-lg text-lg"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
