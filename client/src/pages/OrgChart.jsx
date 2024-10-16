
// import React from "react";
// import {
//   DiagramComponent,
//   Inject,
//   DataBinding,
//   HierarchicalTree
// } from "@syncfusion/ej2-react-diagrams";
// import { DataManager, Query } from "@syncfusion/ej2-data";
// import './OrgChart.css'
// // Data for Organization Chart
// const orgData = [
//   { Id: "1", Name: "Cameron Williamson", Designation: "Founder - CEO" },
//   {
//     Id: "2",
//     Name: "Leslie Alexander",
//     Designation: "Head of Project Manager",
//     Manager: "1",
//   },
//   {
//     Id: "3",
//     Name: "Cody Firmansyah",
//     Designation: "Senior Project Manager",
//     Manager: "2",
//   },
//   {
//     Id: "4",
//     Name: "Jenni William",
//     Designation: "Project Manager",
//     Manager: "2",
//   },
//   {
//     Id: "5",
//     Name: "Brooklyn Simmons",
//     Designation: "Creative Director",
//     Manager: "1",
//   },
//   {
//     Id: "6",
//     Name: "Ralph Edwards",
//     Designation: "Senior UI/UX Designer",
//     Manager: "5",
//   },
//   {
//     Id: "7",
//     Name: "Brooklyn Hehe",
//     Designation: "Senior Graphic Designer",
//     Manager: "5",
//   },
//   {
//     Id: "8",
//     Name: "Vidi Guttilerez",
//     Designation: "UI/UX Designer",
//     Manager: "5",
//   },
//   {
//     Id: "9",
//     Name: "Pablo Hive",
//     Designation: "Graphic Designer",
//     Manager: "5",
//   },
//   {
//     Id: "10",
//     Name: "Cody Fisher",
//     Designation: "Head of Development",
//     Manager: "1",
//   },
//   {
//     Id: "11",
//     Name: "Asther Mulyani",
//     Designation: "Senior Front-End",
//     Manager: "10",
//   },
//   {
//     Id: "12",
//     Name: "Jenny Wilson",
//     Designation: "QA Engineering",
//     Manager: "10",
//   },
//   { Id: "13", Name: "Eden Khioruddin", Designation: "Back-End", Manager: "10" },
// ];

// const OrgChart = () => {
//   const dataManager = new DataManager(orgData);

//   const getNodeDefaults = (obj) => {
//     obj.shape = {
//       type: "HTML",
//       content: `<div class="employee-node">
//         <img src="https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_thumb,g_face,r_max/beach_huts.jpg" alt="${obj.Name}" class="employee-image" />
//         <div class="employee-details">
//           <div class="employee-name">${obj.Name}</div>
//           <div class="employee-designation">${obj.Designation}</div>
//         </div>
//       </div>`,
//     };
//     obj.style = { fill: "none", strokeColor: "none" };
//     obj.borderColor = "transparent";
//     obj.backgroundColor = "transparent";
//     obj.width = 200;
//     obj.height = 100;
//     return obj;
//   };

//   const layout = {
//     type: "HierarchicalTree",
//     orientation: "TopToBottom",
//     horizontalSpacing: 40,
//     verticalSpacing: 40,
//   };

//   return (
//     <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Organization Chart</h1>
//         <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
//           Edit Organization
//         </button>
//       </div>

//       <DiagramComponent
//         id="diagram"
//         width="100%"
//         height="600px"
//         dataSourceSettings={{
//           id: "Id",
//           parentId: "Manager",
//           dataManager: dataManager,
//         }}
//         getNodeDefaults={getNodeDefaults}
//         layout={layout}
//       >
//         <Inject services={[DataBinding, HierarchicalTree]} />
//       </DiagramComponent>
//     </div>
//   );
// };

// export default OrgChart;

import React from "react";
import {
  DiagramComponent,
  Inject,
  DataBinding,
  HierarchicalTree
} from "@syncfusion/ej2-react-diagrams";
import { DataManager } from "@syncfusion/ej2-data";

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

const OrgChart = () => {
  const dataManager = new DataManager(orgData);

  const getNodeDefaults = (obj) => {
    obj.shape = {
      type: "HTML",
      content: `
        <div class="employee-node" style="background-color: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <img src="https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_thumb,g_face,r_max/beach_huts.jpg" alt="${obj.Name}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 8px;" />
          <div style="text-align: center;">
            <div style="font-weight: bold; font-size: 14px;">${obj.Name}</div>
            <div style="font-size: 12px; color: #666;">${obj.Designation}</div>
          </div>
        </div>`,
    };
    obj.style = { fill: "none", strokeColor: "none" };
    obj.borderColor = "transparent";
    obj.backgroundColor = "transparent";
    obj.width = 180;
    obj.height = 120;
    return obj;
  };

  const layout = {
    type: "HierarchicalTree",
    orientation: "TopToBottom",
    horizontalSpacing: 50,
    verticalSpacing: 50,
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
        width="100%"
        height="600px"
        dataSourceSettings={{
          id: "Id",
          parentId: "Manager",
          dataManager: dataManager,
        }}
        getNodeDefaults={getNodeDefaults}
        layout={layout}
        backgroundColor="white"
      >
        <Inject services={[DataBinding, HierarchicalTree]} />
      </DiagramComponent>
    </div>
  );
};

export default OrgChart;