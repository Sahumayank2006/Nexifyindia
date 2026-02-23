"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Users,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  FileText,
  Download,
  Upload,
  Mail,
  Bell,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Zap,
  Target,
  UserCheck,
  DollarSign,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Ticket,
  QrCode,
  Share2,
  RefreshCw,
  BookOpen,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Hash,
  Tag,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  capacity: number;
  registered: number;
  attended: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  image: string;
  tags: string[];
  organizer: string;
  price: number;
  isPaid: boolean;
  isOnline: boolean;
  meetingLink?: string;
  resources: { name: string; url: string }[];
}

interface Stats {
  totalEvents: number;
  activeEvents: number;
  totalParticipants: number;
  totalRevenue: number;
  avgAttendance: number;
  upcomingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
}

export default function FacultyDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    activeEvents: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    avgAttendance: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    cancelledEvents: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    duration: "",
    venue: "",
    capacity: 100,
    isPaid: false,
    price: 0,
    isOnline: false,
    meetingLink: "",
    tags: "",
  });

  useEffect(() => {
    // Load user data
    const user = localStorage.getItem("eventsCurrentUser");
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role !== "faculty" && userData.role !== "admin") {
        router.push("/events/auth");
        return;
      }
      setCurrentUser(userData);
    } else {
      router.push("/events/auth");
      return;
    }

    // Load events
    loadEvents();
  }, []);

  const loadEvents = () => {
    const savedEvents = localStorage.getItem("eventsData");
    if (savedEvents) {
      const eventsData = JSON.parse(savedEvents);
      setEvents(eventsData);
      calculateStats(eventsData);
    } else {
      // Sample data
      const sampleEvents: Event[] = [
        {
          id: "1",
          title: "Tech Symposium 2026",
          description: "Annual technical symposium featuring latest innovations in AI, ML, and Cloud Computing",
          category: "Technical",
          date: "2026-03-15",
          time: "09:00",
          duration: "8 hours",
          venue: "Main Auditorium",
          capacity: 500,
          registered: 387,
          attended: 0,
          status: "upcoming",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
          tags: ["AI", "ML", "Cloud", "Technology"],
          organizer: "Dr. Sarah Johnson",
          price: 0,
          isPaid: false,
          isOnline: false,
          resources: [],
        },
        {
          id: "2",
          title: "Hackathon 2026",
          description: "24-hour coding marathon with exciting prizes and mentorship opportunities",
          category: "Competition",
          date: "2026-03-20",
          time: "08:00",
          duration: "24 hours",
          venue: "Computer Lab Block A",
          capacity: 200,
          registered: 156,
          attended: 0,
          status: "upcoming",
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
          tags: ["Coding", "Competition", "Innovation"],
          organizer: "Prof. Michael Chen",
          price: 50,
          isPaid: true,
          isOnline: false,
          resources: [],
        },
        {
          id: "3",
          title: "Guest Lecture: Industry 4.0",
          description: "Expert talk on digital transformation and future of manufacturing",
          category: "Workshop",
          date: "2026-02-25",
          time: "14:00",
          duration: "2 hours",
          venue: "Online",
          capacity: 1000,
          registered: 542,
          attended: 498,
          status: "completed",
          image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
          tags: ["Industry", "Digital", "Future"],
          organizer: "Dr. Emily White",
          price: 0,
          isPaid: false,
          isOnline: true,
          meetingLink: "https://meet.google.com/xyz-abc-123",
          resources: [
            { name: "Presentation.pdf", url: "#" },
            { name: "Reading Material.docx", url: "#" },
          ],
        },
        {
          id: "4",
          title: "Cultural Fest 2026",
          description: "Celebrate diversity through music, dance, art, and cultural performances",
          category: "Cultural",
          date: "2026-04-01",
          time: "17:00",
          duration: "5 hours",
          venue: "Open Air Theatre",
          capacity: 800,
          registered: 623,
          attended: 0,
          status: "upcoming",
          image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
          tags: ["Culture", "Arts", "Music", "Dance"],
          organizer: "Dr. Priya Sharma",
          price: 100,
          isPaid: true,
          isOnline: false,
          resources: [],
        },
      ];
      setEvents(sampleEvents);
      localStorage.setItem("eventsData", JSON.stringify(sampleEvents));
      calculateStats(sampleEvents);
    }
  };

  const calculateStats = (eventsData: Event[]) => {
    const totalEvents = eventsData.length;
    const activeEvents = eventsData.filter((e) => e.status === "upcoming" || e.status === "ongoing").length;
    const totalParticipants = eventsData.reduce((sum, e) => sum + e.registered, 0);
    const totalRevenue = eventsData.reduce((sum, e) => sum + (e.isPaid ? e.registered * e.price : 0), 0);
    const completedEvents = eventsData.filter((e) => e.status === "completed");
    const avgAttendance = completedEvents.length > 0
      ? completedEvents.reduce((sum, e) => sum + (e.attended / e.registered) * 100, 0) / completedEvents.length
      : 0;

    setStats({
      totalEvents,
      activeEvents,
      totalParticipants,
      totalRevenue,
      avgAttendance: Math.round(avgAttendance),
      upcomingEvents: eventsData.filter((e) => e.status === "upcoming").length,
      completedEvents: completedEvents.length,
      cancelledEvents: eventsData.filter((e) => e.status === "cancelled").length,
    });
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesCategory = filterCategory === "all" || event.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateEvent = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      venue: formData.venue,
      capacity: formData.capacity,
      registered: 0,
      attended: 0,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      tags: formData.tags.split(",").map((t) => t.trim()),
      organizer: currentUser?.name || "Faculty",
      price: formData.price,
      isPaid: formData.isPaid,
      isOnline: formData.isOnline,
      meetingLink: formData.meetingLink,
      resources: [],
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("eventsData", JSON.stringify(updatedEvents));
    calculateStats(updatedEvents);
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            date: formData.date,
            time: formData.time,
            duration: formData.duration,
            venue: formData.venue,
            capacity: formData.capacity,
            isPaid: formData.isPaid,
            price: formData.price,
            isOnline: formData.isOnline,
            meetingLink: formData.meetingLink,
            tags: formData.tags.split(",").map((t) => t.trim()),
          }
        : event
    );

    setEvents(updatedEvents);
    localStorage.setItem("eventsData", JSON.stringify(updatedEvents));
    calculateStats(updatedEvents);
    setShowEditModal(false);
    setSelectedEvent(null);
    resetForm();
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter((e) => e.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem("eventsData", JSON.stringify(updatedEvents));
      calculateStats(updatedEvents);
    }
  };

  const handleDuplicateEvent = (event: Event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      title: `${event.title} (Copy)`,
      registered: 0,
      attended: 0,
      status: "upcoming" as const,
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("eventsData", JSON.stringify(updatedEvents));
    calculateStats(updatedEvents);
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      duration: event.duration,
      venue: event.venue,
      capacity: event.capacity,
      isPaid: event.isPaid,
      price: event.price,
      isOnline: event.isOnline,
      meetingLink: event.meetingLink || "",
      tags: event.tags.join(", "),
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      date: "",
      time: "",
      duration: "",
      venue: "",
      capacity: 100,
      isPaid: false,
      price: 0,
      isOnline: false,
      meetingLink: "",
      tags: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "ongoing": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "completed": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "cancelled": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      change: "+12%",
      isPositive: true,
    },
    {
      title: "Active Events",
      value: stats.activeEvents,
      icon: Activity,
      gradient: "from-green-500 to-emerald-500",
      change: "+5%",
      isPositive: true,
    },
    {
      title: "Total Participants",
      value: stats.totalParticipants,
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      change: "+23%",
      isPositive: true,
    },
    {
      title: "Avg Attendance",
      value: `${stats.avgAttendance}%`,
      icon: UserCheck,
      gradient: "from-orange-500 to-red-500",
      change: "-3%",
      isPositive: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          className="fixed left-0 top-0 h-full w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 overflow-y-auto"
        >
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50" />
                <Calendar className="relative w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Events Portal</h1>
                <p className="text-xs text-purple-300">Faculty Dashboard</p>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 mb-6 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {currentUser?.name?.charAt(0) || "F"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{currentUser?.name || "Faculty"}</p>
                  <p className="text-purple-300 text-xs">{currentUser?.designation || "Event Coordinator"}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "events", label: "Manage Events", icon: Calendar },
                { id: "attendance", label: "Attendance", icon: UserCheck },
                { id: "analytics", label: "Analytics", icon: TrendingUp },
                { id: "participants", label: "Participants", icon: Users },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "attendance") {
                      router.push("/events/faculty/attendance");
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-purple-200 hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("eventsCurrentUser");
                router.push("/events/auth");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-all mt-6"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-2xl border-b border-white/10">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {activeTab === "overview" && "Dashboard Overview"}
                    {activeTab === "events" && "Event Management"}
                    {activeTab === "analytics" && "Analytics & Reports"}
                    {activeTab === "participants" && "Participant Management"}
                    {activeTab === "settings" && "Settings"}
                  </h2>
                  <p className="text-purple-300 text-sm">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="relative p-2 hover:bg-white/10 rounded-lg transition">
                  <Bell className="w-6 h-6 text-white" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                  <Settings className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                      >
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-30 group-hover:opacity-60 transition`} />
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                              <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold ${stat.isPositive ? "text-green-400" : "text-red-400"}`}>
                              {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              {stat.change}
                            </div>
                          </div>
                          <h3 className="text-purple-200 text-sm mb-1">{stat.title}</h3>
                          <p className="text-3xl font-bold text-white">{stat.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Events Distribution */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <PieChart className="w-6 h-6 text-purple-400" />
                        Events Distribution
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: "Upcoming", count: stats.upcomingEvents, color: "bg-blue-500", percentage: (stats.upcomingEvents / stats.totalEvents) * 100 || 0 },
                          { label: "Completed", count: stats.completedEvents, color: "bg-green-500", percentage: (stats.completedEvents / stats.totalEvents) * 100 || 0 },
                          { label: "Active", count: stats.activeEvents, color: "bg-purple-500", percentage: (stats.activeEvents / stats.totalEvents) * 100 || 0 },
                          { label: "Cancelled", count: stats.cancelledEvents, color: "bg-red-500", percentage: (stats.cancelledEvents / stats.totalEvents) * 100 || 0 },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-purple-200 text-sm">{item.label}</span>
                              <span className="text-white font-semibold">{item.count} ({Math.round(item.percentage)}%)</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full ${item.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-purple-400" />
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {[
                          { action: "New registration", event: "Tech Symposium 2026", time: "2 min ago", icon: UserCheck, color: "text-green-400" },
                          { action: "Event updated", event: "Hackathon 2026", time: "15 min ago", icon: Edit, color: "text-blue-400" },
                          { action: "Event created", event: "Cultural Fest 2026", time: "1 hour ago", icon: Plus, color: "text-purple-400" },
                          { action: "Attendance marked", event: "Guest Lecture", time: "2 hours ago", icon: CheckCircle, color: "text-green-400" },
                        ].map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition"
                          >
                            <activity.icon className={`w-5 h-5 ${activity.color}`} />
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">{activity.action}</p>
                              <p className="text-purple-300 text-xs">{activity.event}</p>
                            </div>
                            <span className="text-purple-400 text-xs">{activity.time}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Zap className="w-6 h-6 text-yellow-400" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { label: "Create Event", icon: Plus, gradient: "from-purple-500 to-pink-500", action: () => setShowCreateModal(true) },
                        { label: "Mark Attendance", icon: UserCheck, gradient: "from-blue-500 to-cyan-500", action: () => router.push("/events/faculty/attendance") },
                        { label: "OD Portal", icon: FileText, gradient: "from-green-500 to-emerald-500", action: () => window.open("https://d-admin.amitycodingclub.social", "_blank") },
                        { label: "View Reports", icon: BarChart3, gradient: "from-amber-500 to-orange-500", action: () => setActiveTab("analytics") },
                        { label: "Send Notification", icon: Bell, gradient: "from-orange-500 to-red-500", action: () => alert("Notification feature") },
                      ].map((action, index) => (
                        <motion.button
                          key={action.label}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={action.action}
                          className="relative group"
                        >
                          <div className={`absolute -inset-0.5 bg-gradient-to-r ${action.gradient} rounded-xl blur opacity-50 group-hover:opacity-100 transition`} />
                          <div className="relative bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center">
                            <action.icon className="w-8 h-8 text-white mb-2 mx-auto" />
                            <p className="text-white font-semibold text-sm">{action.label}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Events Management Tab */}
              {activeTab === "events" && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Toolbar */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      {/* Search */}
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search events..."
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                        />
                      </div>

                      {/* Filters */}
                      <div className="flex items-center gap-3">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                        >
                          <option value="all" className="bg-slate-800">All Status</option>
                          <option value="upcoming" className="bg-slate-800">Upcoming</option>
                          <option value="ongoing" className="bg-slate-800">Ongoing</option>
                          <option value="completed" className="bg-slate-800">Completed</option>
                          <option value="cancelled" className="bg-slate-800">Cancelled</option>
                        </select>

                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                        >
                          <option value="all" className="bg-slate-800">All Categories</option>
                          <option value="Technical" className="bg-slate-800">Technical</option>
                          <option value="Cultural" className="bg-slate-800">Cultural</option>
                          <option value="Workshop" className="bg-slate-800">Workshop</option>
                          <option value="Competition" className="bg-slate-800">Competition</option>
                        </select>

                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                        >
                          <Plus className="w-5 h-5" />
                          Create Event
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Events Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition" />
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20">
                          {/* Event Image */}
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Status Badge */}
                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(event.status)}`}>
                              {event.status.toUpperCase()}
                            </div>

                            {/* Actions Menu */}
                            <div className="absolute top-4 right-4">
                              <div className="relative group/menu">
                                <button className="p-2 bg-black/50 hover:bg-black/70 rounded-lg backdrop-blur-sm transition">
                                  <MoreVertical className="w-5 h-5 text-white" />
                                </button>
                                <div className="absolute right-0 top-12 w-48 bg-slate-800 rounded-xl shadow-2xl border border-white/10 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50">
                                  <button
                                    onClick={() => openEditModal(event)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-white text-sm"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit Event
                                  </button>
                                  <button
                                    onClick={() => handleDuplicateEvent(event)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-white text-sm"
                                  >
                                    <Copy className="w-4 h-4" />
                                    Duplicate
                                  </button>
                                  <button
                                    onClick={() => router.push(`/events/faculty/attendance?eventId=${event.id}`)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-white text-sm"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    Attendance
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 transition text-red-400 text-sm rounded-b-xl"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                            <p className="text-purple-200 text-sm mb-4 line-clamp-2">{event.description}</p>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-purple-300 text-sm">
                                <Calendar className="w-4 h-4" />
                                {new Date(event.date).toLocaleDateString()} at {event.time}
                              </div>
                              <div className="flex items-center gap-2 text-purple-300 text-sm">
                                <MapPin className="w-4 h-4" />
                                {event.venue}
                              </div>
                              <div className="flex items-center gap-2 text-purple-300 text-sm">
                                <Clock className="w-4 h-4" />
                                {event.duration}
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {event.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg border border-purple-500/30"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            {/* Progress */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-purple-300">Registrations</span>
                                <span className="text-white font-semibold">{event.registered} / {event.capacity}</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                  style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                                />
                              </div>
                            </div>

                            {event.isPaid && (
                              <div className="mt-4 flex items-center gap-2 text-green-400">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold">${event.price} per ticket</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredEvents.length === 0 && (
                    <div className="text-center py-20">
                      <Calendar className="w-20 h-20 text-purple-400/50 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                      <p className="text-purple-300 mb-6">Create your first event to get started!</p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                      >
                        Create Event
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
                    <BarChart3 className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h3>
                    <p className="text-purple-300 mb-6">Detailed reports and insights coming soon!</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      {[
                        { label: "Event Performance", icon: TrendingUp },
                        { label: "Revenue Analytics", icon: DollarSign },
                        { label: "Engagement Metrics", icon: Activity },
                      ].map((item) => (
                        <div key={item.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <item.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-white text-sm">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  Create New Event
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateEvent(); }} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      placeholder="e.g., Tech Symposium 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    >
                      <option value="" className="bg-slate-800">Select Category</option>
                      <option value="Technical" className="bg-slate-800">Technical</option>
                      <option value="Cultural" className="bg-slate-800">Cultural</option>
                      <option value="Workshop" className="bg-slate-800">Workshop</option>
                      <option value="Competition" className="bg-slate-800">Competition</option>
                      <option value="Seminar" className="bg-slate-800">Seminar</option>
                      <option value="Sports" className="bg-slate-800">Sports</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition resize-none"
                    placeholder="Describe your event..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Duration *</label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      placeholder="e.g., 2 hours"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Venue *</label>
                    <input
                      type="text"
                      required
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      placeholder="e.g., Main Auditorium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Capacity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    placeholder="e.g., AI, ML, Technology"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPaid}
                      onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-white font-medium">Paid Event</span>
                  </label>

                  {formData.isPaid && (
                    <div className="flex-1">
                      <input
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                        placeholder="Ticket price"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOnline}
                      onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-white font-medium">Online Event</span>
                  </label>

                  {formData.isOnline && (
                    <input
                      type="url"
                      value={formData.meetingLink}
                      onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      placeholder="Meeting link (e.g., Zoom, Google Meet)"
                    />
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {showEditModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowEditModal(false);
              setSelectedEvent(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Edit className="w-6 h-6" />
                  Edit Event
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEvent(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleUpdateEvent(); }} className="p-6 space-y-6">
                {/* Same form fields as Create Modal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    >
                      <option value="" className="bg-slate-800">Select Category</option>
                      <option value="Technical" className="bg-slate-800">Technical</option>
                      <option value="Cultural" className="bg-slate-800">Cultural</option>
                      <option value="Workshop" className="bg-slate-800">Workshop</option>
                      <option value="Competition" className="bg-slate-800">Competition</option>
                      <option value="Seminar" className="bg-slate-800">Seminar</option>
                      <option value="Sports" className="bg-slate-800">Sports</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Time *</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Duration *</label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Venue *</label>
                    <input
                      type="text"
                      required
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">Capacity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedEvent(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                  >
                    Update Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
