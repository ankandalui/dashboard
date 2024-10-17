import React, { useState, useMemo } from "react";
import ScheduleModal from "./Charts/CalenderScheduled";
import AddEmployeeModal from "./AddEmployeeModal";
import ActionsMenu from "./ActionMenu";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";

const avatarUrl =
  "https://res.cloudinary.com/demo/image/upload/w_0.5,ar_1,c_thumb,g_faces,z_0.7/r_max/docs/young-couple.jpg";

const dummyData = [
  { name: "Open Shifts", city: "", avatar: "", events: [], color: "#34d399" },
  {
    name: "Kate Gallon",
    city: "Sales Representative",
    avatar: avatarUrl,
    events: [
      {
        id: "job1",
        title: "Sales Call",
        job: "Client Meeting",
        start: new Date(2024, 4, 20, 14, 0),
        end: new Date(2024, 4, 20, 20, 30),
        color: "#60a5fa",
      },
    ],
    shiftTotal: "6.5 Hrs",
    basePay: "₹150/hr",
    stress: "Low",
    training: "Sales Fundamentals",
  },
  // ... (other employee data)
];

const unscheduledAppointments = [
  {
    id: "u1",
    title: "Steve Works",
    job: "CEO Meeting",
    color: "#10b981",
    start: new Date(2024, 4, 20, 8, 0),
    end: new Date(2024, 4, 20, 9, 30),
    unscheduled: true,
  },
  {
    id: "u2",
    title: "Mary Johnson",
    job: "Interview",
    color: "#f59e0b",
    start: new Date(2024, 4, 20, 10, 0),
    end: new Date(2024, 4, 20, 11, 0),
    unscheduled: true,
  },
];

const EmployeeScheduleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 20)); // May 20, 2024
  const [employees, setEmployees] = useState(dummyData);
  const [unscheduled, setUnscheduled] = useState(unscheduledAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("day");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showTimesheetOptions, setShowTimesheetOptions] = useState(false);
  const [showCellOptions, setShowCellOptions] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  const handleCellClick = (date, hour, employeeIndex) => {
    setSelectedDate(new Date(date.setHours(hour)));
    setSelectedCell({ date, hour, employeeIndex });
    setShowCellOptions(true);
  };
  const handleAddEmployee = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };
  // const handleCellClick = (date, hour) => {
  //   setSelectedDate(new Date(date.setHours(hour)));
  //   setShowScheduleModal(true);
  // };
  const handleTimesheet = (timesheetData) => {
    // Implement the logic to add or update timesheet entry
    console.log("Timesheet data:", timesheetData);
    // You would typically update the employee's timesheet here
    setShowCellOptions(false);
  };

  const handleTimesheetClick = () => {
    setShowTimesheetModal(true);
  };

  const exportTimesheet = (format) => {
    // Implement the logic to export timesheet
    console.log(`Exporting timesheet as ${format}`);
    // You would typically generate and download the timesheet file here
    setShowTimesheetOptions(false);
  };

  const CellOptionsModal = ({ isOpen, onClose, date, hour, employeeIndex }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Options</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <button
            className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => {
              setShowScheduleModal(true);
              onClose();
            }}
          >
            Schedule
          </button>
          <button
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={() => handleTimesheet({ date, hour, employeeIndex })}
          >
            Timesheet
          </button>
        </div>
      </div>
    );
  };

  const TimesheetOptionsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Timesheet Options</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <button
            className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => exportTimesheet("PDF")}
          >
            Export as PDF
          </button>
          <button
            className="w-full mb-2 px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={() => exportTimesheet("CSV")}
          >
            Export as CSV
          </button>
          <button
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md"
            onClick={() => exportTimesheet("Excel")}
          >
            Export as Excel
          </button>
        </div>
      </div>
    );
  };

  const handleSchedule = (scheduleData) => {
    // Implement the logic to add the new schedule to the appropriate employee
    setEmployees((prevEmployees) => {
      const newEmployees = [...prevEmployees];
      const employeeIndex = newEmployees.findIndex(
        (emp) => emp.name === scheduleData.employeeName
      );
      if (employeeIndex !== -1) {
        newEmployees[employeeIndex].events.push({
          id: `event-${Date.now()}`,
          title: scheduleData.employeeName,
          job: "Scheduled Shift",
          start: new Date(
            `${scheduleData.date.toDateString()} ${scheduleData.startTime}`
          ),
          end: new Date(
            `${scheduleData.date.toDateString()} ${scheduleData.endTime}`
          ),
          color: "#60a5fa",
        });
      }
      return newEmployees;
    });
  };
  const handleEventClick = (event) => {
    if (event) {
      // Add this check
      setSelectedEvent(event);
      setShowEventModal(true);
    }
  };

  const EventModal = ({ event, onClose }) => {
    if (!event) {
      return null; // Or you could render a message like "No event selected"
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{event.title}</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <p>
            <strong>Job:</strong> {event.job}
          </p>
          <p>
            <strong>Start:</strong> {format(event.start, "PPpp")}
          </p>
          <p>
            <strong>End:</strong> {format(event.end, "PPpp")}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  const TimesheetModal = ({ onClose }) => {
    if (!showTimesheetModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Timesheet</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-4">
            <h3 className="font-bold mb-2">This Week's Hours</h3>
            <p>Monday: 8 hours</p>
            <p>Tuesday: 7.5 hours</p>
            <p>Wednesday: 8 hours</p>
            <p>Thursday: 8 hours</p>
            <p>Friday: 6 hours</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Total Hours: 37.5</h3>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  const toggleEmployeeExpansion = (employeeName) => {
    setExpandedEmployee(
      expandedEmployee === employeeName ? null : employeeName
    );
  };

  const changeViewMode = (mode) => {
    setViewMode(mode);
    switch (mode) {
      case "day":
        // Current implementation is already day view
        break;
      case "week":
        setCurrentDate(startOfWeek(currentDate));
        break;
      case "month":
        setCurrentDate(startOfMonth(currentDate));
        break;
      case "year":
        setCurrentDate(startOfYear(currentDate));
        break;
    }
  };

  const getDateRange = () => {
    switch (viewMode) {
      case "day":
        return [currentDate];
      case "week":
        return eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate),
        });
      case "month":
        return eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
        });
      case "year":
        return eachDayOfInterval({
          start: startOfYear(currentDate),
          end: endOfYear(currentDate),
        });
    }
  };

  const dateRange = useMemo(getDateRange, [currentDate, viewMode]);

  const prevPeriod = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, -1));
        break;
      case "week":
        setCurrentDate(addDays(currentDate, -7));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, -1));
        break;
      case "year":
        setCurrentDate(addMonths(currentDate, -12));
        break;
    }
  };

  const nextPeriod = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addDays(currentDate, 7));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "year":
        setCurrentDate(addMonths(currentDate, 12));
        break;
    }
  };

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []); // 0-23 hours

  const handleDragStart = (e, appointment) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(appointment));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, employeeIndex, hour) => {
    e.preventDefault();
    const appointmentData = JSON.parse(e.dataTransfer.getData("text"));

    const newEvent = {
      ...appointmentData,
      start: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hour
      ),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hour + 1
      ),
      unscheduled: false,
    };

    setEmployees((prevEmployees) => {
      const newEmployees = [...prevEmployees];
      newEmployees[employeeIndex].events.push(newEvent);
      return newEmployees;
    });

    setUnscheduled((prevUnscheduled) =>
      prevUnscheduled.filter((app) => app.id !== appointmentData.id)
    );
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Calendar = ({ date, onChange }) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const prevMonth = () => onChange(addMonths(date, -1));
    const nextMonth = () => onChange(addMonths(date, 1));

    return (
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth}>
            <ChevronLeft />
          </button>
          <h2 className="text-lg font-semibold">{format(date, "MMMM yyyy")}</h2>
          <button onClick={nextMonth}>
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
          {monthDays.map((day) => (
            <button
              key={day.toString()}
              onClick={() => onChange(day)}
              className={`p-2 text-center rounded-full ${
                isSameMonth(day, date)
                  ? isSameDay(day, currentDate)
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                  : "text-gray-400"
              }`}
            >
              {format(day, "d")}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg overflow-auto">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {filteredEmployees.map((employee) => (
          <div key={employee.name}>
            <div
              className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => toggleEmployeeExpansion(employee.name)}
            >
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full mr-3 bg-green-500 flex items-center justify-center text-white font-bold">
                  {employee.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-medium">{employee.name}</div>
                <div className="text-sm text-gray-500">{employee.city}</div>
              </div>
              <div className="ml-auto">
                {expandedEmployee === employee.name ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>
            </div>
            {expandedEmployee === employee.name && (
              <div className="bg-gray-50 p-4 border-b">
                <p>Shift Total: {employee.shiftTotal}</p>
                <p>Base Pay: {employee.basePay}</p>
                <p>Stress: {employee.stress}</p>
                <p>Training: {employee.training}</p>
              </div>
            )}
          </div>
        ))}
        <div className="p-4">
          <button
            className="w-full py-2 bg-green-500 text-white rounded-lg"
            onClick={() => setShowAddEmployeeModal(true)}
          >
            Add new employee
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-purple-700">Schedule</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPeriod}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="font-medium">
                {format(currentDate, "MMMM d, yyyy")}
              </span>
              <button
                onClick={nextPeriod}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <CalendarIcon className="w-6 h-6" />
            </button>
            <select
              className="border rounded-md px-2 py-1"
              value={viewMode}
              onChange={(e) => changeViewMode(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
            {/* <button className="px-4 py-1 bg-gray-200 rounded-md">
              Actions
            </button> */}
            <ActionsMenu />
            <button className="px-4 py-1 bg-green-500 text-white rounded-md">
              Publish 2 Shifts
            </button>
          </div>
          <button
            onClick={handleTimesheetClick}
            className="px-4 py-1 bg-blue-500 text-white rounded-md ml-2"
          >
            View Timesheet
          </button>
        </div>
        <div className="flex-1 flex">
          {/* Calendar Grid */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {viewMode === "day" &&
                    hours.map((hour) => (
                      <th
                        key={hour}
                        className="p-2 border-r border-b text-sm font-normal text-gray-500"
                      >
                        {format(new Date().setHours(hour), "h a")}
                      </th>
                    ))}
                  {(viewMode === "week" ||
                    viewMode === "month" ||
                    viewMode === "year") &&
                    dateRange.map((date) => (
                      <th
                        key={date.toString()}
                        className="p-2 border-r border-b text-sm font-normal text-gray-500"
                      >
                        {format(date, "MMM d")}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {/* {filteredEmployees.map((employee, index) => (
                  <tr key={employee.name} className="border-b">
                    {viewMode === "day" &&
                      hours.map((hour) => (
                        <td
                          key={`${employee.name}-${hour}`}
                          className="border-r p-1 relative h-16"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index, hour)}
                        >
                          {employee.events
                            .filter(
                              (event) =>
                                event.start.getHours() <= hour &&
                                event.end.getHours() > hour
                            )
                            .map((event, eventIdx) => (
                              <div
                                key={eventIdx}
                                className="absolute top-0 left-0 right-0 text-white text-xs p-1 overflow-hidden"
                                style={{
                                  backgroundColor: event.color,
                                  height: "100%",
                                  zIndex: 10,
                                }}
                              >
                                <div className="font-bold">{event.title}</div>
                                <div>{event.job}</div>
                              </div>
                            ))} */}
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee.name} className="border-b">
                    {viewMode === "day" &&
                      hours.map((hour) => (
                        <td
                          key={`${employee.name}-${hour}`}
                          className="border-r p-1 relative h-16"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index, hour)}
                          onClick={() =>
                            handleCellClick(currentDate, hour, index)
                          }
                        >
                          {employee.events
                            .filter(
                              (event) =>
                                event.start.getHours() <= hour &&
                                event.end.getHours() > hour
                            )
                            .map((event, eventIdx) => (
                              <button
                                key={eventIdx}
                                className="absolute top-0 left-0 right-0 text-white text-xs p-1 overflow-hidden"
                                style={{
                                  backgroundColor: event.color,
                                  height: "100%",
                                  zIndex: 10,
                                }}
                                onClick={() => handleEventClick(event)}
                              >
                                <div className="font-bold">{event.title}</div>
                                <div>{event.job}</div>
                              </button>
                            ))}
                        </td>
                      ))}
                    {(viewMode === "week" ||
                      viewMode === "month" ||
                      viewMode === "year") &&
                      dateRange.map((date) => (
                        <td
                          key={`${employee.name}-${date.toString()}`}
                          className="border-r p-1 relative h-16"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index, date.getHours())}
                        >
                          {employee.events
                            .filter(
                              (event) =>
                                event.start.getDate() === date.getDate() &&
                                event.start.getMonth() === date.getMonth() &&
                                event.start.getFullYear() === date.getFullYear()
                            )
                            .map((event, eventIdx) => (
                              <div
                                key={eventIdx}
                                className="bg-blue-500 text-white text-xs p-1 mb-1 rounded"
                                style={{ backgroundColor: event.color }}
                              >
                                <div className="font-bold">{event.title}</div>
                                <div>{format(event.start, "h:mm a")}</div>
                              </div>
                            ))}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calendar Popup */}
          {showCalendar && (
            <div className="w-64 ml-4">
              <Calendar date={currentDate} onChange={setCurrentDate} />
            </div>
          )}
        </div>

        {/* Unscheduled Appointments */}
        <div className="bg-white p-4 border-t">
          <h3 className="font-bold mb-2">Unscheduled Appointments</h3>
          <div className="flex space-x-2">
            {unscheduled.map((app) => (
              <div
                key={app.id}
                className="p-2 rounded text-white text-sm cursor-move"
                style={{ backgroundColor: app.color }}
                draggable
                onDragStart={(e) => handleDragStart(e, app)}
              >
                <div className="font-bold">{app.title}</div>
                <div>{app.job}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Schedule Modal */}
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          date={selectedDate}
          employees={employees}
          onSchedule={handleSchedule}
        />
        {showEventModal && (
          <EventModal
            event={selectedEvent}
            onClose={() => setShowEventModal(false)}
          />
        )}

        {/* Timesheet Modal */}
        {showTimesheetModal && (
          <TimesheetModal onClose={() => setShowTimesheetModal(false)} />
        )}
        <AddEmployeeModal
          isOpen={showAddEmployeeModal}
          onClose={() => setShowAddEmployeeModal(false)}
          onAddEmployee={handleAddEmployee}
        />
        <CellOptionsModal
          isOpen={showCellOptions}
          onClose={() => setShowCellOptions(false)}
          {...selectedCell}
        />
        <TimesheetOptionsModal
          isOpen={showTimesheetOptions}
          onClose={() => setShowTimesheetOptions(false)}
        />
        <EventModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
        />
        <TimesheetModal onClose={() => setShowTimesheetModal(false)} />
      </div>
    </div>
  );
};

export default EmployeeScheduleCalendar;
