"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardList,
  GraduationCap,
  Building2,
  Hash,
  Layers,
  Target,
  ArrowLeft,
  Plus,
  Eye,
  Trash2,
  Download,
  Filter,
  Search,
  Sparkles,
  Code2,
  School,
  Users,
  Info,
  Bell,
  LogOut,
  X,
  Upload,
  Edit,
} from "lucide-react";

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  maxTeamSize: number;
  status?: string;
}

interface TeamMember {
  name: string;
  email: string;
  rollNumber: string;
  department: string;
}

interface ODRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  studentRoll: string;
  studentDepartment: string;
  studentYear: string;
  studentSection: string;
  
  // Event Details
  selectedEventId?: string;
  selectedEventTitle?: string;
  eventNameForOD?: string;
  
  // Time Details
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  
  // Faculty Details
  facultyName: string;
  facultyCode: string;
  subjectName: string;
  subjects?: string[]; // Multiple subjects
  
  // Class Details
  course: string; // BTech, BCA, BSc
  program: string; // CSE, IT, ECE, Mechanical, Civil
  semester: string; // 1-8
  section: string; // A-E
  sameClassStudents?: string[]; // Multiple students from same class
  
  // Team Details
  teamMembers?: TeamMember[];
  
  // Request Details
  purpose: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  remarks?: string;
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

