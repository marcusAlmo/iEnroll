import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { grade: "Kinder", 2022: 30, 2023: 40, 2024: 50 },
  { grade: "Prep", 2022: 50, 2023: 70, 2024: 80 },
  { grade: "Grade 1", 2022: 20, 2023: 50, 2024: 40 },
  { grade: "Grade 2", 2022: 40, 2023: 60, 2024: 70 },
  { grade: "Grade 3", 2022: 30, 2023: 45, 2024: 50 },
  { grade: "Grade 4", 2022: 50, 2023: 70, 2024: 80 },
  { grade: "Grade 5", 2022: 60, 2023: 80, 2024: 90 },
  { grade: "Grade 6", 2022: 40, 2023: 55, 2024: 65 },
  { grade: "Grade 7", 2022: 50, 2023: 60, 2024: 70 },
  { grade: "Grade 8", 2022: 30, 2023: 40, 2024: 50 },
  { grade: "Grade 9", 2022: 20, 2023: 30, 2024: 40 },
  { grade: "Grade 10", 2022: 60, 2023: 70, 2024: 80 },
];

const colors = {
  2022: "#FF6B6B",
  2023: "#7868E6",
  2024: "#48CAE4",
};

const EnrollmentChart = () => {
  return (
    <div className="p-6 w-full">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <XAxis dataKey="grade" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Area type="monotone" dataKey="2022" stroke={colors[2022]} fill={colors[2022]} fillOpacity={0.3} dot={{ r: 4 }} />

          <Area type="monotone" dataKey="2023" stroke={colors[2023]} fill={colors[2023]} fillOpacity={0.3} dot={{ r: 4 }} />

          <Area type="monotone" dataKey="2024" stroke={colors[2024]} fill={colors[2024]} fillOpacity={0.3} dot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnrollmentChart;
