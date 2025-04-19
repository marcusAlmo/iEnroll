import { requestData } from "@/lib/dataRequester";
//import { CodeSquare } from "lucide-react";
import /**React, */ { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";


type EnrollmentTrendData = {
  [year: string]: number;
} & {
  grade: string;
};

type EnrollmentTrendResponse = {
  record: EnrollmentTrendData[];
  years: string[];
}

const EnrollmentChart = () => {

  const [data, setData] = useState<EnrollmentTrendResponse['record']>([]);
  const [years, setyears] = useState<string[]>([]);

  const fetchData = async () => {
    try{
      const response = await requestData<EnrollmentTrendResponse>({
        url: 'http://localhost:3000/api/metrics/enrollment-trend-data/data',
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
    <div className="p-1 w-full">
      {data == undefined ? (
        <div className="flex justify-center items-center h-full">Loading chart...</div>
      ): data.length == 0 ? (
        <div className="flex justify-center items-center h-full">No Data</div>
      ): (<ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <XAxis dataKey="grade" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Area type="monotone" dataKey={years[0]} stroke={"#FF6B6B"} fill={"#FF6B6B"} fillOpacity={0.3} dot={{ r: 4 }} />

          <Area type="monotone" dataKey={years[1]} stroke={"#7868E6"} fill={"#7868E6"} fillOpacity={0.3} dot={{ r: 4 }} />

          <Area type="monotone" dataKey={years[2]} stroke={"#48CAE4"} fill={"#48CAE4"} fillOpacity={0.3} dot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>)}
    </div>
  );
};

export default EnrollmentChart;
