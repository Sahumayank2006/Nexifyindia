"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, GraduationCap } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    role: "student"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      const users = JSON.parse(localStorage.getItem("campusMemoryUsers") || "[]");
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        localStorage.setItem("campusMemoryCurrentUser", JSON.stringify(user));
        onLogin(user);
        onClose();
      } else {
        alert("Invalid credentials! Please sign up first.");
      }
    } else {
      // Signup logic
      const users = JSON.parse(localStorage.getItem("campusMemoryUsers") || "[]");
      const existingUser = users.find((u: any) => u.email === formData.email);
      
      if (existingUser) {
        alert("User already exists! Please login.");
      } else {
        const newUser = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem("campusMemoryUsers", JSON.stringify(users));
        localStorage.setItem("campusMemoryCurrentUser", JSON.stringify(newUser));
        onLogin(newUser);
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Join Campus Memory"}</h3>
              <p className="text-white/80 text-sm mt-1">
                {isLogin ? "Login to access your dashboard" : "Create your account to get started"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:outline-none transition-colors"
                    placeholder="your.email@college.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:outline-none transition-colors"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">College</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:outline-none transition-colors"
                        placeholder="Your college name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1E3A8A] focus:outline-none transition-colors"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-[#1E3A8A] hover:underline font-semibold"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
