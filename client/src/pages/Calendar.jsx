import React, { useState, useMemo } from "react";
import { format, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

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
  },
  {
    name: "Danny Bridge",
    city: "Sales Representative",
    avatar: avatarUrl,
    events: [
      {
        id: "job2",
        title: "Product Demo",
        job: "New Client",
        start: new Date(2024, 4, 20, 17, 0),
        end: new Date(2024, 4, 21, 2, 45),
        color: "#f97316",
      },
    ],
  },
  {
    name: "Qin Shi",
    city: "Web Developer",
    avatar: avatarUrl,
    events: [
      {
        id: "job3",
        title: "Code Review",
        job: "Team Meeting",
        start: new Date(2024, 4, 20, 9, 0),
        end: new Date(2024, 4, 20, 11, 0),
        color: "#ec4899",
      },
    ],
  },
  {
    name: "Adam Denisov",
    city: "Web Developer",
    avatar: avatarUrl,
    events: [
      {
        id: "job4",
        title: "Bug Fix",
        job: "Critical Issue",
        start: new Date(2024, 4, 20, 13, 0),
        end: new Date(2024, 4, 20, 18, 30),
        color: "#8b5cf6",
      },
    ],
  },
  {
    name: "Shirline Dungey",
    city: "Web Developer",
    avatar: avatarUrl,
    events: [
      {
        id: "job5",
        title: "Feature Development",
        job: "New Project",
        start: new Date(2024, 4, 20, 20, 0),
        end: new Date(2024, 4, 21, 4, 15),
        color: "#eab308",
      },
    ],
  },
  {
    name: "Lacara Jones",
    city: "Product Designer",
    avatar: avatarUrl,
    events: [
      {
        id: "job6",
        title: "UI Design",
        job: "Mobile App",
        start: new Date(2024, 4, 20, 15, 0),
        end: new Date(2024, 4, 20, 21, 30),
        color: "#06b6d4",
      },
    ],
  },
  {
    name: "Nicolina Lindholm",
    city: "Illustrator",
    avatar: avatarUrl,
    events: [
      {
        id: "job7",
        title: "Asset Creation",
        job: "Marketing Campaign",
        start: new Date(2024, 4, 20, 18, 0),
        end: new Date(2024, 4, 21, 2, 30),
        color: "#6366f1",
      },
    ],
  },
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

  const prevDay = () => setCurrentDate((date) => addDays(date, -1));
  const nextDay = () => setCurrentDate((date) => addDays(date, 1));

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg overflow-auto">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="search..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {filteredEmployees.map((employee) => (
          <div key={employee.name} className="flex items-center p-4 border-b">
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
            <div className="ml-auto text-sm text-gray-500">
              {employee.events
                .reduce(
                  (total, event) =>
                    total +
                    (event.end.getTime() - event.start.getTime()) / 3600000,
                  0
                )
                .toFixed(2)}{" "}
              Hrs
            </div>
          </div>
        ))}
        <div className="p-4">
          <button className="w-full py-2 bg-green-500 text-white rounded-lg">
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
                onClick={prevDay}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="font-medium">
                {format(currentDate, "EEE, d MMM")}
              </span>
              <button
                onClick={nextDay}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <select className="border rounded-md px-2 py-1">
              <option>View: Area | Day</option>
            </select>
            <button className="px-4 py-1 bg-gray-200 rounded-md">
              Actions
            </button>
            <button className="px-4 py-1 bg-green-500 text-white rounded-md">
              Publish 2 Shifts
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {hours.map((hour) => (
                  <th
                    key={hour}
                    className="p-2 border-r border-b text-sm font-normal text-gray-500"
                  >
                    {format(new Date().setHours(hour), "h a")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.name} className="border-b">
                  {hours.map((hour) => (
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
                        .map((event, eventIdx) => {
                          const startHour = event.start.getHours();
                          const endHour = event.end.getHours();
                          const duration =
                            endHour -
                            startHour +
                            (endHour <= startHour ? 24 : 0);
                          return (
                            <div
                              key={eventIdx}
                              className="absolute top-0 left-0 right-0 text-white text-xs p-1 overflow-hidden"
                              style={{
                                backgroundColor: event.color,
                                height: "100%",
                                zIndex: 10,
                                left: hour === startHour ? "0%" : "-100%",
                                width: `${duration * 100}%`,
                              }}
                            >
                              <div className="font-bold">{event.title}</div>
                              <div>{event.job}</div>
                            </div>
                          );
                        })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>
    </div>
  );
};

export default EmployeeScheduleCalendar;
