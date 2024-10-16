import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [avatar, setAvatar] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEmployee({ name, city, avatar, events: [] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Employee</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Avatar URL</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;