"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  Shield,
  GraduationCap,
  BookOpen,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Briefcase,
  Hash,
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Star,
  Award,
  Eye,
  EyeOff,
  ChevronRight,
  LogIn,
  UserPlus,
  Crown,
  BadgeCheck,
  Rocket,
} from "lucide-react";

type Role = "admin" | "faculty" | "student";
type Mode = "login" | "signup";

interface FormData {
  // Common fields
  email: string;
  password: string;
  
  // Signup fields
  name?: string;
  phone?: string;
  
  // Student fields
  rollNumber?: string;
  department?: string;
  year?: string;
  section?: string;
  
  // Faculty fields
  employeeId?: string;
  designation?: string;
  facultyDepartment?: string;
  
  // Admin fields
  adminCode?: string;
}

export default function EventsAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate particles for background animation
    const newParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const roles = [
    {
      id: "admin" as Role,
      title: "Admin",
      description: "Full system access and event management",
      icon: Shield,
      gradient: "from-red-500 via-pink-500 to-purple-500",
      glowColor: "rgba(219, 39, 119, 0.3)",
    },
    {
      id: "faculty" as Role,
      title: "Faculty / Coordinator",
      description: "Create and manage events, approve registrations",
      icon: BookOpen,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      glowColor: "rgba(99, 102, 241, 0.3)",
    },
    {
      id: "student" as Role,
      title: "Student",
      description: "Register for events and track participation",
      icon: GraduationCap,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      glowColor: "rgba(168, 85, 247, 0.3)",
    },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Common validation
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (mode === "signup" && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (mode === "signup") {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";

      if (selectedRole === "student") {
        if (!formData.rollNumber) newErrors.rollNumber = "Roll number is required";
        if (!formData.department) newErrors.department = "Department is required";
        if (!formData.year) newErrors.year = "Year is required";
      } else if (selectedRole === "faculty") {
        if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
        if (!formData.designation) newErrors.designation = "Designation is required";
        if (!formData.facultyDepartment) newErrors.facultyDepartment = "Department is required";
      } else if (selectedRole === "admin") {
        if (!formData.adminCode) newErrors.adminCode = "Admin code is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        ...formData,
        role: selectedRole,
        createdAt: new Date().toISOString(),
      };

      if (mode === "signup") {
        // Save to localStorage
        const users = JSON.parse(localStorage.getItem("eventsUsers") || "[]");
        users.push(userData);
        localStorage.setItem("eventsUsers", JSON.stringify(users));
        localStorage.setItem("eventsCurrentUser", JSON.stringify(userData));
        
        alert(`✅ Registration successful! Welcome, ${formData.name}!`);
      } else {
        // Login
        const users = JSON.parse(localStorage.getItem("eventsUsers") || "[]");
        const user = users.find(
          (u: any) => u.email === formData.email && u.password === formData.password && u.role === selectedRole
        );

        if (user) {
          localStorage.setItem("eventsCurrentUser", JSON.stringify(user));
          alert(`✅ Login successful! Welcome back, ${user.name}!`);
        } else {
          setErrors({ email: "Invalid credentials or role mismatch" });
          setIsSubmitting(false);
          return;
        }
      }

      setIsSubmitting(false);
      
      // Redirect based on role
      if (selectedRole === "faculty") {
        router.push("/events/faculty");
      } else if (selectedRole === "admin") {
        router.push("/events/admin"); // Admin dashboard
      } else {
        router.push("/events/student"); // Student dashboard
      }
    }, 1500);
  };

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Floating Particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <Calendar className="relative w-20 h-20 text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Events Portal
              </span>
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              {mode === "login" ? "Welcome back! Sign in to access your dashboard" : "Join the community and start managing events"}
            </p>
          </motion.div>

          {/* OD Portal Button - Above Roles */}
          {!selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <motion.a
                href="https://od-admin.amitycodingclub.social/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative block max-w-4xl mx-auto"
              >
                {/* Animated Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 animate-pulse transition-all duration-500" />

                {/* Card Content */}
                <div className="relative bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 backdrop-blur-xl rounded-3xl p-6 border-2 border-orange-400/40 hover:border-orange-300/60 transition-all duration-300 overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10 group-hover:translate-x-full transition-transform duration-1000" />

                  <div className="relative z-10 flex items-center justify-between gap-6">
                    {/* Left Content */}
                    <div className="flex items-center gap-6">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-2xl"
                      >
                        <Briefcase className="w-10 h-10 text-white" />
                      </motion.div>

                      {/* Text */}
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl md:text-3xl font-black text-white">
                            OD Portal Access
                          </h3>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                          </motion.div>
                        </div>
                        <p className="text-orange-200 text-sm md:text-base font-medium">
                          Quick access to On-Duty (OD) Administration Portal • Manage leaves & approvals
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex-shrink-0"
                    >
                      <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                        <ArrowRight className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Badge */}
                  <div className="mt-4 flex items-center gap-3 text-xs text-orange-300">
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4" />
                      <span>Instant Access</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-orange-400" />
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      <span>No Login Required</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-orange-400" />
                    <div className="flex items-center gap-1">
                      <Rocket className="w-4 h-4" />
                      <span>Opens in New Tab</span>
                    </div>
                  </div>

                  {/* Corner Decorations */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-tr-full" />
                </div>
              </motion.a>
            </motion.div>
          )}

          {/* Role Selection or Auth Form */}
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {roles.map((role, index) => (
                  <motion.button
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole(role.id)}
                    className="group relative"
                  >
                    {/* Glow Effect */}
                    <div
                      className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${role.glowColor}, transparent)`,
                      }}
                    />

                    {/* Card */}
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden">
                      {/* Animated Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon */}
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                          className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${role.gradient} mb-6 shadow-2xl`}
                        >
                          <role.icon className="w-12 h-12 text-white" />
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-300 group-hover:to-pink-300 transition-all">
                          {role.title}
                        </h3>

                        {/* Description */}
                        <p className="text-purple-200 text-sm leading-relaxed mb-6">
                          {role.description}
                        </p>

                        {/* Arrow */}
                        <div className="flex items-center justify-center gap-2 text-purple-300 font-semibold">
                          <span>Select Role</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Corner Decoration */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-full" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="max-w-2xl mx-auto"
              >
                {/* Auth Card */}
                <div className="relative">
                  {/* Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />

                  {/* Main Card */}
                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden">
                    {/* Header with Role Badge */}
                    <div className={`relative bg-gradient-to-r ${selectedRoleData?.gradient} p-6`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedRole(null);
                              setFormData({ email: "", password: "" });
                              setErrors({});
                            }}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
                          >
                            <ChevronRight className="w-5 h-5 text-white rotate-180" />
                          </motion.button>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {selectedRoleData && <selectedRoleData.icon className="w-6 h-6 text-white" />}
                              <h2 className="text-2xl font-bold text-white">{selectedRoleData?.title}</h2>
                            </div>
                            <p className="text-white/80 text-sm">{selectedRoleData?.description}</p>
                          </div>
                        </div>

                        {selectedRole === "admin" && (
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Crown className="w-8 h-8 text-yellow-300" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                        {[
                          { mode: "login" as Mode, label: "Sign In", icon: LogIn },
                          { mode: "signup" as Mode, label: "Sign Up", icon: UserPlus },
                        ].map((item) => (
                          <motion.button
                            key={item.mode}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setMode(item.mode);
                              setErrors({});
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                              mode === item.mode
                                ? `bg-gradient-to-r ${selectedRoleData?.gradient} text-white shadow-lg`
                                : "text-purple-200 hover:bg-white/5"
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                      {/* Name (Signup only) */}
                      {mode === "signup" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className="block text-sm font-semibold text-purple-200 mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                            <input
                              type="text"
                              value={formData.name || ""}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              placeholder="Enter your full name"
                              className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition ${
                                errors.name ? "border-red-400" : "border-white/10"
                              }`}
                            />
                          </div>
                          {errors.name && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-400 text-sm mt-2"
                            >
                              {errors.name}
                            </motion.p>
                          )}
                        </motion.div>
                      )}

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="your.email@example.com"
                            className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition ${
                              errors.email ? "border-red-400" : "border-white/10"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>

                      {/* Phone (Signup only) */}
                      {mode === "signup" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                        >
                          <label className="block text-sm font-semibold text-purple-200 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                            <input
                              type="tel"
                              value={formData.phone || ""}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              placeholder="+1 (555) 000-0000"
                              className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition ${
                                errors.phone ? "border-red-400" : "border-white/10"
                              }`}
                            />
                          </div>
                          {errors.phone && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-red-400 text-sm mt-2"
                            >
                              {errors.phone}
                            </motion.p>
                          )}
                        </motion.div>
                      )}

                      {/* Student-specific fields */}
                      {mode === "signup" && selectedRole === "student" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <label className="block text-sm font-semibold text-purple-200 mb-2">
                              Roll Number *
                            </label>
                            <div className="relative">
                              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                              <input
                                type="text"
                                value={formData.rollNumber || ""}
                                onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                                placeholder="21BCE1234"
                                className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition ${
                                  errors.rollNumber ? "border-red-400" : "border-white/10"
                                }`}
                              />
                            </div>
                            {errors.rollNumber && (
                              <p className="text-red-400 text-xs mt-1">{errors.rollNumber}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-purple-200 mb-2">
                              Department *
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                              <select
                                value={formData.department || ""}
                                onChange={(e) => handleInputChange("department", e.target.value)}
                                className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white focus:outline-none focus:border-purple-400 transition appearance-none ${
                                  errors.department ? "border-red-400" : "border-white/10"
                                }`}
                              >
                                <option value="" className="bg-slate-800">Select Department</option>
                                <option value="CSE" className="bg-slate-800">Computer Science</option>
                                <option value="ECE" className="bg-slate-800">Electronics</option>
                                <option value="ME" className="bg-slate-800">Mechanical</option>
                                <option value="CE" className="bg-slate-800">Civil</option>
                                <option value="EEE" className="bg-slate-800">Electrical</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-purple-200 mb-2">
                              Year *
                            </label>
                            <select
                              value={formData.year || ""}
                              onChange={(e) => handleInputChange("year", e.target.value)}
                              className={`w-full px-4 py-4 bg-white/5 border-2 rounded-xl text-white focus:outline-none focus:border-purple-400 transition ${
                                errors.year ? "border-red-400" : "border-white/10"
                              }`}
                            >
                              <option value="" className="bg-slate-800">Select Year</option>
                              <option value="1" className="bg-slate-800">1st Year</option>
                              <option value="2" className="bg-slate-800">2nd Year</option>
                              <option value="3" className="bg-slate-800">3rd Year</option>
                              <option value="4" className="bg-slate-800">4th Year</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-purple-200 mb-2">
                              Section
                            </label>
                            <input
                              type="text"
                              value={formData.section || ""}
                              onChange={(e) => handleInputChange("section", e.target.value)}
                              placeholder="A"
                              className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Faculty-specific fields */}
                      {mode === "signup" && selectedRole === "faculty" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-purple-200 mb-2">
                                Employee ID *
                              </label>
                              <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <input
                                  type="text"
                                  value={formData.employeeId || ""}
                                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                                  placeholder="EMP12345"
                                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition ${
                                    errors.employeeId ? "border-red-400" : "border-white/10"
                                  }`}
                                />
                              </div>
                              {errors.employeeId && (
                                <p className="text-red-400 text-xs mt-1">{errors.employeeId}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-purple-200 mb-2">
                                Designation *
                              </label>
                              <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <select
                                  value={formData.designation || ""}
                                  onChange={(e) => handleInputChange("designation", e.target.value)}
                                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white focus:outline-none focus:border-purple-400 transition appearance-none ${
                                    errors.designation ? "border-red-400" : "border-white/10"
                                  }`}
                                >
                                  <option value="" className="bg-slate-800">Select Designation</option>
                                  <option value="Professor" className="bg-slate-800">Professor</option>
                                  <option value="Associate Professor" className="bg-slate-800">Associate Professor</option>
                                  <option value="Assistant Professor" className="bg-slate-800">Assistant Professor</option>
                                  <option value="Coordinator" className="bg-slate-800">Event Coordinator</option>
                                  <option value="Lecturer" className="bg-slate-800">Lecturer</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-purple-200 mb-2">
                              Department *
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                              <select
                                value={formData.facultyDepartment || ""}
                                onChange={(e) => handleInputChange("facultyDepartment", e.target.value)}
                                className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white focus:outline-none focus:border-purple-400 transition appearance-none ${
                                  errors.facultyDepartment ? "border-red-400" : "border-white/10"
                                }`}
                              >
                                <option value="" className="bg-slate-800">Select Department</option>
                                <option value="CSE" className="bg-slate-800">Computer Science & Engineering</option>
                                <option value="ECE" className="bg-slate-800">Electronics & Communication</option>
                                <option value="ME" className="bg-slate-800">Mechanical Engineering</option>
                                <option value="CE" className="bg-slate-800">Civil Engineering</option>
                                <option value="EEE" className="bg-slate-800">Electrical Engineering</option>
                                <option value="Admin" className="bg-slate-800">Administration</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Admin-specific fields */}
                      {mode === "signup" && selectedRole === "admin" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <label className="block text-sm font-semibold text-purple-200 mb-2">
                            Admin Access Code *
                          </label>
                          <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                            <input
                              type="text"
                              value={formData.adminCode || ""}
                              onChange={(e) => handleInputChange("adminCode", e.target.value)}
                              placeholder="Enter admin code"
                              className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition ${
                                errors.adminCode ? "border-red-400" : "border-white/10"
                              }`}
                            />
                          </div>
                          {errors.adminCode && (
                            <p className="text-red-400 text-sm mt-2">{errors.adminCode}</p>
                          )}
                          <p className="text-purple-300/70 text-xs mt-2">
                            Contact system administrator to obtain the admin access code
                          </p>
                        </motion.div>
                      )}

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            placeholder="Enter your password"
                            className={`w-full pl-12 pr-12 py-4 bg-white/5 border-2 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition ${
                              errors.password ? "border-red-400" : "border-white/10"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
                          >
                            {errors.password}
                          </motion.p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className={`w-full relative group ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className={`absolute -inset-1 bg-gradient-to-r ${selectedRoleData?.gradient} rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300`} />
                        <div className={`relative flex items-center justify-center gap-3 bg-gradient-to-r ${selectedRoleData?.gradient} px-8 py-4 rounded-xl font-bold text-white text-lg shadow-2xl`}>
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="w-6 h-6" />
                              </motion.div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <Rocket className="w-6 h-6" />
                              <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
                            </>
                          )}
                        </div>
                      </motion.button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </main>
  );
}
