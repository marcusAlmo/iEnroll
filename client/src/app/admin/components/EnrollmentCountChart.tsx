import { requestData } from "@/lib/dataRequester";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

/**
 * const data = [
  { grade: "Kinder", 2022: 92.7, 2023: 23.64, 2024: 88.1 },
  { grade: "Prep", 2022: 97.76, 2023: 58.05, 2024: 57.75 },
  { grade: "Grade 1", 2022: 20.87, 2023: 41.29, 2024: 31.84 },
  { grade: "Grade 2", 2022: 23.93, 2023: 63.13, 2024: 99.36 },
  { grade: "Grade 3", 2022: 86.49, 2023: 55.27, 2024: 72.64 },
  { grade: "Grade 4", 2022: 69.18, 2023: 92.26, 2024: 67.99 },
  { grade: "Grade 5", 2022: 39.43, 2023: 76.82, 2024: 67.46 },
  { grade: "Grade 6", 2022: 50, 2023: 56, 2024: 89 },
];
 */

type EnrollmentTrendData = {
  [year: string]: number;
} & {
  grade: string;
};

type EnrollmentTrendResponse = {
  record: EnrollmentTrendData[];
  years: string[];
}


const EnrollmentCountChart = () => {

  const [data, setData] = useState<EnrollmentTrendResponse['record']>([]);
  const [years, setyears] = useState<string[]>([]);

  const fetchData = async () => {
    try{
      const response = await requestData<EnrollmentTrendResponse>({
        url: 'http://localhost:3000/metrics/enrollment-trend-data/data',
        method: 'GET'
      });

      if(response){
        console.log('response: ', response);
        setyears(response.years.map(String));
        setData(response.record);
      }
    }catch(err){
      if(err instanceof Error)
        console.log(err.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="p-6 w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grade" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />

          <Bar dataKey={years[0]} fill={"#7868E6"} barSize={30} />
          <Bar dataKey={years[1]} fill={"#FF6B6B"} barSize={30} />
          <Bar dataKey={years[2]} fill={"#48CAE4"} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnrollmentCountChart;
