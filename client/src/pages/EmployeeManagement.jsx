import React, { useState, useEffect } from "react";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch employees data from your API or local storage
    // For now, we'll use mock data
    const mockEmployees = [
      {
        id: 1,
        name: "Soumadip santra",
        photo: "64 x 64",
        department: "Web Development",
        gender: "Male",
        mobile: "8965321459",
        email: "souma@mail.com",
        dob: "05-02-2004",
        joinedOn: "05-07-2024",
        address: "G.T. Road (278/6/4)",
        city: "Kolkata",
        state: "WB",
        country: "India",
        appliedOn: "20-12-23",
      },
      // Add more mock employees here if needed
    ];
    setEmployees(mockEmployees);
    console.log("Employees data set:", mockEmployees);
  }, []);

  const indexOfLastEmployee = currentPage * entriesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - entriesPerPage;
  const currentEmployees = employees
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstEmployee, indexOfLastEmployee);

  console.log("Current employees:", currentEmployees);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">View Staff</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="entries" className="mr-2">
            Show
          </label>
          <select
            id="entries"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          <span className="ml-2">entries</span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button className="ml-2 bg-red-500 text-white px-4 py-1 rounded">
            Search
          </button>
        </div>
      </div>
      {employees.length === 0 ? (
        <p>No employees found. Please add some employees.</p>
      ) : currentEmployees.length === 0 ? (
        <p>No employees match your search criteria.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Photo</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">DOB</th>
              <th className="border p-2">Joined On</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">City</th>
              <th className="border p-2">State</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Applied On</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee, index) => (
              <tr key={employee.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.photo}</td>
                <td className="border p-2">{employee.department}</td>
                <td className="border p-2">{employee.gender}</td>
                <td className="border p-2">{employee.mobile}</td>
                <td className="border p-2">{employee.email}</td>
                <td className="border p-2">{employee.dob}</td>
                <td className="border p-2">{employee.joinedOn}</td>
                <td className="border p-2">{employee.address}</td>
                <td className="border p-2">{employee.city}</td>
                <td className="border p-2">{employee.state}</td>
                <td className="border p-2">{employee.country}</td>
                <td className="border p-2">{employee.appliedOn}</td>
                <td className="border p-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-1">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex justify-between items-center">
        <p>
          Showing {indexOfFirstEmployee + 1} to{" "}
          {Math.min(indexOfLastEmployee, employees.length)} of{" "}
          {employees.length} entries
        </p>
        <div>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-3 py-1 rounded mr-1"
          >
            &lt;
          </button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded mr-1">
            {currentPage}
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastEmployee >= employees.length}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
