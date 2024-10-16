import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Download, Mail, Printer, Settings, Users } from 'lucide-react';

const ActionsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleAction = (action) => {
    console.log(`Performing action: ${action}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center"
      >
        Actions
        <MoreVertical className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => handleAction('export')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              <Download className="mr-3 h-5 w-5 text-gray-400" /> Export Schedule
            </button>
            <button
              onClick={() => handleAction('email')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              <Mail className="mr-3 h-5 w-5 text-gray-400" /> Email Schedule
            </button>
            <button
              onClick={() => handleAction('print')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              <Printer className="mr-3 h-5 w-5 text-gray-400" /> Print Schedule
            </button>
            <button
              onClick={() => handleAction('settings')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-400" /> Schedule Settings
            </button>
            <button
              onClick={() => handleAction('manage-employees')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              role="menuitem"
            >
              <Users className="mr-3 h-5 w-5 text-gray-400" /> Manage Employees
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;