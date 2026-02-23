/**
 * Teacher Dashboard Component
 * For teachers to view events and grant OD (Official Duty)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Award, Calendar, Users, TrendingUp } from 'lucide-react';

interface Event {
  eventId: string;
  title: string;
  category: string;
  date: string;
  school: string;
}

interface AttendanceRecord {
  attendanceId: string;
  studentId: string;
  studentName: string;
  status: string;
  odGranted: boolean;
}

const API_BASE_URL = 'http://localhost:8001';

export default function TeacherDashboard({ teacherId = 'TEACHER001' }: { teacherId?: string }) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [teacherId]);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventAttendance(selectedEvent);
    }
  }, [selectedEvent]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all events instead of teacher-specific endpoint
      const eventsResponse = await fetch(`${API_BASE_URL}/events`);
      const eventsData = await eventsResponse.json();
      setEvents(eventsData || []);
      
      // Set mock dashboard data
      setDashboardData({
        school: 'Your School',
        totalEvents: eventsData?.length || 0,
        totalAttendance: 0,
        odGrantedCount: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchEventAttendance = async (eventId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendance`);
      const data = await response.json();
      setAttendanceRecords(data.records || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const grantOD = async (attendanceId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${attendanceId}/od`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId: teacherId,
          reason: 'Event participation'
        })
      });

      if (response.ok) {
        // Refresh attendance data
        if (selectedEvent) {
          fetchEventAttendance(selectedEvent);
        }
      }
    } catch (error) {
      console.error('Error granting OD:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-2">
            {dashboardData?.school || 'Loading...'}
          </p>

          {/* Quick Stats */}
          {dashboardData && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-600" size={24} />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{dashboardData.totalEvents}</div>
                    <div className="text-sm text-gray-600">Total Events</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="text-green-600" size={24} />
                  <div>
                    <div className="text-2xl font-bold text-green-600">{dashboardData.totalAttendance}</div>
                    <div className="text-sm text-gray-600">Total Attendance</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="text-purple-600" size={24} />
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{dashboardData.odGrantedCount}</div>
                    <div className="text-sm text-gray-600">OD Granted</div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-orange-600" size={24} />
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {dashboardData.totalAttendance > 0 
                        ? ((dashboardData.odGrantedCount / dashboardData.totalAttendance) * 100).toFixed(0)
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-600">OD Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Events List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">School Events</h2>
            
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.eventId}
                  onClick={() => setSelectedEvent(event.eventId)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedEvent === event.eventId
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {event.category}
                    </span>
                  </div>
                </div>
              ))}

              {events.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No events found
                </div>
              )}
            </div>
          </div>

          {/* OD Management */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Grant Official Duty (OD)</h2>

            {selectedEvent ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Select students to grant OD for event participation
                </p>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {attendanceRecords.map((record) => (
                    <div
                      key={record.attendanceId}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-800">{record.studentName}</div>
                        <div className="text-sm text-gray-600">{record.studentId}</div>
                      </div>

                      {record.odGranted ? (
                        <span className="text-green-600 font-semibold flex items-center gap-2">
                          <Award size={16} />
                          OD Granted
                        </span>
                      ) : (
                        <button
                          onClick={() => grantOD(record.attendanceId)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Grant OD
                        </button>
                      )}
                    </div>
                  ))}

                  {attendanceRecords.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No attendance records for this event
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Select an event to manage OD
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
