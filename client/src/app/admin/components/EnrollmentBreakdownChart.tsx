import { requestData } from '@/lib/dataRequester';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

/**
 * const data = [
  { name: 'Kinder', value: 119 },
  { name: 'Prep', value: 173 },
];

 */
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

  // fetch data from the server
  const fetchData = async () => {
    try {
      const response = await requestData<PieChartData>({
        url: 'http://localhost:3000/metrics/pie-graph/data',
        method: 'GET'
      });

      if(response) {
        console.log('response: ', response);
        setData(response.gradeEnrollmentCollections);
      }
    } catch (err) {
      if(err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  // execute upon render
  useEffect(() => {
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
