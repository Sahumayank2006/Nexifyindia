/**
 * Event Management Dashboard Component
 * Coordinator interface for creating and managing events
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Calendar, Users, QrCode, Download, Plus } from 'lucide-react';

interface Event {
  eventId: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  school: string;
  posterUrl?: string;
}

const API_BASE_URL = 'http://localhost:8001';

export default function EventManagementDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploadPoster, setUploadPoster] = useState(false);

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Expected array but got:', typeof data);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]); // Ensure events is always an array
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
              <p className="text-gray-600 mt-2">Create and manage campus events</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
              Create Event
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => new Date(e.date) >= new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>

        {/* Create Event Modal */}
        {showCreateModal && (
          <CreateEventModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              fetchEvents();
              setShowCreateModal(false);
            }}
            uploadPoster={uploadPoster}
            setUploadPoster={setUploadPoster}
          />
        )}

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.eventId}
                event={event}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {event.posterUrl && (
        <img
          src={event.posterUrl}
          alt={event.title}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
      )}
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          {event.category}
        </span>
        <span className="text-xs text-gray-500">{event.date}</span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
      
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} />
          <span className="truncate">{event.school}</span>
        </div>
      </div>
    </div>
  );
}

// Create Event Modal
function CreateEventModal({
  onClose,
  onSuccess,
  uploadPoster,
  setUploadPoster
}: {
  onClose: () => void;
  onSuccess: () => void;
  uploadPoster: boolean;
  setUploadPoster: (value: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    date: '',
    time: '',
    location: '',
    organizer: '',
    registrationDeadline: '',
    school: '',
    description: '',
    maxTeamSize: 5,
    minTeamSize: 1
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [confidence, setConfidence] = useState<any>(null);

  const schools = [
    "Amity School of Engineering & Technology",
    "Amity School of Business",
    "Amity School of Communication",
    "Amity School of Computer Science",
    "Amity School of Architecture & Planning",
    "Amity School of Fine Arts",
    "Amity School of Law",
    "Amity School of Applied Sciences",
    "Amity School of Biotechnology",
    "Amity School of Hospitality",
    "Amity School of Liberal Arts",
    "Amity School of Design"
  ];

  const categories = ["Technical", "Workshop", "Cultural", "Sports", "Career", "Awareness", "Webinar"];

  const handlePosterUpload = async (file: File) => {
    setPosterFile(file);
    setAnalyzing(true);
    setAnalysisProgress('Uploading poster...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setAnalysisProgress('🔍 Extracting text from poster...');
      
      const response = await fetch(`${API_BASE_URL}/analyze/poster`, {
        method: 'POST',
        body: formData
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        
        if (response.status === 503) {
          setAnalysisProgress('❌ AI service not available. Install dependencies: pip install paddleocr transformers spacy');
        } else if (response.status === 404) {
          setAnalysisProgress('❌ API endpoint not found. Is the backend server running on port 8001?');
        } else {
          setAnalysisProgress(`❌ Server error (${response.status}). Please fill manually.`);
        }
        return;
      }

      const result = await response.json();
      
      if (result.success && result.extractedData) {
        setAnalysisProgress('✅ Analysis complete!');
        setExtractedData(result.extractedData);
        setConfidence(result.confidence);
        
        // Auto-fill form with extracted data
        setFormData(prev => ({
          ...prev,
          title: result.extractedData.title || prev.title,
          category: result.extractedData.category || prev.category,
          date: result.extractedData.date || prev.date,
          time: result.extractedData.time || prev.time,
          location: result.extractedData.location || prev.location,
          organizer: result.extractedData.organizer || prev.organizer,
          registrationDeadline: result.extractedData.registrationDeadline || prev.registrationDeadline,
          school: result.extractedData.school || prev.school,
          description: result.extractedData.description || prev.description
        }));

        // Show success message with confidence
        if (result.needsReview) {
          setAnalysisProgress(`⚠️ Extracted with ${Math.round(result.confidence.overall * 100)}% confidence. Please review.`);
        } else {
          setAnalysisProgress(`✅ Extracted with ${Math.round(result.confidence.overall * 100)}% confidence!`);
        }
      } else {
        setAnalysisProgress('❌ Failed to analyze poster. ' + (result.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error analyzing poster:', error);
      
      // Better error messages
      if (error.message?.includes('Failed to fetch')) {
        setAnalysisProgress('❌ Cannot connect to server. Please start backend: python event_api_server.py');
      } else if (error.message?.includes('NetworkError')) {
        setAnalysisProgress('❌ Network error. Check if backend is running on port 8001.');
      } else {
        setAnalysisProgress('❌ Error analyzing poster. Please fill manually. See console for details.');
      }
    } finally {
      setTimeout(() => setAnalyzing(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/events?coordinator_id=COORD001`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Event</h2>

          {/* Upload Method Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setUploadPoster(false)}
              className={`flex-1 p-3 rounded-lg border-2 ${
                !uploadPoster ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setUploadPoster(true)}
              className={`flex-1 p-3 rounded-lg border-2 ${
                uploadPoster ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <Upload className="inline mr-2" size={16} />
              Upload Poster
            </button>
          </div>

          {/* Poster Upload */}
          {uploadPoster && (
            <div className="mb-6">
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-600 transition-colors">
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <span className="text-sm text-gray-600">
                  {posterFile ? posterFile.name : 'Drop poster image or click to upload (JPG, PNG)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePosterUpload(e.target.files[0])}
                />
              </label>
              
              {/* Analysis Progress */}
              {(analyzing || analysisProgress) && (
                <div className="mt-4">
                  <div className={`p-4 rounded-lg ${
                    analysisProgress.includes('✅') ? 'bg-green-50 text-green-700' :
                    analysisProgress.includes('⚠️') ? 'bg-yellow-50 text-yellow-700' :
                    analysisProgress.includes('❌') ? 'bg-red-50 text-red-700' :
                    'bg-indigo-50 text-indigo-700'
                  }`}>
                    {analyzing && (
                      <div className="flex items-center justify-center mb-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                      </div>
                    )}
                    <div className="text-center font-medium">{analysisProgress}</div>
                  </div>
                  
                  {/* Confidence Display */}
                  {confidence && !analyzing && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs font-semibold text-gray-600 mb-2">Extraction Confidence:</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium">Category</div>
                          <div className={`${confidence.category > 0.7 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {Math.round(confidence.category * 100)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">School</div>
                          <div className={`${confidence.school > 0.7 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {Math.round(confidence.school * 100)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Overall</div>
                          <div className={`font-bold ${confidence.overall > 0.7 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {Math.round(confidence.overall * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <select
                  required
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select School</option>
                  {schools.map(school => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
              <input
                type="text"
                required
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
              <input
                type="date"
                required
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Team Size</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.minTeamSize}
                  onChange={(e) => setFormData({ ...formData, minTeamSize: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Team Size</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxTeamSize}
                  onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) || 5 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Event Details Modal (simplified)
function EventDetailsModal({ event, onClose }: { event: Event; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{event.title}</h2>
        <div className="space-y-2 text-gray-600">
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>School:</strong> {event.school}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
