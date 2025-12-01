// src/charts/TopProyectosChart.tsx
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

type Item = { proyectoId: string; nombre: string; cantidad: number };
type Props = { data: Item[] };

export default function TopProyectosChart({ data }: Props) {
  const labels = data.map(d => d.nombre || "Sin nombre");
  const values = data.map(d => d.cantidad);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Reclamos por proyecto",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Top proyectos por reclamos" },
    },
  };

  return <Bar data={chartData} options={options} />;
}