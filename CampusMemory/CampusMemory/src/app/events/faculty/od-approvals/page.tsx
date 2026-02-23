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
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardList,
  GraduationCap,
  School,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Download,
  Bell,
  LogOut,
  Sparkles,
  Users,
  TrendingUp,
  Target,
  Award,
  BarChart3,
  X,
  Send,
  Info,
} from "lucide-react";

// Types
interface ODRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  studentRoll: string;
  studentDepartment: string;
  studentYear: string;
  studentSection: string;
  
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  
  facultyName: string;
  facultyCode: string;
  subjectName: string;
  
  course: string;
  program: string;
  semester: string;
  section: string;
  
  purpose: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  remarks?: string;
}

interface FacultyUser {
  name: string;
  email: string;
  employeeId: string;
  designation: string;
  facultyDepartment: string;
}

export default function ODApprovalsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<FacultyUser | null>(null);
  const [odRequests, setOdRequests] = useState<ODRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ODRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ODRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("eventsCurrentUser");
    if (!userData) {
      router.push("/events/auth");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "faculty") {
      alert("Access denied. Faculty access only.");
      router.push("/events/auth");
      return;
    }

    setCurrentUser(user);

    // Load OD requests
    loadODRequests();

    setIsLoading(false);
  }, [router]);

  const loadODRequests = () => {
    const storedRequests = localStorage.getItem("odRequests");
    if (storedRequests) {
      const parsedRequests = JSON.parse(storedRequests);
      setOdRequests(parsedRequests);
      setFilteredRequests(parsedRequests.filter((req: ODRequest) => req.status === "pending"));
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
          req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.purpose.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [filterStatus, searchQuery, odRequests]);

  const handleApprove = () => {
    if (!selectedRequest || !currentUser) return;

    const storedRequests = localStorage.getItem("odRequests");
    if (storedRequests) {
      const parsedRequests = JSON.parse(storedRequests);
      const updatedRequests = parsedRequests.map((req: ODRequest) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "approved",
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser.name,
              remarks: remarks || "Approved",
            }
          : req
      );
      localStorage.setItem("odRequests", JSON.stringify(updatedRequests));
      loadODRequests();
      setSelectedRequest(null);
      setShowApproveModal(false);
      setShowDetailsModal(false);
      setRemarks("");
      alert("✅ OD request approved successfully!");
    }
  };

  const handleReject = () => {
    if (!selectedRequest || !currentUser) return;

    if (!remarks) {
      alert("⚠️ Please provide a reason for rejection");
      return;
    }

    const storedRequests = localStorage.getItem("odRequests");
    if (storedRequests) {
      const parsedRequests = JSON.parse(storedRequests);
      const updatedRequests = parsedRequests.map((req: ODRequest) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "rejected",
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser.name,
              remarks: remarks,
            }
          : req
      );
      localStorage.setItem("odRequests", JSON.stringify(updatedRequests));
      loadODRequests();
      setSelectedRequest(null);
      setShowRejectModal(false);
      setShowDetailsModal(false);
      setRemarks("");
      alert("❌ OD request rejected!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("eventsCurrentUser");
    router.push("/events/auth");
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
                onClick={() => router.push("/events/faculty")}
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
                    OD Approvals
                  </h1>
                  <p className="text-sm text-purple-300/70">Review & Manage OD Requests</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <User className="w-4 h-4 text-purple-400" />
                <div className="text-sm">
                  <p className="text-white font-semibold">{currentUser?.name}</p>
                  <p className="text-purple-300/70 text-xs">{currentUser?.designation}</p>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <ClipboardList className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">{odRequests.length}</span>
            </div>
            <p className="text-purple-200 font-semibold">Total Requests</p>
            <p className="text-purple-300/60 text-sm mt-1">All time requests</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-400" />
              <span className="text-3xl font-bold text-white">
                {odRequests.filter((req) => req.status === "pending").length}
              </span>
            </div>
            <p className="text-purple-200 font-semibold">Pending Review</p>
            <p className="text-purple-300/60 text-sm mt-1">Awaiting approval</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-white">
                {odRequests.filter((req) => req.status === "approved").length}
              </span>
            </div>
            <p className="text-purple-200 font-semibold">Approved</p>
            <p className="text-purple-300/60 text-sm mt-1">Successfully approved</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-400" />
              <span className="text-3xl font-bold text-white">
                {odRequests.filter((req) => req.status === "rejected").length}
              </span>
            </div>
            <p className="text-purple-200 font-semibold">Rejected</p>
            <p className="text-purple-300/60 text-sm mt-1">Declined requests</p>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, subject, or purpose..."
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
            <h3 className="text-2xl font-bold text-white mb-2">
              {filterStatus === "pending" ? "No Pending Requests" : "No Requests Found"}
            </h3>
            <p className="text-purple-300/70">
              {filterStatus === "pending" ? "All OD requests have been reviewed!" : "Try adjusting your filters"}
            </p>
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
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{request.studentName}</h3>
                            <p className="text-purple-300/70 text-sm">{request.studentRoll} • {request.studentDepartment} • Year {request.studentYear}</p>
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-4 py-2 bg-gradient-to-r ${getStatusColor(request.status)} rounded-xl text-sm font-semibold text-white flex items-center gap-2 shadow-lg`}>
                        <StatusIcon className="w-4 h-4" />
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <p className="text-purple-300/70 text-xs mb-1">Subject & Faculty</p>
                        <p className="text-white font-semibold text-sm">{request.subjectName}</p>
                        <p className="text-purple-200/80 text-sm">{request.facultyName} ({request.facultyCode})</p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl">
                        <p className="text-purple-300/70 text-xs mb-1">Duration</p>
                        <p className="text-white font-semibold text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(request.dateFrom).toLocaleDateString()} - {new Date(request.dateTo).toLocaleDateString()}
                        </p>
                        <p className="text-purple-200/80 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {request.timeFrom} - {request.timeTo}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-white/5 rounded-xl">
                        <p className="text-purple-300/70 text-xs mb-1">Class Details</p>
                        <p className="text-white font-semibold text-sm">{request.course} - {request.program}</p>
                        <p className="text-purple-200/80 text-sm">Sem {request.semester} • Section {request.section}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl mb-4">
                      <p className="text-sm text-purple-300/70 mb-1 font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Purpose of OD:
                      </p>
                      <p className="text-white text-sm leading-relaxed">{request.purpose}</p>
                    </div>

                    {request.status !== "pending" && request.remarks && (
                      <div className={`p-4 rounded-xl mb-4 ${
                        request.status === "approved" 
                          ? "bg-green-500/10 border border-green-500/30" 
                          : "bg-red-500/10 border border-red-500/30"
                      }`}>
                        <p className={`text-sm mb-1 font-semibold ${
                          request.status === "approved" ? "text-green-300/70" : "text-red-300/70"
                        }`}>
                          {request.status === "approved" ? "Approval" : "Rejection"} Remarks:
                        </p>
                        <p className={`text-sm ${
                          request.status === "approved" ? "text-green-200" : "text-red-200"
                        }`}>
                          {request.remarks}
                        </p>
                        <p className="text-xs text-purple-300/50 mt-2">
                          Reviewed by {request.reviewedBy} on {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowApproveModal(true);
                            }}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/50"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRejectModal(true);
                            }}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/50"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedRequest && (
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
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">OD Request Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Student Info */}
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-purple-400" />
                      Student Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-purple-300/70 text-sm">Name</p>
                        <p className="text-white font-semibold">{selectedRequest.studentName}</p>
                      </div>
                      <div>
                        <p className="text-purple-300/70 text-sm">Roll Number</p>
                        <p className="text-white font-semibold">{selectedRequest.studentRoll}</p>
                      </div>
                      <div>
                        <p className="text-purple-300/70 text-sm">Department</p>
                        <p className="text-white font-semibold">{selectedRequest.studentDepartment}</p>
                      </div>
                      <div>
                        <p className="text-purple-300/70 text-sm">Year & Section</p>
                        <p className="text-white font-semibold">Year {selectedRequest.studentYear} • Section {selectedRequest.studentSection}</p>
                      </div>
                    </div>
                  </div>

                  {/* Time Details */}
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-pink-400" />
                      Duration
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-purple-300/70 text-sm">From</p>
                        <p className="text-white font-semibold">{new Date(selectedRequest.dateFrom).toLocaleDateString()} @ {selectedRequest.timeFrom}</p>
                      </div>
                      <div>
                        <p className="text-purple-300/70 text-sm">To</p>
                        <p className="text-white font-semibold">{new Date(selectedRequest.dateTo).toLocaleDateString()} @ {selectedRequest.timeTo}</p>
                      </div>
                    </div>
                  </div>

                  {/* Faculty & Subject */}
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      Faculty & Subject
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-purple-300/70 text-sm">Faculty Name</p>
                        <p className="text-white font-semibold">{selectedRequest.facultyName}</p>
                      </div>
                      <div>
                        <p className="text-purple-300/70 text-sm">Faculty Code</p>
                        <p className="text-white font-semibold">{selectedRequest.facultyCode}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-purple-300/70 text-sm">Subject</p>
                        <p className="text-white font-semibold">{selectedRequest.subjectName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Class Details */}
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <School className="w-5 h-5 text-green-400" />
                      Class Details
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-purple-300/70 text-sm">Course</p>
                        <p className="text-white font-semibold">{selectedRequest.course}</p>
                      </div>
                      <div>
                        <p className="text-purple-300/70 text-sm">Program</p>
                        <p className="text-white font-semibold">{selectedRequest.program}</p>
                      </div>
                      <div>
                        <p className="text-purple-300/70 text-sm">Semester</p>
                        <p className="text-white font-semibold">{selectedRequest.semester}</p>
                      </div>
                      <div>
                        <p className="text-purple-300/70 text-sm">Section</p>
                        <p className="text-white font-semibold">{selectedRequest.section}</p>
                      </div>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-yellow-400" />
                      Purpose of OD
                    </h3>
                    <p className="text-white leading-relaxed">{selectedRequest.purpose}</p>
                  </div>

                  {/* Request Status */}
                  <div className="text-center text-sm text-purple-300/70">
                    Requested on {new Date(selectedRequest.requestedAt).toLocaleDateString()} at {new Date(selectedRequest.requestedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowApproveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-green-900 border border-green-500/30 rounded-3xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <ThumbsUp className="w-6 h-6 text-green-400" />
                    </div>
                    Approve OD Request
                  </h2>
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <p className="text-white font-semibold mb-1">{selectedRequest.studentName}</p>
                  <p className="text-purple-300/70 text-sm">{selectedRequest.studentRoll} • {selectedRequest.subjectName}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-purple-200 font-semibold mb-2">Approval Remarks (Optional)</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any comments or notes about this approval..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-green-400 transition resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-bold transition shadow-lg shadow-green-500/50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-red-900 border border-red-500/30 rounded-3xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <ThumbsDown className="w-6 h-6 text-red-400" />
                    </div>
                    Reject OD Request
                  </h2>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <p className="text-white font-semibold mb-1">{selectedRequest.studentName}</p>
                  <p className="text-purple-300/70 text-sm">{selectedRequest.studentRoll} • {selectedRequest.subjectName}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-purple-200 font-semibold mb-2">Rejection Reason *</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Please provide a detailed reason for rejecting this OD request..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-red-400 transition resize-none"
                    required
                  />
                  <p className="text-red-300/60 text-sm mt-2">* Required field</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl text-white font-bold transition shadow-lg shadow-red-500/50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Request
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
