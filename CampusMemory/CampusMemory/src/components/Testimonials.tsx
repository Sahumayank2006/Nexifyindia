"use client";

import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            💬 Testimonials
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What campus leaders{" "}
            <span className="text-gradient">are saying</span>
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 text-center shadow-sm"
          >
            <Quote className="w-12 h-12 text-saffron/20 mx-auto mb-6" />
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              &ldquo;{testimonials[current].quote}&rdquo;
            </p>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">{testimonials[current].avatar}</span>
              <h4 className="font-heading font-bold text-gray-900">
                {testimonials[current].name}
              </h4>
              <p className="text-sm text-gray-500">
                {testimonials[current].role}
              </p>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-white border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === current
                      ? "bg-primary w-8"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-3 rounded-full bg-white border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
