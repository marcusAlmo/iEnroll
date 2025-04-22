import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { grade: "Kinder", 2022: 92.7, 2023: 23.64, 2024: 88.1 },
  { grade: "Prep", 2022: 97.76, 2023: 58.05, 2024: 57.75 },
  { grade: "Grade 1", 2022: 20.87, 2023: 41.29, 2024: 31.84 },
  { grade: "Grade 2", 2022: 23.93, 2023: 63.13, 2024: 99.36 },
  { grade: "Grade 3", 2022: 86.49, 2023: 55.27, 2024: 72.64 },
  { grade: "Grade 4", 2022: 69.18, 2023: 92.26, 2024: 67.99 },
  { grade: "Grade 5", 2022: 39.43, 2023: 76.82, 2024: 67.46 },
  { grade: "Grade 6", 2022: 50, 2023: 56, 2024: 89 },
];

const colors = {
  2022: "#7868E6", 
  2023: "#FF6B6B", 
  2024: "#48CAE4", 
};

const EnrollmentCountChart = () => {
  return (
    <div className="p-6 w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grade" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />

          <Bar dataKey="2022" fill={colors[2022]} barSize={30} />
          <Bar dataKey="2023" fill={colors[2023]} barSize={30} />
          <Bar dataKey="2024" fill={colors[2024]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnrollmentCountChart;