export default function ODRequestPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [odRequests, setOdRequests] = useState<ODRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ODRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"create" | "my-requests">("create");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    selectedEventId: "",
    eventNameForOD: "",
    dateFrom: "",
    dateTo: "",
    timeFrom: "",
    timeTo: "",
    facultyName: "",
    facultyCode: "",
    subjectName: "",
    course: "",
    program: "",
    semester: "",
    section: "",
    purpose: "",
  });

  // Multiple fields state
  const [subjects, setSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [sameClassStudents, setSameClassStudents] = useState<string[]>([]);
  const [currentClassmate, setCurrentClassmate] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentTeamMember, setCurrentTeamMember] = useState<TeamMember>({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
  });

  // Options
  const courses = ["BTech", "BCA", "BSc", "MCA", "MTech", "BBA", "MBA"];
  const programs = ["CSE", "IT", "ECE", "Mechanical", "Civil", "EEE", "Chemical", "Aerospace"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const sections = ["A", "B", "C", "D", "E"];

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

    // Pre-fill form with user data
    setFormData(prev => ({
      ...prev,
      section: user.section || "",
    }));

    // Load OD requests
    loadODRequests(user.rollNumber);

    // Load events
    loadEvents();

    setIsLoading(false);
  }, [router]);

  const loadEvents = () => {
    const storedEvents = localStorage.getItem("facultyEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const activeEvents = parsedEvents.filter((e: Event) => e.status === "active");
      setEvents(activeEvents);
    }
  };

  const loadODRequests = (rollNumber: string) => {
    const storedRequests = localStorage.getItem("odRequests");
    if (storedRequests) {
      const parsedRequests = JSON.parse(storedRequests);
      const myRequests = parsedRequests.filter((req: ODRequest) => req.studentRoll === rollNumber);
      setOdRequests(myRequests);
      setFilteredRequests(myRequests);
    }
  };

  // Filter requests
  useEffect(() => {
    let filtered = odRequests;

    if (filterStatus !== "all") {
      filtered = filtered.filter((req) => req.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (req) =>
          req.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.purpose.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [filterStatus, searchQuery, odRequests]);

  const handleSubmit = () => {
    // Validation
    if (!formData.dateFrom || !formData.dateTo || !formData.timeFrom || !formData.timeTo) {
      alert("⚠️ Please fill in all date and time fields");
      return;
    }

    if (!formData.facultyName || !formData.facultyCode || !formData.subjectName) {
      alert("⚠️ Please fill in all faculty and subject details");
      return;
    }

    if (!formData.course || !formData.program || !formData.semester || !formData.section) {
      alert("⚠️ Please fill in all class details");
      return;
    }

    if (!formData.purpose || formData.purpose.length < 10) {
      alert("⚠️ Please provide a detailed purpose (min 10 characters)");
      return;
    }

    // Validate dates
    const from = new Date(formData.dateFrom);
    const to = new Date(formData.dateTo);
    if (from > to) {
      alert("⚠️ 'Date From' cannot be after 'Date To'");
      return;
    }

    if (!currentUser) return;

    const selectedEvent = events.find(e => e.id === formData.selectedEventId);

    const newRequest: ODRequest = {
      id: `od-${Date.now()}`,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentRoll: currentUser.rollNumber,
      studentDepartment: currentUser.department,
      studentYear: currentUser.year,
      studentSection: currentUser.section,
      selectedEventId: formData.selectedEventId || undefined,
      selectedEventTitle: selectedEvent?.title || undefined,
      eventNameForOD: formData.eventNameForOD || undefined,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      timeFrom: formData.timeFrom,
      timeTo: formData.timeTo,
      facultyName: formData.facultyName,
      facultyCode: formData.facultyCode,
      subjectName: formData.subjectName,
      subjects: subjects.length > 0 ? subjects : undefined,
      course: formData.course,
      program: formData.program,
      semester: formData.semester,
      section: formData.section,
      sameClassStudents: sameClassStudents.length > 0 ? sameClassStudents : undefined,
      teamMembers: teamMembers.length > 0 ? teamMembers : undefined,
      purpose: formData.purpose,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const storedRequests = localStorage.getItem("odRequests");
    const existingRequests = storedRequests ? JSON.parse(storedRequests) : [];
    const updatedRequests = [...existingRequests, newRequest];
    localStorage.setItem("odRequests", JSON.stringify(updatedRequests));

    loadODRequests(currentUser.rollNumber);
    resetForm();
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setActiveTab("my-requests");
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      selectedEventId: "",
      eventNameForOD: "",
      dateFrom: "",
      dateTo: "",
      timeFrom: "",
      timeTo: "",
      facultyName: "",
      facultyCode: "",
      subjectName: "",
      course: "",
      program: "",
      semester: "",
      section: currentUser?.section || "",
      purpose: "",
    });
    setSubjects([]);
    setSameClassStudents([]);
    setTeamMembers([]);
    setCurrentSubject("");
    setCurrentClassmate("");
    setCurrentTeamMember({ name: "", email: "", rollNumber: "", department: "" });
  };

  const addSubject = () => {
    if (currentSubject.trim()) {
      setSubjects([...subjects, currentSubject.trim()]);
      setCurrentSubject("");
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const addClassmate = () => {
    if (currentClassmate.trim()) {
      setSameClassStudents([...sameClassStudents, currentClassmate.trim()]);
      setCurrentClassmate("");
    }
  };

  const removeClassmate = (index: number) => {
    setSameClassStudents(sameClassStudents.filter((_, i) => i !== index));
  };

  const addTeamMember = () => {
    if (currentTeamMember.name && currentTeamMember.rollNumber) {
      setTeamMembers([...teamMembers, currentTeamMember]);
      setCurrentTeamMember({ name: "", email: "", rollNumber: "", department: "" });
    } else {
      alert("Please fill in at least name and roll number");
    }
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleDelete = (requestId: string) => {
    if (!confirm("Are you sure you want to delete this OD request?")) return;

    const storedRequests = localStorage.getItem("odRequests");
    if (storedRequests) {
      const parsedRequests = JSON.parse(storedRequests);
      const updatedRequests = parsedRequests.filter((req: ODRequest) => req.id !== requestId);
      localStorage.setItem("odRequests", JSON.stringify(updatedRequests));
      if (currentUser) {
        loadODRequests(currentUser.rollNumber);
      }
      alert("✅ OD request deleted successfully");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "from-green-500 to-emerald-500";
      case "rejected":
        return "from-red-500 to-rose-500";
      default:
        return "from-yellow-500 to-amber-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle;
      case "rejected":
        return XCircle;
      default:
        return Clock;
    }
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
              <button
                onClick={() => router.push("/events/student")}
                className="p-2 hover:bg-white/10 rounded-xl transition"
              >
                <ArrowLeft className="w-6 h-6 text-purple-300" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    OD Request System
                  </h1>
                  <p className="text-sm text-purple-300/70">On Duty Request Management</p>
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
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/5 text-purple-300 hover:bg-white/10"
              }`}
            >
              <Plus className="w-4 h-4" />
              Create Request
            </button>
            <button
              onClick={() => setActiveTab("my-requests")}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                activeTab === "my-requests"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/5 text-purple-300 hover:bg-white/10"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              My Requests
              {odRequests.length > 0 && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {odRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-4xl mx-auto">
                {/* Info Banner */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Info className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Submit OD Request</h3>
                    <p className="text-purple-200/80 text-sm leading-relaxed">
                      Fill in all the required details accurately. Your request will be sent to the faculty for approval. 
                      Make sure to provide a clear purpose and correct class details.
                    </p>
                  </div>
                </div>

                {/* OD Request Form */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                  <div className="space-y-8">
                    {/* Time Details Section */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-purple-400" />
                        Time Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Date From *</label>
                          <input
                            type="date"
                            value={formData.dateFrom}
                            onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Date To *</label>
                          <input
                            type="date"
                            value={formData.dateTo}
                            onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Time From *</label>
                          <input
                            type="time"
                            value={formData.timeFrom}
                            onChange={(e) => setFormData({ ...formData, timeFrom: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Time To *</label>
                          <input
                            type="time"
                            value={formData.timeTo}
                            onChange={(e) => setFormData({ ...formData, timeTo: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10"></div>

                    {/* Event Selection Section */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-indigo-400" />
                        Event Details (Optional)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Select Event</label>
                          <select
                            value={formData.selectedEventId}
                            onChange={(e) => setFormData({ ...formData, selectedEventId: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                          >
                            <option value="">No event selected</option>
                            {events.map((event) => (
                              <option key={event.id} value={event.id}>
                                {event.title} - {event.date}
                              </option>
                            ))}
                          </select>
                          <p className="text-purple-300/60 text-sm mt-2">
                            Select if OD is for an event
                          </p>
                        </div>
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Event Name for OD</label>
                          <input
                            type="text"
                            value={formData.eventNameForOD}
                            onChange={(e) => setFormData({ ...formData, eventNameForOD: e.target.value })}
                            placeholder="Hackathon 2024"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                          />
                          <p className="text-purple-300/60 text-sm mt-2">
                            Custom event name for OD document
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10"></div>

                    {/* Faculty & Subject Details Section */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <User className="w-6 h-6 text-pink-400" />
                        Faculty & Subject Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Faculty Name *</label>
                          <input
                            type="text"
                            value={formData.facultyName}
                            onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                            placeholder="Dr. John Smith"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Faculty Code *</label>
                          <input
                            type="text"
                            value={formData.facultyCode}
                            onChange={(e) => setFormData({ ...formData, facultyCode: e.target.value })}
                            placeholder="FAC001"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-purple-200 font-semibold mb-2">Subject Name *</label>
                          <input
                            type="text"
                            value={formData.subjectName}
                            onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                            placeholder="Data Structures and Algorithms"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                            required
                          />
                        </div>
                      </div>

                      {/* Multiple Subjects */}
                      <div className="mt-4">
                        <label className="block text-purple-200 font-semibold mb-2">Additional Subjects (Optional)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentSubject}
                            onChange={(e) => setCurrentSubject(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                            placeholder="Add subject name and press +"
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                          />
                          <button
                            type="button"
                            onClick={addSubject}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-bold transition shadow-lg shadow-purple-500/50 flex items-center gap-2"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        {subjects.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {subjects.map((subject, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-200 flex items-center gap-2 group hover:bg-purple-500/30 transition"
                              >
                                <span>{subject}</span>
                                <button
                                  onClick={() => removeSubject(index)}
                                  className="text-purple-300 hover:text-red-400 transition"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10"></div>

                    {/* Class Details Section */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <School className="w-6 h-6 text-blue-400" />
                        Class Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Course *</label>
                          <select
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                            required
                          >
                            <option value="">Select Course</option>
                            {courses.map((course) => (
                              <option key={course} value={course}>
                                {course}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Program *</label>
                          <select
                            value={formData.program}
                            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                            required
                          >
                            <option value="">Select Program</option>
                            {programs.map((program) => (
                              <option key={program} value={program}>
                                {program}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Semester *</label>
                          <select
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                            required
                          >
                            <option value="">Select Semester</option>
                            {semesters.map((sem) => (
                              <option key={sem} value={sem}>
                                Semester {sem}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-purple-200 font-semibold mb-2">Section *</label>
                          <select
                            value={formData.section}
                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                            required
                          >
                            <option value="">Select Section</option>
                            {sections.map((sec) => (
                              <option key={sec} value={sec}>
                                Section {sec}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Same Class Students Section */}
                    <div className="mt-4">
                      <label className="block text-purple-200 font-semibold mb-2">Same Class Students (Optional)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentClassmate}
                          onChange={(e) => setCurrentClassmate(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addClassmate())}
                          placeholder="Add student name and press +"
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                        />
                        <button
                          type="button"
                          onClick={addClassmate}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl text-white font-bold transition shadow-lg shadow-blue-500/50 flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-purple-300/60 text-sm mt-2">
                        Add names of students from your class requesting OD for the same event
                      </p>
                      {sameClassStudents.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {sameClassStudents.map((student, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-200 flex items-center gap-2 group hover:bg-blue-500/30 transition"
                            >
                              <Users className="w-4 h-4" />
                              <span>{student}</span>
                              <button
                                onClick={() => removeClassmate(index)}
                                className="text-blue-300 hover:text-red-400 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10"></div>

                    {/* Team Members Section */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="w-6 h-6 text-cyan-400" />
                        Team Members (Optional)
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-purple-200 font-semibold mb-2">Member Name</label>
                            <input
                              type="text"
                              value={currentTeamMember.name}
                              onChange={(e) => setCurrentTeamMember({ ...currentTeamMember, name: e.target.value })}
                              placeholder="John Doe"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                            />
                          </div>
                          <div>
                            <label className="block text-purple-200 font-semibold mb-2">Roll Number</label>
                            <input
                              type="text"
                              value={currentTeamMember.rollNumber}
                              onChange={(e) => setCurrentTeamMember({ ...currentTeamMember, rollNumber: e.target.value })}
                              placeholder="A12345"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                            />
                          </div>
                          <div>
                            <label className="block text-purple-200 font-semibold mb-2">Email (Optional)</label>
                            <input
                              type="email"
                              value={currentTeamMember.email}
                              onChange={(e) => setCurrentTeamMember({ ...currentTeamMember, email: e.target.value })}
                              placeholder="john@example.com"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                            />
                          </div>
                          <div>
                            <label className="block text-purple-200 font-semibold mb-2">Department (Optional)</label>
                            <input
                              type="text"
                              value={currentTeamMember.department}
                              onChange={(e) => setCurrentTeamMember({ ...currentTeamMember, department: e.target.value })}
                              placeholder="Computer Science"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold transition shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Add Team Member
                        </button>
                      </div>
                      
                      {teamMembers.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-purple-200 font-semibold">Team Members ({teamMembers.length})</p>
                          <div className="space-y-2">
                            {teamMembers.map((member, index) => (
                              <div
                                key={index}
                                className="p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl flex items-center justify-between group hover:bg-cyan-500/20 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                                    <Users className="w-5 h-5 text-cyan-400" />
                                  </div>
                                  <div>
                                    <p className="text-white font-semibold">{member.name}</p>
                                    <p className="text-cyan-200/70 text-sm">
                                      {member.rollNumber}
                                      {member.department && ` • ${member.department}`}
                                      {member.email && ` • ${member.email}`}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeTeamMember(index)}
                                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-red-200 transition flex items-center gap-2"
                                >
                                  <X className="w-4 h-4" />
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10"></div>

                    {/* Purpose Section */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-green-400" />
                        Purpose of OD
                      </h3>
                      <div>
                        <label className="block text-purple-200 font-semibold mb-2">Describe the purpose *</label>
                        <textarea
                          value={formData.purpose}
                          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                          placeholder="Please provide detailed information about why you need this OD. Include event name, location, and any other relevant details..."
                          rows={6}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition resize-none"
                          required
                        />
                        <p className="text-purple-300/60 text-sm mt-2">
                          Minimum 10 characters. Be specific and clear about the purpose.
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={resetForm}
                        className="flex-1 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition"
                      >
                        Reset Form
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-bold text-lg transition shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Submit OD Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "my-requests" && (
            <motion.div
              key="my-requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <ClipboardList className="w-8 h-8 text-blue-400" />
                    <span className="text-3xl font-bold text-white">{odRequests.length}</span>
                  </div>
                  <p className="text-purple-200 font-semibold">Total Requests</p>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-yellow-400" />
                    <span className="text-3xl font-bold text-white">
                      {odRequests.filter((req) => req.status === "pending").length}
                    </span>
                  </div>
                  <p className="text-purple-200 font-semibold">Pending</p>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <span className="text-3xl font-bold text-white">
                      {odRequests.filter((req) => req.status === "approved").length}
                    </span>
                  </div>
                  <p className="text-purple-200 font-semibold">Approved</p>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <XCircle className="w-8 h-8 text-red-400" />
                    <span className="text-3xl font-bold text-white">
                      {odRequests.filter((req) => req.status === "rejected").length}
                    </span>
                  </div>
                  <p className="text-purple-200 font-semibold">Rejected</p>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by faculty, subject, or purpose..."
                    className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-400 transition"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Requests List */}
              {filteredRequests.length === 0 ? (
                <div className="text-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardList className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No OD Requests Yet</h3>
                  <p className="text-purple-300/70 mb-6">Create your first OD request to get started!</p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                  >
                    Create Request
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((request, index) => {
                    const StatusIcon = getStatusIcon(request.status);
                    
                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400/50 transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{request.subjectName}</h3>
                                <span className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(request.status)} rounded-full text-xs font-semibold text-white flex items-center gap-1`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-purple-300/70 text-sm">Faculty: {request.facultyName} ({request.facultyCode})</p>
                            </div>
                            
                            {request.status === "pending" && (
                              <button
                                onClick={() => handleDelete(request.id)}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-purple-300 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(request.dateFrom).toLocaleDateString()} - {new Date(request.dateTo).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-300 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{request.timeFrom} - {request.timeTo}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-300 text-sm">
                              <School className="w-4 h-4" />
                              <span>{request.course} - {request.program} - Sem {request.semester} - Sec {request.section}</span>
                            </div>
                            <div className="text-purple-300/60 text-sm">
                              Requested: {new Date(request.requestedAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="p-4 bg-white/5 rounded-xl mb-4">
                            <p className="text-sm text-purple-300/70 mb-1 font-semibold">Purpose:</p>
                            <p className="text-white text-sm">{request.purpose}</p>
                          </div>

                          {request.status === "rejected" && request.remarks && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                              <p className="text-sm text-red-300/70 mb-1 font-semibold">Rejection Remarks:</p>
                              <p className="text-red-200 text-sm">{request.remarks}</p>
                            </div>
                          )}

                          {request.status === "approved" && request.reviewedBy && (
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                              <p className="text-sm text-green-300/70">
                                Approved by {request.reviewedBy} on {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : "N/A"}
                              </p>
                            </div>
                          )}
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

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-3xl p-8 max-w-md text-center"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Request Submitted!</h3>
              <p className="text-green-200 text-lg">
                Your OD request has been submitted successfully. Faculty will review it soon.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
