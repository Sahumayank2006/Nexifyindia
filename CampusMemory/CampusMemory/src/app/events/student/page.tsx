"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Search,
  Filter,
  Eye,
  UserPlus,
  Heart,
  Share2,
  Download,
  Award,
  Star,
  Sparkles,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Code,
  Palette,
  Music,
  Trophy,
  Dumbbell,
  Lightbulb,
  GraduationCap,
  Users2,
  UserCheck,
  Target,
  Flame,
  Zap,
  Crown,
  Rocket,
  Grid3x3,
  List,
  Bell,
  Settings,
  LogOut,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
  DollarSign,
  Tag,
  Info,
  FileText,
  ClipboardList,
  Upload,
  Send,
} from "lucide-react";

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  date: string;
  time: string;
  venue: string;
  maxParticipants: number;
  maxTeamSize: number;
  registrationDeadline: string;
  posterUrl?: string;
  coordinators: string[];
  budget?: number;
  fee?: number;
  status: "draft" | "active" | "completed" | "cancelled";
  registrations: Registration[];
  attendance: AttendanceRecord[];
  createdAt: string;
  createdBy: string;
}

interface Registration {
  id: string;
  eventId: string;
  studentName: string;
  studentEmail: string;
  studentRoll: string;
  studentDepartment: string;
  studentYear: string;
  registeredAt: string;
  status: "pending" | "approved" | "rejected";
  teamMembers?: TeamMember[];
  isTeamLead?: boolean;
  // OD fields
  odEventName?: string;
  odSubjects?: string[];
  sameClassStudents?: string[];
}

interface TeamMember {
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  year: string;
}

interface AttendanceRecord {
  id: string;
  eventId: string;
  studentRoll: string;
  studentName: string;
  markedAt: string;
  markedBy: string;
  status: "present" | "absent" | "late";
}

