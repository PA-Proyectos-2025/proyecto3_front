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

type Item = { calificacion: number; cantidad: number; porcentaje: number };
type Props = { data: Item[] };

export default function FeedbackPorCalificacionChart({ data }: Props) {
  const labels = data.map(d => `⭐ ${d.calificacion}`);
  const values = data.map(d => d.cantidad);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Cantidad de feedbacks",
        data: values,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Feedback por calificación" },
    },
  };

  return <Bar data={chartData} options={options} />;
}