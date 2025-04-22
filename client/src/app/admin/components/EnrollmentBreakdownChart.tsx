import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Kinder', value: 119 },
  { name: 'Prep', value: 173 },
  { name: 'Grade 1', value: 186 },
  { name: 'Grade 2', value: 156 },
  { name: 'Grade 3', value: 82 },
  { name: 'Grade 4', value: 172 },
  { name: 'Grade 5', value: 130 },
  { name: 'Grade 6', value: 225 },
  { name: 'Grade 7', value: 126 },
  { name: 'Grade 8', value: 158 },
  { name: 'Grade 9', value: 87 },
  { name: 'Grade 10', value: 183 },
];

const COLORS = ['#8884d8', '#f98b9e', '#82ca9d', '#ffbb28', '#8884d8', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#6A0DAD', '#FF4567'];

const DonutChart = () => {
  return (
    <PieChart width={348} height={348}>
      <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={120} fill="#8884d8" dataKey="value">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend layout="vertical" align="right" verticalAlign="middle" />
    </PieChart>
  );
};

export default DonutChart;
