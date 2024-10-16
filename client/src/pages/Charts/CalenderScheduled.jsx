import React, { useState } from 'react';
import { X } from 'lucide-react';

const ScheduleModal = ({ isOpen, onClose, date, employees, onSchedule }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  if (!isOpen) return null;

  const handleSchedule = () => {
    onSchedule({
      employeeName: selectedEmployee,
      date,
      startTime,
      endTime
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Schedule Shift</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Employee</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Select an employee</option>
            {employees.map((emp) => (
              <option key={emp.name} value={emp.name}>{emp.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Start Time</label>
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">End Time</label>
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <button
          className="w-full py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSchedule}
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;