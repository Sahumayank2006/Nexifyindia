"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Users,
  Brain,
  Calendar,
  ChevronDown,
  X,
  Star,
} from "lucide-react";
import { colleges, type College } from "@/lib/data";

interface CollegeSelectorProps {
  onSelect: (college: College) => void;
  selected: College | null;
}

export default function CollegeSelector({
  onSelect,
  selected,
}: CollegeSelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredColleges = colleges.filter((college) => {
    const matchesSearch =
      college.name.toLowerCase().includes(search.toLowerCase()) ||
      college.shortName.toLowerCase().includes(search.toLowerCase()) ||
      college.city.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      filterType === "all" || college.type === filterType;
    return matchesSearch && matchesType;
  });

  const types = ["all", "IIT", "NIT", "Central", "State", "Private"];

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative group px-8 py-4 bg-gradient-to-r from-primary to-university-blue text-white rounded-2xl font-heading font-semibold text-lg shadow-lg glow-pulse"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center gap-3">
          {selected ? (
            <>
              <Star className="w-5 h-5 text-saffron" fill="currentColor" />
              {selected.shortName}
              <ChevronDown className="w-4 h-4" />
            </>
          ) : (
            <>
              🎓 Select Your College
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-university-blue p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-2xl font-bold">
                    🏛️ College Gateway
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search 500+ Indian colleges..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-saffron"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        filterType === type
                          ? "bg-saffron text-primary-dark"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {type === "all" ? "All" : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* College List */}
              <div className="overflow-y-auto max-h-[50vh] p-4 space-y-3">
                {filteredColleges.map((college, index) => (
                  <motion.button
                    key={college.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onSelect(college);
                      setIsOpen(false);
                      router.push(`/colleges/${college.id}`);
                    }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                      selected?.id === college.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-100 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: college.color }}
                          />
                          <h3 className="font-heading font-semibold text-gray-900">
                            {college.shortName}
                          </h3>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            {college.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {college.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {college.city}, {college.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Est. {college.established}
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Brain className="w-4 h-4 text-saffron" />
                          <span className="font-bold text-primary">
                            {college.memoryIndex}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Users className="w-3 h-3" />
                          {college.activeUsers.toLocaleString()} active
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
