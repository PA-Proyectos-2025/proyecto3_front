// src/charts/FeedbackPorCalificacionChart.tsx
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

type Item = { promedio: number; cantidad: number };
type Props = { data: Item[] };

export default function FeedbackPorPromedioChart({ data }: Props) {
  const labels = data.map(d =>
    typeof d.promedio === "number" ? `⭐ ${d.promedio}` : "⭐ Sin promedio"
  );
  const values = data.map(d => d.cantidad);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Cantidad de responsables",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Feedback por promedio" },
    },
  };

  return <Bar data={chartData} options={options} />;
}