interface StudentUser {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string;
  year: string;
  section: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [activeTab, setActiveTab] = useState<"browse" | "my-events" | "my-teams">("browse");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Team registration state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentTeamMember, setCurrentTeamMember] = useState<TeamMember>({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    year: "",
  });

  // OD Request fields
  const [odEventName, setOdEventName] = useState("");
  const [odSubjects, setOdSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [sameClassStudents, setSameClassStudents] = useState<string[]>([]);
  const [currentSameClassStudent, setCurrentSameClassStudent] = useState("");

  // Categories
  const categories = [
    { id: "technical", name: "Technical", icon: Code, color: "from-blue-500 to-cyan-500", gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20" },
    { id: "cultural", name: "Cultural", icon: Palette, color: "from-pink-500 to-rose-500", gradient: "bg-gradient-to-br from-pink-500/20 to-rose-500/20" },
    { id: "sports", name: "Sports", icon: Dumbbell, color: "from-green-500 to-emerald-500", gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20" },
    { id: "workshop", name: "Workshop", icon: Lightbulb, color: "from-yellow-500 to-amber-500", gradient: "bg-gradient-to-br from-yellow-500/20 to-amber-500/20" },
    { id: "seminar", name: "Seminar", icon: BookOpen, color: "from-purple-500 to-indigo-500", gradient: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20" },
    { id: "competition", name: "Competition", icon: Trophy, color: "from-orange-500 to-red-500", gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20" },
  ];

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("eventsCurrentUser");
    if (!userData) {
      router.push("/events/auth");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "student") {
      alert("Access denied. Student access only.");
      router.push("/events/auth");
      return;
    }

    setCurrentUser(user);

    // Load events from faculty
    loadEvents();

    // Load my registrations
    loadMyRegistrations(user.rollNumber);

    setIsLoading(false);
  }, [router]);

  const loadEvents = () => {
    const storedEvents = localStorage.getItem("facultyEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const activeEvents = parsedEvents.filter((event: Event) => event.status === "active");
      setEvents(activeEvents);
      setFilteredEvents(activeEvents);
    }
  };

  const loadMyRegistrations = (rollNumber: string) => {
    const storedEvents = localStorage.getItem("facultyEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const allRegistrations: Registration[] = [];
      
      parsedEvents.forEach((event: Event) => {
        const myRegs = event.registrations.filter(reg => reg.studentRoll === rollNumber);
        allRegistrations.push(...myRegs);
      });
      
      setMyRegistrations(allRegistrations);
    }
  };

  // Filter events
  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((event) => event.category === filterCategory);
    }

    setFilteredEvents(filtered);
  }, [searchQuery, filterCategory, events]);

  const handleRegister = () => {
    if (!selectedEvent || !currentUser) return;

    // Check if already registered
    const alreadyRegistered = selectedEvent.registrations.some(
      reg => reg.studentRoll === currentUser.rollNumber
    );

    if (alreadyRegistered) {
      alert("⚠️ You are already registered for this event!");
      return;
    }

    // Check registration deadline
    const deadline = new Date(selectedEvent.registrationDeadline);
    const now = new Date();
    if (now > deadline) {
      alert("⚠️ Registration deadline has passed!");
      return;
    }

    // Check max participants
    const approvedCount = selectedEvent.registrations.filter(reg => reg.status === "approved").length;
    if (approvedCount >= selectedEvent.maxParticipants) {
      alert("⚠️ Event has reached maximum participants!");
      return;
    }

    // Validate team size
    const totalMembers = teamMembers.length + 1; // +1 for the current user
    if (totalMembers > selectedEvent.maxTeamSize) {
      alert(`⚠️ Maximum team size is ${selectedEvent.maxTeamSize} members!`);
      return;
    }

    if (totalMembers < selectedEvent.maxTeamSize && selectedEvent.maxTeamSize > 1) {
      if (!confirm(`Team size is ${totalMembers}/${selectedEvent.maxTeamSize}. Continue anyway?`)) {
        return;
      }
    }

    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      eventId: selectedEvent.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentRoll: currentUser.rollNumber,
      studentDepartment: currentUser.department,
      studentYear: currentUser.year,
      registeredAt: new Date().toISOString(),
      status: "pending",
      teamMembers: teamMembers.length > 0 ? teamMembers : undefined,
      isTeamLead: teamMembers.length > 0,
      // OD fields
      odEventName: odEventName || undefined,
      odSubjects: odSubjects.length > 0 ? odSubjects : undefined,
      sameClassStudents: sameClassStudents.length > 0 ? sameClassStudents : undefined,
    };

    // Update events in localStorage
    const storedEvents = localStorage.getItem("facultyEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const updatedEvents = parsedEvents.map((event: Event) =>
        event.id === selectedEvent.id
          ? { ...event, registrations: [...event.registrations, newRegistration] }
          : event
      );
      localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
      loadEvents();
      loadMyRegistrations(currentUser.rollNumber);
    }

    setShowRegisterModal(false);
    setTeamMembers([]);
    setOdEventName("");
    setOdSubjects([]);
    setSameClassStudents([]);
    setSelectedEvent(null);
    alert("✅ Registration successful! Waiting for approval.");
  };

  const addTeamMember = () => {
    if (!selectedEvent) return;

    if (!currentTeamMember.name || !currentTeamMember.email || !currentTeamMember.rollNumber) {
      alert("Please fill all required fields");
      return;
    }

    if (teamMembers.length + 2 > selectedEvent.maxTeamSize) { // +2 for current user and new member
      alert(`⚠️ Maximum team size is ${selectedEvent.maxTeamSize} members!`);
      return;
    }

    setTeamMembers([...teamMembers, currentTeamMember]);
    setCurrentTeamMember({
      name: "",
      email: "",
      rollNumber: "",
      department: "",
      year: "",
    });
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const getEventStats = (event: Event) => {
    const totalRegistrations = event.registrations.length;
    const approvedRegistrations = event.registrations.filter(reg => reg.status === "approved").length;
    const spotsLeft = event.maxParticipants - approvedRegistrations;
    const registrationOpen = new Date(event.registrationDeadline) > new Date();
    
    return {
      totalRegistrations,
      approvedRegistrations,
      spotsLeft,
      registrationOpen,
      fillPercentage: (approvedRegistrations / event.maxParticipants) * 100,
    };
  };

  const isRegistered = (eventId: string) => {
    return myRegistrations.some(reg => reg.eventId === eventId);
  };

  const getRegistrationStatus = (eventId: string) => {
    const registration = myRegistrations.find(reg => reg.eventId === eventId);
    return registration?.status || null;
  };

  const handleLogout = () => {
    localStorage.removeItem("eventsCurrentUser");
    router.push("/events/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Campus Events
                  </h1>
                  <p className="text-sm text-purple-300/70">Student Portal</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <div className="text-sm">
                  <p className="text-white font-semibold">{currentUser?.name}</p>
                  <p className="text-purple-300/70 text-xs">{currentUser?.rollNumber}</p>
                </div>
              </div>
              
              <button className="p-2 hover:bg-white/10 rounded-xl transition">
                <Bell className="w-5 h-5 text-purple-300" />
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl transition text-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                activeTab === "browse"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/5 text-purple-300 hover:bg-white/10"
              }`}
            >
              <Search className="w-4 h-4" />
              Browse Events
            </button>
            <button
              onClick={() => setActiveTab("my-events")}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                activeTab === "my-events"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/5 text-purple-300 hover:bg-white/10"
              }`}
            >
              <Calendar className="w-4 h-4" />
              My Events
              {myRegistrations.length > 0 && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {myRegistrations.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("my-teams")}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                activeTab === "my-teams"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/5 text-purple-300 hover:bg-white/10"
              }`}
            >
              <Users2 className="w-4 h-4" />
              My Teams
            </button>
            <button
              onClick={() => router.push("/events/student/od-request")}
              className="px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/50"
            >
              <ClipboardList className="w-4 h-4" />
              OD Request
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search and Filter Bar */}
              <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events by name, description, or department..."
                    className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-400 transition"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-4 rounded-2xl transition ${
                      viewMode === "grid"
                        ? "bg-purple-500 text-white"
                        : "bg-white/5 text-purple-300 hover:bg-white/10"
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-4 rounded-2xl transition ${
                      viewMode === "list"
                        ? "bg-purple-500 text-white"
                        : "bg-white/5 text-purple-300 hover:bg-white/10"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Events Grid/List */}
              {filteredEvents.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                  <p className="text-purple-300/70">Check back later for upcoming events!</p>
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                  {filteredEvents.map((event, index) => {
                    const category = categories.find((c) => c.id === event.category);
                    const CategoryIcon = category?.icon || Code;
                    const stats = getEventStats(event);
                    const registered = isRegistered(event.id);
                    const registrationStatus = getRegistrationStatus(event.id);

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-400/50 transition-all duration-300 ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        {/* Event Poster/Image */}
                        <div className={`relative ${viewMode === "list" ? "w-1/3" : "h-48"} overflow-hidden`}>
                          {event.posterUrl ? (
                            <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${category?.color || "from-purple-500 to-pink-500"} flex items-center justify-center`}>
                              <CategoryIcon className="w-16 h-16 text-white/50" />
                            </div>
                          )}
                          
                          {/* Overlay with category badge */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 bg-gradient-to-r ${category?.color || "from-purple-500 to-pink-500"} rounded-full text-xs font-semibold text-white shadow-lg`}>
                              {category?.name || "Event"}
                            </span>
                          </div>
                          
                          {/* Team/Individual Badge */}
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-black/50 backdrop-blur-xl rounded-full text-xs font-semibold text-white flex items-center gap-1">
                              {event.maxTeamSize > 1 ? (
                                <>
                                  <Users2 className="w-3 h-3" />
                                  Team ({event.maxTeamSize})
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3 h-3" />
                                  Individual
                                </>
                              )}
                            </span>
                          </div>

                          {/* Registration Status Badge */}
                          {registered && (
                            <div className="absolute bottom-4 left-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                registrationStatus === "approved"
                                  ? "bg-green-500/80 text-white"
                                  : registrationStatus === "rejected"
                                  ? "bg-red-500/80 text-white"
                                  : "bg-yellow-500/80 text-white"
                              }`}>
                                {registrationStatus === "approved" && <CheckCircle className="w-3 h-3" />}
                                {registrationStatus === "rejected" && <XCircle className="w-3 h-3" />}
                                {registrationStatus === "pending" && <Clock className="w-3 h-3" />}
                                {registrationStatus === "approved" ? "Registered" : registrationStatus === "rejected" ? "Rejected" : "Pending"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Event Info */}
                        <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
                            {event.title}
                          </h3>
                          <p className="text-purple-300/70 text-sm mb-4 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-purple-300">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span className="text-sm">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-300">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{event.venue}</span>
                            </div>
                            {event.fee && event.fee > 0 && (
                              <div className="flex items-center gap-2 text-purple-300">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm">₹{event.fee}</span>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-purple-300 mb-1">
                              <span>{stats.approvedRegistrations} / {event.maxParticipants} spots filled</span>
                              <span>{stats.spotsLeft} left</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.fillPercentage}%` }}
                                className={`h-full rounded-full ${
                                  stats.fillPercentage > 80
                                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                                    : stats.fillPercentage > 50
                                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                    : "bg-gradient-to-r from-green-500 to-emerald-500"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowDetailsModal(true);
                              }}
                              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            
                            {!registered && stats.registrationOpen && stats.spotsLeft > 0 && (
                              <button
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowRegisterModal(true);
                                }}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50"
                              >
                                <UserPlus className="w-4 h-4" />
                                Register
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "my-events" && (
            <motion.div
              key="my-events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-400" />
                My Registrations
              </h2>

              {myRegistrations.length === 0 ? (
                <div className="text-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardList className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Registrations Yet</h3>
                  <p className="text-purple-300/70 mb-6">Start browsing events and register for your favorites!</p>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRegistrations.map((registration, index) => {
                    const event = events.find(e => e.id === registration.eventId);
                    if (!event) return null;

                    const category = categories.find((c) => c.id === event.category);
                    const CategoryIcon = category?.icon || Code;

                    return (
                      <motion.div
                        key={registration.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-400/50 transition-all duration-300"
                      >
                        <div className="relative h-32 overflow-hidden">
                          {event.posterUrl ? (
                            <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${category?.color || "from-purple-500 to-pink-500"} flex items-center justify-center`}>
                              <CategoryIcon className="w-12 h-12 text-white/50" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {/* Status Badge */}
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                              registration.status === "approved"
                                ? "bg-green-500 text-white"
                                : registration.status === "rejected"
                                ? "bg-red-500 text-white"
                                : "bg-yellow-500 text-white"
                            }`}>
                              {registration.status === "approved" && <CheckCircle className="w-3 h-3" />}
                              {registration.status === "rejected" && <XCircle className="w-3 h-3" />}
                              {registration.status === "pending" && <Clock className="w-3 h-3" />}
                              {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-purple-300 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-300 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{event.venue}</span>
                            </div>
                            {registration.isTeamLead && registration.teamMembers && (
                              <div className="flex items-center gap-2 text-purple-300 text-sm">
                                <Users2 className="w-4 h-4" />
                                <span>Team Lead ({registration.teamMembers.length + 1} members)</span>
                              </div>
                            )}
                            {registration.odEventName && (
                              <div className="flex items-center gap-2 text-blue-300 text-sm">
                                <FileText className="w-4 h-4" />
                                <span>OD: {registration.odEventName}</span>
                              </div>
                            )}
                            {registration.odSubjects && registration.odSubjects.length > 0 && (
                              <div className="flex items-center gap-2 text-green-300 text-sm">
                                <BookOpen className="w-4 h-4" />
                                <span>Subjects: {registration.odSubjects.length} subject{registration.odSubjects.length > 1 ? 's' : ''}</span>
                                {registration.odSubjects.length > 1 && <span className="text-xs bg-green-500/20 px-2 py-0.5 rounded-full">+{registration.odSubjects.length - 1}</span>}
                              </div>
                            )}
                            {registration.sameClassStudents && registration.sameClassStudents.length > 0 && (
                              <div className="flex items-center gap-2 text-purple-300 text-sm">
                                <Users className="w-4 h-4" />
                                <span>Class: {registration.sameClassStudents.length} student{registration.sameClassStudents.length > 1 ? 's' : ''}</span>
                                {registration.sameClassStudents.length > 1 && <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">+{registration.sameClassStudents.length - 1}</span>}
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-purple-300/50">
                            Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "my-teams" && (
            <motion.div
              key="my-teams"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Users2 className="w-8 h-8 text-purple-400" />
                My Teams
              </h2>

              {myRegistrations.filter(reg => reg.isTeamLead).length === 0 ? (
                <div className="text-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users2 className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Teams Yet</h3>
                  <p className="text-purple-300/70">Register for team events to create your first team!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {myRegistrations
                    .filter(reg => reg.isTeamLead)
                    .map((registration, index) => {
                      const event = events.find(e => e.id === registration.eventId);
                      if (!event) return null;

                      return (
                        <motion.div
                          key={registration.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                              <p className="text-purple-300/70">Team Size: {(registration.teamMembers?.length || 0) + 1} / {event.maxTeamSize}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                              registration.status === "approved"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : registration.status === "rejected"
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            }`}>
                              {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                            </span>
                          </div>

                          {/* Team Members */}
                          <div className="space-y-3">
                            {/* Team Lead (Current User) */}
                            <div className="flex items-center gap-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Crown className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-semibold flex items-center gap-2">
                                  {currentUser?.name}
                                  <span className="px-2 py-0.5 bg-purple-500/30 rounded-full text-xs">Team Lead</span>
                                </p>
                                <p className="text-purple-300/70 text-sm">{currentUser?.rollNumber} • {currentUser?.department}</p>
                              </div>
                            </div>

                            {/* Team Members */}
                            {registration.teamMembers && registration.teamMembers.map((member, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                  <UserCheck className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-white font-semibold">{member.name}</p>
                                  <p className="text-purple-300/70 text-sm">{member.rollNumber} • {member.department}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Poster */}
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                {selectedEvent.posterUrl ? (
                  <img src={selectedEvent.posterUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${categories.find(c => c.id === selectedEvent.category)?.color || "from-purple-500 to-pink-500"}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="p-8">
                <h2 className="text-4xl font-bold text-white mb-4">{selectedEvent.title}</h2>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`px-4 py-2 bg-gradient-to-r ${categories.find(c => c.id === selectedEvent.category)?.color || "from-purple-500 to-pink-500"} rounded-full text-sm font-semibold text-white`}>
                    {categories.find(c => c.id === selectedEvent.category)?.name || "Event"}
                  </span>
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white flex items-center gap-2">
                    {selectedEvent.maxTeamSize > 1 ? (
                      <>
                        <Users2 className="w-4 h-4" />
                        Team Event (Max {selectedEvent.maxTeamSize})
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Individual Event
                      </>
                    )}
                  </span>
                </div>

                <p className="text-purple-200 text-lg mb-8 leading-relaxed">{selectedEvent.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-purple-200">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-300/70">Date</p>
                        <p className="font-semibold">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-purple-200">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-300/70">Time</p>
                        <p className="font-semibold">{selectedEvent.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-purple-200">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-300/70">Venue</p>
                        <p className="font-semibold">{selectedEvent.venue}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-purple-200">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-300/70">Max Participants</p>
                        <p className="font-semibold">{selectedEvent.maxParticipants}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-purple-200">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-300/70">Registration Deadline</p>
                        <p className="font-semibold">{new Date(selectedEvent.registrationDeadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {selectedEvent.fee && selectedEvent.fee > 0 && (
                      <div className="flex items-center gap-3 text-purple-200">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-300/70">Registration Fee</p>
                          <p className="font-semibold">₹{selectedEvent.fee}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!isRegistered(selectedEvent.id) && getEventStats(selectedEvent).registrationOpen && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowRegisterModal(true);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl text-white font-bold text-lg transition shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Register Now
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {showRegisterModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowRegisterModal(false);
              setTeamMembers([]);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">Register for Event</h2>
                  <button
                    onClick={() => {
                      setShowRegisterModal(false);
                      setTeamMembers([]);
                      setOdEventName("");
                      setOdSubjects([]);
                      setSameClassStudents([]);
                    }}
                    className="p-2 hover:bg-white/10 rounded-xl transition"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-purple-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users2 className="w-4 h-4" />
                      {selectedEvent.maxTeamSize > 1 ? `Team (Max ${selectedEvent.maxTeamSize})` : "Individual"}
                    </span>
                  </div>
                </div>

                {/* OD Request Section */}
                <div className="mb-6 p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    OD Request Information
                  </h3>
                  
                  {/* Event Name for OD */}
                  <div className="mb-4">
                    <label className="block text-purple-200 text-sm font-semibold mb-2">Event Name for OD</label>
                    <input
                      type="text"
                      value={odEventName}
                      onChange={(e) => setOdEventName(e.target.value)}
                      placeholder="Enter event name for OD request"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  {/* Multiple Subjects */}
                  <div className="mb-4">
                    <label className="block text-purple-200 text-sm font-semibold mb-2">
                      Subjects for OD {odSubjects.length > 0 && `(${odSubjects.length})`}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentSubject}
                        onChange={(e) => setCurrentSubject(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && currentSubject.trim()) {
                            e.preventDefault();
                            setOdSubjects([...odSubjects, currentSubject.trim()]);
                            setCurrentSubject("");
                          }
                        }}
                        placeholder="Add subject name and press Enter"
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      />
                      <button
                        onClick={() => {
                          if (currentSubject.trim()) {
                            setOdSubjects([...odSubjects, currentSubject.trim()]);
                            setCurrentSubject("");
                          }
                        }}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold transition flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    {odSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {odSubjects.map((subject, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-200 text-sm flex items-center gap-2"
                          >
                            {subject}
                            <button
                              onClick={() => setOdSubjects(odSubjects.filter((_, i) => i !== index))}
                              className="hover:text-red-300 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Same Class Students */}
                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-2">
                      Same Class Students {sameClassStudents.length > 0 && `(${sameClassStudents.length})`}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentSameClassStudent}
                        onChange={(e) => setCurrentSameClassStudent(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && currentSameClassStudent.trim()) {
                            e.preventDefault();
                            setSameClassStudents([...sameClassStudents, currentSameClassStudent.trim()]);
                            setCurrentSameClassStudent("");
                          }
                        }}
                        placeholder="Add student name and press Enter"
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      />
                      <button
                        onClick={() => {
                          if (currentSameClassStudent.trim()) {
                            setSameClassStudents([...sameClassStudents, currentSameClassStudent.trim()]);
                            setCurrentSameClassStudent("");
                          }
                        }}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-semibold transition flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    {sameClassStudents.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {sameClassStudents.map((student, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm flex items-center gap-2"
                          >
                            {student}
                            <button
                              onClick={() => setSameClassStudents(sameClassStudents.filter((_, i) => i !== index))}
                              className="hover:text-red-300 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Lead Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    {selectedEvent.maxTeamSize > 1 ? "Team Lead (You)" : "Participant Info"}
                  </h3>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <p className="text-white font-semibold">{currentUser?.name}</p>
                    <p className="text-purple-300/70 text-sm">{currentUser?.rollNumber} • {currentUser?.department} • Year {currentUser?.year}</p>
                  </div>
                </div>

                {/* Team Members Section */}
                {selectedEvent.maxTeamSize > 1 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Users2 className="w-5 h-5 text-blue-400" />
                      Team Members ({teamMembers.length + 1} / {selectedEvent.maxTeamSize})
                    </h3>

                    {/* Existing Team Members */}
                    {teamMembers.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                            <div className="flex-1">
                              <p className="text-white font-semibold">{member.name}</p>
                              <p className="text-purple-300/70 text-sm">{member.rollNumber} • {member.department}</p>
                            </div>
                            <button
                              onClick={() => removeTeamMember(index)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Team Member Form */}
                    {teamMembers.length + 1 < selectedEvent.maxTeamSize && (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                        <p className="text-purple-200 font-semibold mb-2">Add Team Member</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={currentTeamMember.name}
                            onChange={(e) => setCurrentTeamMember({ ...currentTeamMember, name: e.target.value })}
                            placeholder="Full Name *"
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                          />
                          <input
                            type="email"
                            value={currentTeamMember.email}
                            onChange={(e) => setCurrentTeamMember({ ...currentTeamMember, email: e.target.value })}
                            placeholder="Email *"
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                          />
                          <input
                            type="text"
                            value={currentTeamMember.rollNumber}
                            onChange={(e) => setCurrentTeamMember({ ...currentTeamMember, rollNumber: e.target.value })}
                            placeholder="Roll Number *"
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                          />
                          <input
                            type="text"
                            value={currentTeamMember.department}
                            onChange={(e) => setCurrentTeamMember({ ...currentTeamMember, department: e.target.value })}
                            placeholder="Department"
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                          />
                          <input
                            type="text"
                            value={currentTeamMember.year}
                            onChange={(e) => setCurrentTeamMember({ ...currentTeamMember, year: e.target.value })}
                            placeholder="Year"
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                          />
                          <button
                            onClick={addTeamMember}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Member
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {/* Summary Info */}
                {(teamMembers.length > 0 || odSubjects.length > 0 || sameClassStudents.length > 0) && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <h4 className="text-green-200 font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Registration Summary
                    </h4>
                    <div className="text-green-200/80 text-sm space-y-1">
                      {teamMembers.length > 0 && <p>• Team Members: {teamMembers.length + 1} / {selectedEvent.maxTeamSize}</p>}
                      {odSubjects.length > 0 && <p>• Subjects for OD: {odSubjects.length} subject(s)</p>}
                      {sameClassStudents.length > 0 && <p>• Same Class Students: {sameClassStudents.length} student(s)</p>}
                      {odEventName && <p>• Event Name for OD: {odEventName}</p>}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRegisterModal(false);
                      setTeamMembers([]);
                      setOdEventName("");
                      setOdSubjects([]);
                      setSameClassStudents([]);
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegister}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit Registration
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
