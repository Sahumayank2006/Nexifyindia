/**
 * Attendance Management Component
 * For coordinators and sub-users to mark and manage attendance
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Download, QrCode, UserCheck, FileSpreadsheet } from 'lucide-react';

interface AttendanceRecord {
  attendanceId: string;
  studentId: string;
  studentName: string;
  status: string;
  timestamp: string;
  odGranted: boolean;
  odGrantedBy?: string;
}

const API_BASE_URL = 'http://localhost:8001';

export default function AttendanceManagement({ eventId }: { eventId: string }) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<string>('');

  useEffect(() => {
    fetchAttendance();
  }, [eventId]);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendance`);
      const data = await response.json();
      setAttendanceRecords(data.records || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const generateQRCode = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/qr`, {
        method: 'POST'
      });
      const data = await response.json();
      setQRCodeData(data.qrCodeBase64);
      setShowQRCode(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const exportCSV = () => {
    const csv = [
      ['Student ID', 'Student Name', 'Status', 'Timestamp', 'OD Granted'],
      ...attendanceRecords.map(record => [
        record.studentId,
        record.studentName,
        record.status,
        record.timestamp,
        record.odGranted ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${eventId}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>
          <p className="text-gray-600">Track and manage event attendance</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowMarkAttendance(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <UserCheck size={18} />
            Mark Attendance
          </button>
          <button
            onClick={generateQRCode}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <QrCode size={18} />
            Generate QR
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{attendanceRecords.length}</div>
          <div className="text-sm text-gray-600">Total Present</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {attendanceRecords.filter(r => r.odGranted).length}
          </div>
          <div className="text-sm text-gray-600">OD Granted</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {attendanceRecords.filter(r => r.status === 'present' && !r.odGranted).length}
          </div>
          <div className="text-sm text-gray-600">Regular Present</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {((attendanceRecords.length / 500) * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">Attendance Rate</div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Timestamp</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">OD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendanceRecords.map((record) => (
              <tr key={record.attendanceId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{record.studentId}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{record.studentName}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    record.status === 'present' ? 'bg-green-100 text-green-800' :
                    record.status === 'od_granted' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(record.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {record.odGranted ? (
                    <span className="text-green-600 font-semibold">✓</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {attendanceRecords.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No attendance records yet. Start marking attendance!
          </div>
        )}
      </div>

      {/* Mark Attendance Modal */}
      {showMarkAttendance && (
        <MarkAttendanceModal
          eventId={eventId}
          onClose={() => setShowMarkAttendance(false)}
          onSuccess={() => {
            fetchAttendance();
            setShowMarkAttendance(false);
          }}
        />
      )}

      {/* QR Code Modal */}
      {showQRCode && qrCodeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Event Check-in QR Code</h3>
            <div className="flex justify-center mb-4">
              <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Students can scan this QR code to check-in
            </p>
            <button
              onClick={() => setShowQRCode(false)}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Mark Attendance Modal
function MarkAttendanceModal({
  eventId,
  onClose,
  onSuccess
}: {
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [method, setMethod] = useState<'manual' | 'csv'>('manual');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: [{
            studentId,
            studentName,
            status: 'present'
          }],
          markedBy: 'COORD001'
        })
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('marked_by', 'COORD001');

    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendance/bulk-csv`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Mark Attendance</h3>

        {/* Method Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMethod('manual')}
            className={`flex-1 p-3 rounded-lg border-2 ${
              method === 'manual' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setMethod('csv')}
            className={`flex-1 p-3 rounded-lg border-2 ${
              method === 'csv' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
            }`}
          >
            <FileSpreadsheet className="inline mr-2" size={16} />
            Bulk CSV
          </button>
        </div>

        {/* Manual Entry */}
        {method === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                placeholder="e.g., A123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                placeholder="Full Name"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Mark Present
              </button>
            </div>
          </form>
        )}

        {/* CSV Upload */}
        {method === 'csv' && (
          <div>
            <div className="mb-4">
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-600">
                <Upload className="mx-auto mb-2" size={24} />
                <span className="text-sm text-gray-600">
                  Upload CSV file (studentId, studentName)
                </span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
              </label>
              {csvFile && (
                <p className="mt-2 text-sm text-gray-600">Selected: {csvFile.name}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCSVUpload}
                disabled={!csvFile}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Upload & Mark
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
