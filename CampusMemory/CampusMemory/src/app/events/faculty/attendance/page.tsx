"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  ScanLine,
  UserCheck,
  UserX,
  Users,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Target,
  Zap,
  Star,
  Hash,
  Edit,
  Trash2,
  Plus,
  X,
  Check,
  ArrowLeft,
  RefreshCw,
  FileText,
  Send,
  Mail,
  Sparkles,
  Timer,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Flag,
  Bookmark,
  ThumbsUp,
  Info,
  User,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  maxParticipants: number;
  registrations: Registration[];
  attendance: AttendanceRecord[];
}

interface Registration {
  id: string;
  studentName: string;
  studentEmail: string;
  studentRoll: string;
  studentDepartment: string;
  studentYear: string;
  status: string;
}

interface AttendanceRecord {
  id: string;
  studentRoll: string;
  studentName: string;
  markedAt: string;
  markedBy: string;
  status: "present" | "absent" | "late";
  notes?: string;
}

function AttendancePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventIdFromUrl = searchParams?.get("eventId");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [attendanceMode, setAttendanceMode] = useState<"manual" | "qr" | "bulk">("manual");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "present" | "absent" | "pending">("all");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [manualRollNumber, setManualRollNumber] = useState("");
  const [attendanceNotes, setAttendanceNotes] = useState("");
  const [isMarking, setIsMarking] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false);
  const [selectedStudentInfo, setSelectedStudentInfo] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("eventsCurrentUser");
    if (!userData) {
      router.push("/events/auth");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "faculty" && user.role !== "admin") {
      alert("Access denied. Faculty access required.");
      router.push("/events/auth");
      return;
    }

    setCurrentUser(user);

    // Load events
    const storedEvents = localStorage.getItem("facultyEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      setEvents(parsedEvents);

      // Auto-select event from URL if provided
      if (eventIdFromUrl) {
        const event = parsedEvents.find((e: Event) => e.id === eventIdFromUrl);
        if (event) setSelectedEvent(event);
      } else if (parsedEvents.length > 0) {
        setSelectedEvent(parsedEvents[0]);
      }
    }
  }, [router, eventIdFromUrl]);

  // Calculate statistics for selected event
  const stats = selectedEvent
    ? {
        totalRegistrations: selectedEvent.registrations.filter((r) => r.status === "approved").length,
        totalPresent: selectedEvent.attendance.filter((a) => a.status === "present").length,
        totalAbsent: selectedEvent.registrations.filter((r) => r.status === "approved").length -
          selectedEvent.attendance.filter((a) => a.status === "present" || a.status === "late").length,
        totalLate: selectedEvent.attendance.filter((a) => a.status === "late").length,
        attendanceRate: selectedEvent.registrations.filter((r) => r.status === "approved").length > 0
          ? Math.round(
              (selectedEvent.attendance.filter((a) => a.status === "present" || a.status === "late").length /
                selectedEvent.registrations.filter((r) => r.status === "approved").length) *
                100
            )
          : 0,
      }
    : { totalRegistrations: 0, totalPresent: 0, totalAbsent: 0, totalLate: 0, attendanceRate: 0 };

  // Get students with attendance status
  const getStudentsList = () => {
    if (!selectedEvent) return [];

    return selectedEvent.registrations
      .filter((r) => r.status === "approved")
      .map((reg) => {
        const attendanceRecord = selectedEvent.attendance.find((a) => a.studentRoll === reg.studentRoll);
        return {
          ...reg,
          attendanceStatus: attendanceRecord?.status || "pending",
          markedAt: attendanceRecord?.markedAt,
          notes: attendanceRecord?.notes,
        };
      });
  };

  // Filter students based on search and status
  const filteredStudents = getStudentsList().filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentRoll.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || student.attendanceStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Mark attendance manually
  const handleMarkAttendance = (rollNumber: string, status: "present" | "late") => {
    if (!selectedEvent || !currentUser) return;

    const student = selectedEvent.registrations.find((r) => r.studentRoll === rollNumber);
    if (!student) {
      alert("❌ Student not found in registration list!");
      return;
    }

    // Check if already marked
    const existingAttendance = selectedEvent.attendance.find((a) => a.studentRoll === rollNumber);
    if (existingAttendance) {
      alert("⚠️ Attendance already marked for this student!");
      return;
    }

    setIsMarking(true);

    // Create attendance record
    const newAttendance: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentRoll: rollNumber,
      studentName: student.studentName,
      markedAt: new Date().toISOString(),
      markedBy: currentUser.name,
      status: status,
      notes: attendanceNotes || undefined,
    };

    // Update event with new attendance
    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          attendance: [...event.attendance, newAttendance],
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setSelectedEvent({
      ...selectedEvent,
      attendance: [...selectedEvent.attendance, newAttendance],
    });
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));

    // Show success message
    setSuccessMessage(`✅ Attendance marked for ${student.studentName}!`);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);

    // Reset form
    setManualRollNumber("");
    setAttendanceNotes("");
    setIsMarking(false);
  };

  // Remove attendance record
  const handleRemoveAttendance = (rollNumber: string) => {
    if (!selectedEvent || !confirm("Are you sure you want to remove this attendance record?")) return;

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          attendance: event.attendance.filter((a) => a.studentRoll !== rollNumber),
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setSelectedEvent({
      ...selectedEvent,
      attendance: selectedEvent.attendance.filter((a) => a.studentRoll !== rollNumber),
    });
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    alert("🗑️ Attendance record removed!");
  };

  // Mark all as present
  const handleMarkAllPresent = () => {
    if (!selectedEvent || !currentUser) return;
    if (!confirm("Are you sure you want to mark all registered students as present?")) return;

    const approvedStudents = selectedEvent.registrations.filter((r) => r.status === "approved");
    const newAttendanceRecords: AttendanceRecord[] = [];

    approvedStudents.forEach((student) => {
      const existingAttendance = selectedEvent.attendance.find((a) => a.studentRoll === student.studentRoll);
      if (!existingAttendance) {
        newAttendanceRecords.push({
          id: `att-${Date.now()}-${student.studentRoll}`,
          studentRoll: student.studentRoll,
          studentName: student.studentName,
          markedAt: new Date().toISOString(),
          markedBy: currentUser.name,
          status: "present",
        });
      }
    });

    if (newAttendanceRecords.length === 0) {
      alert("⚠️ All students already have attendance marked!");
      return;
    }

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          attendance: [...event.attendance, ...newAttendanceRecords],
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setSelectedEvent({
      ...selectedEvent,
      attendance: [...selectedEvent.attendance, ...newAttendanceRecords],
    });
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    alert(`✅ Marked ${newAttendanceRecords.length} students as present!`);
  };

  // Export attendance to CSV
  const handleExportCSV = () => {
    if (!selectedEvent) return;

    const csvContent = [
      ["Roll Number", "Name", "Department", "Year", "Status", "Marked At", "Marked By"],
      ...getStudentsList().map((student) => [
        student.studentRoll,
        student.studentName,
        student.studentDepartment,
        student.studentYear,
        student.attendanceStatus,
        student.markedAt ? new Date(student.markedAt).toLocaleString() : "N/A",
        selectedEvent.attendance.find((a) => a.studentRoll === student.studentRoll)?.markedBy || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedEvent.title}_attendance_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push("/events/faculty")}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>

              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-white">Attendance Management</h1>
                <p className="text-purple-200 text-sm">Mark and track event attendance</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStatsModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden md:inline">Statistics</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportCSV}
                disabled={!selectedEvent}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span className="hidden md:inline">Export</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Selector */}
        <div className="mb-8">
          <label className="block text-purple-200 font-semibold mb-3">Select Event</label>
          <select
            value={selectedEvent?.id || ""}
            onChange={(e) => {
              const event = events.find((ev) => ev.id === e.target.value);
              setSelectedEvent(event || null);
            }}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-purple-400 transition"
          >
            <option value="" className="bg-slate-800">Select an event...</option>
            {events.map((event) => (
              <option key={event.id} value={event.id} className="bg-slate-800">
                {event.title} - {new Date(event.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {selectedEvent ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  label: "Total Registered",
                  value: stats.totalRegistrations,
                  icon: Users,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  label: "Present",
                  value: stats.totalPresent,
                  icon: CheckCircle,
                  color: "from-green-500 to-emerald-500",
                },
                {
                  label: "Absent",
                  value: stats.totalAbsent,
                  icon: XCircle,
                  color: "from-red-500 to-pink-500",
                },
                {
                  label: "Late",
                  value: stats.totalLate,
                  icon: Clock,
                  color: "from-orange-500 to-amber-500",
                },
                {
                  label: "Attendance Rate",
                  value: `${stats.attendanceRate}%`,
                  icon: TrendingUp,
                  color: "from-purple-500 to-indigo-500",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative group"
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-30 group-hover:opacity-75 transition`}
                  />
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg inline-block mb-3`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-purple-200 text-sm">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Attendance Mode Selector */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Mark Attendance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { id: "manual", label: "Manual Entry", icon: Edit, description: "Enter roll number manually" },
                  { id: "qr", label: "QR Scanner", icon: QrCode, description: "Scan student QR codes" },
                  { id: "bulk", label: "Bulk Actions", icon: Users, description: "Mark multiple at once" },
                ].map((mode) => (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAttendanceMode(mode.id as any)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      attendanceMode === mode.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 shadow-xl"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <mode.icon className="w-10 h-10 text-white mb-3 mx-auto" />
                    <h3 className="text-white font-bold mb-1">{mode.label}</h3>
                    <p className="text-purple-200 text-xs">{mode.description}</p>
                  </motion.button>
                ))}
              </div>

              {/* Manual Entry Mode */}
              {attendanceMode === "manual" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-purple-200 font-semibold mb-2">Student Roll Number</label>
                      <input
                        type="text"
                        value={manualRollNumber}
                        onChange={(e) => setManualRollNumber(e.target.value)}
                        placeholder="e.g., 21BCE1234"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-200 font-semibold mb-2">Notes (Optional)</label>
                      <input
                        type="text"
                        value={attendanceNotes}
                        onChange={(e) => setAttendanceNotes(e.target.value)}
                        placeholder="Any additional notes..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMarkAttendance(manualRollNumber, "present")}
                      disabled={!manualRollNumber || isMarking}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark Present
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMarkAttendance(manualRollNumber, "late")}
                      disabled={!manualRollNumber || isMarking}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                    >
                      <Clock className="w-5 h-5" />
                      Mark Late
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* QR Scanner Mode */}
              {attendanceMode === "qr" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <QrCode className="w-20 h-20 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">QR Code Scanner</h3>
                  <p className="text-purple-200 mb-6">
                    Coming soon! Students will be able to scan QR codes for instant attendance marking.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    <ScanLine className="w-5 h-5 inline mr-2" />
                    Activate Scanner
                  </motion.button>
                </motion.div>
              )}

              {/* Bulk Actions Mode */}
              {attendanceMode === "bulk" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMarkAllPresent}
                      className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-bold shadow-lg"
                    >
                      <Users className="w-6 h-6" />
                      Mark All as Present
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-bold shadow-lg"
                    >
                      <Upload className="w-6 h-6" />
                      Import from CSV
                    </motion.button>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-yellow-200 font-semibold mb-1">Bulk Action Warning</p>
                        <p className="text-yellow-300/80 text-sm">
                          Bulk marking will mark all approved registrations as present. This action cannot be easily undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Students List */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  Attendance Records ({filteredStudents.length})
                </h2>

                <div className="flex gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-400 transition"
                  >
                    <option value="all" className="bg-slate-800">All Status</option>
                    <option value="present" className="bg-slate-800">Present</option>
                    <option value="absent" className="bg-slate-800">Absent</option>
                    <option value="pending" className="bg-slate-800">Pending</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-purple-200 font-semibold">Roll No.</th>
                      <th className="text-left p-4 text-purple-200 font-semibold">Name</th>
                      <th className="text-left p-4 text-purple-200 font-semibold">Department</th>
                      <th className="text-left p-4 text-purple-200 font-semibold">Year</th>
                      <th className="text-left p-4 text-purple-200 font-semibold">Status</th>
                      <th className="text-left p-4 text-purple-200 font-semibold">Marked At</th>
                      <th className="text-center p-4 text-purple-200 font-semibold">Info</th>
                      <th className="text-left p-4 text-purple-200 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="p-4">
                          <span className="font-mono text-purple-300">{student.studentRoll}</span>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-semibold">{student.studentName}</p>
                          <p className="text-purple-300 text-xs">{student.studentEmail}</p>
                        </td>
                        <td className="p-4 text-purple-200">{student.studentDepartment}</td>
                        <td className="p-4 text-purple-200">Year {student.studentYear}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              student.attendanceStatus === "present"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : student.attendanceStatus === "late"
                                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                : student.attendanceStatus === "absent"
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                            }`}
                          >
                            {student.attendanceStatus}
                          </span>
                        </td>
                        <td className="p-4 text-purple-200 text-sm">
                          {student.markedAt ? new Date(student.markedAt).toLocaleString() : "-"}
                        </td>
                        <td className="p-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedStudentInfo(student);
                              setShowStudentInfoModal(true);
                            }}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition inline-flex items-center justify-center"
                            title="View Student Details"
                          >
                            <Info className="w-4 h-4 text-blue-300" />
                          </motion.button>
                        </td>
                        <td className="p-4">
                          {student.attendanceStatus === "pending" ? (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleMarkAttendance(student.studentRoll, "present")}
                                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition"
                                title="Mark Present"
                              >
                                <CheckCircle className="w-4 h-4 text-green-300" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleMarkAttendance(student.studentRoll, "late")}
                                className="p-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition"
                                title="Mark Late"
                              >
                                <Clock className="w-4 h-4 text-orange-300" />
                              </motion.button>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveAttendance(student.studentRoll)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4 text-red-300" />
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-purple-300/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Students Found</h3>
                    <p className="text-purple-200">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 text-purple-300/50 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No Event Selected</h3>
            <p className="text-purple-200 mb-6">Select an event from the dropdown above to manage attendance</p>
          </div>
        )}
      </main>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-2xl">
              <CheckCircle className="w-6 h-6 text-white" />
              <p className="text-white font-semibold">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Modal */}
      <AnimatePresence>
        {showStatsModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStatsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-4xl w-full border border-white/20"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                  Detailed Statistics
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowStatsModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Event Info */}
              <div className="bg-white/5 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">{selectedEvent.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-purple-200 text-sm mb-1">Date</p>
                    <p className="text-white font-semibold">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm mb-1">Time</p>
                    <p className="text-white font-semibold">{selectedEvent.time}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm mb-1">Venue</p>
                    <p className="text-white font-semibold">{selectedEvent.venue}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm mb-1">Category</p>
                    <p className="text-white font-semibold">{selectedEvent.category}</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                  <Users className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-blue-400 mb-2">{stats.totalRegistrations}</p>
                  <p className="text-blue-200 text-sm">Total Registered</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-green-400 mb-2">{stats.totalPresent}</p>
                  <p className="text-green-200 text-sm">Present</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/30">
                  <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-red-400 mb-2">{stats.totalAbsent}</p>
                  <p className="text-red-200 text-sm">Absent</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl border border-purple-500/30">
                  <Award className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-purple-400 mb-2">{stats.attendanceRate}%</p>
                  <p className="text-purple-200 text-sm">Attendance Rate</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">Attendance Progress</h3>
                <div className="relative h-8 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.attendanceRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                  >
                    <span className="text-white font-bold text-sm">{stats.attendanceRate}%</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Info Modal */}
      <AnimatePresence>
        {showStudentInfoModal && selectedStudentInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStudentInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-2xl w-full border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Info className="w-7 h-7 text-blue-400" />
                  Student Details
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowStudentInfoModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Full Name</p>
                      <p className="text-white font-semibold">{selectedStudentInfo.studentName}</p>
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Roll Number</p>
                      <p className="text-white font-mono font-semibold">{selectedStudentInfo.studentRoll}</p>
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Email</p>
                      <p className="text-white font-semibold break-all">{selectedStudentInfo.studentEmail}</p>
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Department</p>
                      <p className="text-white font-semibold">{selectedStudentInfo.studentDepartment}</p>
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Year</p>
                      <p className="text-white font-semibold">Year {selectedStudentInfo.studentYear}</p>
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Attendance Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedStudentInfo.attendanceStatus === "present"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : selectedStudentInfo.attendanceStatus === "late"
                            ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                            : selectedStudentInfo.attendanceStatus === "absent"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                        }`}
                      >
                        {selectedStudentInfo.attendanceStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attendance Information */}
                {selectedStudentInfo.markedAt && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Attendance Record
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-green-200 text-sm mb-1">Marked At</p>
                        <p className="text-white font-semibold">{new Date(selectedStudentInfo.markedAt).toLocaleString()}</p>
                      </div>
                      {selectedStudentInfo.notes && (
                        <div className="md:col-span-2">
                          <p className="text-green-200 text-sm mb-1">Notes</p>
                          <p className="text-white">{selectedStudentInfo.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Information */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Event Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Event Name</p>
                      <p className="text-white font-semibold">{selectedEvent?.title}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Event Date</p>
                      <p className="text-white font-semibold">{selectedEvent && new Date(selectedEvent.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Venue</p>
                      <p className="text-white font-semibold">{selectedEvent?.venue}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Category</p>
                      <p className="text-white font-semibold">{selectedEvent?.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowStudentInfoModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading attendance...</p>
        </div>
      </div>
    }>
      <AttendancePageContent />
    </Suspense>
  );
}
