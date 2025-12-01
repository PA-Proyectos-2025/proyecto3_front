import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Item = { _id: string; promedioDias: number; totalReclamos: number };
type Props = { data: Item[] };

export default function TiempoPromResChart({ data }: Props) {
  const labels = data.map((d) => d._id);
  const values = data.map((d) => d.promedioDias);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Promedio días de resolución",
        data: values,
        backgroundColor: "rgba(136, 132, 216, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Tiempo promedio de resolución" },
    },
  };

  return <Bar data={chartData} options={options} />;
}
