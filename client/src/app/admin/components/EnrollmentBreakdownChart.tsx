import { requestData } from '@/lib/dataRequester';
import { useEffect, useRef, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { toast } from 'react-toastify';

type EnrollmentCollection = {
  name: string;
  value: number;
};

type PieChartData = {
  gradeEnrollmentCollections: EnrollmentCollection[];
  totalEnrollmentCount: number;
};

const COLORS = ['#8884d8', '#f98b9e', '#82ca9d', '#ffbb28', '#8884d8', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#6A0DAD', '#FF4567'];

const DonutChart = () => {

  // data container
  const [data, setData] = useState<PieChartData['gradeEnrollmentCollections']>([]);
  const hasFetched = useRef(false);

  // fetch data from the server
  const fetchData = async () => {
    try {
      const response = await requestData<PieChartData>({
        url: 'http://localhost:3000/api/metrics/pie-graph/data',
        method: 'GET'
      });

      if(response) {
        setData(response.gradeEnrollmentCollections);
      }
    } catch (err) {
      if(err instanceof Error) toast.error(err.message);
      else console.error(err);
    }
  }

  // execute upon render
  useEffect(() => {
    if (hasFetched.current) return; // prevent double fetch
    hasFetched.current = true;
    fetchData();
  }, []);

  return (
    <div>
      {
        data == undefined ? (
          <div className="flex justify-center items-center h-full">Loading chart...</div>
      ): data.length == 0 ? (
        <div className="flex justify-center items-center h-full">No Data</div>
      ): (
        <PieChart width={360} height={348}>
          <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={120} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            wrapperStyle={{
              paddingLeft: 25,
              lineHeight: '24px'
            }}
          />
        </PieChart>
      )
    }
    </div>
  );
};

export default DonutChart;
