// src/charts/TotalReclamosEnProcesoChart.tsx
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type Props = { total: number };

export default function TotalReclamosEnProcesoChart({ total }: Props) {
  const chartData = {
    labels: ["En proceso", "Otros"],
    datasets: [
      {
        label: "Reclamos",
        data: [total, 0], // mostramos solo el total en proceso
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(200, 200, 200, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(200, 200, 200, 0.5)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Total reclamos en proceso" },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}