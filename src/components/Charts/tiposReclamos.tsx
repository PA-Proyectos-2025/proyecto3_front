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

type Item = { nombre: string; cantidad: number };
type Props = { data: Item[] };

export default function TiposReclamosChart({ data }: Props) {
  const labels = data.map((d) => d.nombre);
  const values = data.map((d) => d.cantidad);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Cantidad de reclamos",
        data: values,
        backgroundColor: "rgba(255, 198, 88, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Tipos de reclamos más comunes" },
    },
  };

  return <Bar data={chartData} options={options} />;
}
