'use client';

import React, { useState, useEffect } from 'react';
import AttendanceManagement from '@/components/AttendanceManagement';
import { Calendar, MapPin, Users } from 'lucide-react';

interface Event {
  eventId: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  school: string;
}

const API_BASE_URL = 'http://localhost:8001';

export default function AttendancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      const data = await response.json();
      setEvents(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading events...</div>
      </div>
    );
  }

  if (selectedEventId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setSelectedEventId(null)}
            className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            ← Back to Events
          </button>
          <AttendanceManagement eventId={selectedEventId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Select an event to manage attendance</p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h3>
            <p className="text-gray-500">Create an event first to manage attendance</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.eventId}
                onClick={() => setSelectedEventId(event.eventId)}
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-indigo-400"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">{event.title}</h3>
                  <span className="text-xs font-semibold text-white bg-indigo-600 px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-600" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-600" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-indigo-600" />
                    <span className="truncate">{event.organizer}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase">{event.school}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
