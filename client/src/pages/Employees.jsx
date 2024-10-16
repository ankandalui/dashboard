import React from "react";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Page,
} from "@syncfusion/ej2-react-grids";
import { employeesData, employeesGrid } from "../data/dummy";
import { Header } from "../components";
import { Search as SearchIcon, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Employees = () => {
  const toolbarOptions = ["Search"];
  const editing = { allowDeleting: true, allowEditing: true };

  // Function to dynamically assign background color based on the department
  const departmentTemplate = (props) => {
    const bgColor =
      {
        Design: "bg-green-100 text-green-800",
        Development: "bg-blue-100 text-blue-800",
        HR: "bg-purple-100 text-purple-800",
        PM: "bg-orange-100 text-orange-800",
        "QA Engineering": "bg-yellow-100 text-yellow-800",
        "Business & Development": "bg-indigo-100 text-indigo-800",
      }[props.Department] || "bg-gray-100 text-gray-800";
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${bgColor}`}>
        {props.Department}
      </span>
    );
  };

  // Function to display action buttons in each row
  const actionTemplate = () => {
    return (
      <div className="flex items-center justify-between">
        <button className="text-blue-600 text-sm font-medium">
          See Details
        </button>
        <MoreVertical className="h-5 w-5 text-gray-400" />
      </div>
    );
  };

  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      {/* Top Header with Title and Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee</h1>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">
            Export
          </button>
          <a
            href="/employeeadd"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
          >
            + Add Employee
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button className="text-blue-600 font-medium">Manage Employees</button>
        {/* Navigate to the Organization Chart page */}
        <button className="text-gray-600" onClick={() => navigate("/orgchart")}>
          Organization Chart
        </button>
        <button className="text-gray-600">Request Time Off</button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            placeholder="Search keyword..."
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">
          Filter
        </button>
      </div>

      {/* Employee Grid */}
      <GridComponent
        dataSource={employeesData}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={toolbarOptions}
        className="border-none"
      >
        <ColumnsDirective>
          {employeesGrid.map((item, index) => {
            if (item.field === "EmployeeImage") {
              return (
                <ColumnDirective
                  key={index}
                  {...item}
                  template={(props) => (
                    <img
                      src={props.EmployeeImage}
                      alt={props.Name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                />
              );
            }
            if (item.field === "Department") {
              return (
                <ColumnDirective
                  key={index}
                  {...item}
                  template={departmentTemplate}
                />
              );
            }
            if (item.field === "Action") {
              return (
                <ColumnDirective
                  key={index}
                  {...item}
                  template={actionTemplate}
                />
              );
            }
            return <ColumnDirective key={index} {...item} />;
          })}
        </ColumnsDirective>
        <Inject services={[Search, Page]} />
      </GridComponent>
    </div>
  );
};

export default Employees;
