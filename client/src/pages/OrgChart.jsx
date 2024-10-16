import React from "react";
import {
  DiagramComponent,
  NodeModel,
  HierarchicalTree,
  DataBinding,
  Inject,
} from "@syncfusion/ej2-react-diagrams";
import { DataManager, Query } from "@syncfusion/ej2-data";

// Data for Organization Chart
const orgData = [
  { Id: "1", Name: "Cameron Williamson", Designation: "Founder - CEO" },
  {
    Id: "2",
    Name: "Leslie Alexander",
    Designation: "Head of Project Manager",
    Manager: "1",
  },
  {
    Id: "3",
    Name: "Cody Firmansyah",
    Designation: "Senior Project Manager",
    Manager: "2",
  },
  {
    Id: "4",
    Name: "Jenni William",
    Designation: "Project Manager",
    Manager: "2",
  },
  {
    Id: "5",
    Name: "Brooklyn Simmons",
    Designation: "Creative Director",
    Manager: "1",
  },
  {
    Id: "6",
    Name: "Ralph Edwards",
    Designation: "Senior UI/UX Designer",
    Manager: "5",
  },
  {
    Id: "7",
    Name: "Brooklyn Hehe",
    Designation: "Senior Graphic Designer",
    Manager: "5",
  },
  {
    Id: "8",
    Name: "Vidi Guttilerez",
    Designation: "UI/UX Designer",
    Manager: "5",
  },
  {
    Id: "9",
    Name: "Pablo Hive",
    Designation: "Graphic Designer",
    Manager: "5",
  },
  {
    Id: "10",
    Name: "Cody Fisher",
    Designation: "Head of Development",
    Manager: "1",
  },
  {
    Id: "11",
    Name: "Asther Mulyani",
    Designation: "Senior Front-End",
    Manager: "10",
  },
  {
    Id: "12",
    Name: "Jenny Wilson",
    Designation: "QA Engineering",
    Manager: "10",
  },
  { Id: "13", Name: "Eden Khioruddin", Designation: "Back-End", Manager: "10" },
];

// Function to render the template for each employee node
const nodeTemplate = (node) => {
  return (
    <div
      style={{
        padding: "10px",
        textAlign: "center",
        borderRadius: "5px",
        backgroundColor: "#f3f4f6",
        border: "1px solid #d1d5db",
      }}
    >
      <img
        src={`https://randomuser.me/api/portraits/men/${Math.floor(
          Math.random() * 100
        )}.jpg`}
        alt={node.Name}
        className="w-16 h-16 rounded-full mx-auto mb-2"
      />
      <p className="text-lg font-semibold">{node.Name}</p>
      <p className="text-sm text-gray-600">{node.Designation}</p>
    </div>
  );
};

const OrgChart = () => {
  // DataManager is used to handle the data binding for the diagram
  const dataManager = new DataManager(orgData, new Query().take(7));

  // Diagram node settings
  const layout = {
    type: "HierarchicalTree",
    orientation: "TopToBottom",
    verticalSpacing: 40,
    horizontalSpacing: 50,
  };

  const nodeDefaults = (node) => {
    node.width = 200;
    node.height = 120;
    node.shape = { type: "HTML", content: nodeTemplate(node.data) };
    return node;
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organization Chart</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
          Edit Organization
        </button>
      </div>

      <DiagramComponent
        id="diagram"
        width={"100%"}
        height={"600px"}
        dataSourceSettings={{
          id: "Id",
          parentId: "Manager",
          dataManager: dataManager,
        }}
        layout={layout}
        getNodeDefaults={nodeDefaults}
        snapSettings={{ constraints: 0 }} // Disabling gridlines
      >
        <Inject services={[DataBinding, HierarchicalTree]} />
      </DiagramComponent>
    </div>
  );
};

export default OrgChart;
