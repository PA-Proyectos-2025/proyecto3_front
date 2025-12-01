import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Registrar elementos necesarios
ChartJS.register(ArcElement, Title, Tooltip, Legend);

export type DistribucionPorEstadoItem = {
  estadoNombre: string;
  cantidad: number;
};

type Props = {
  data: DistribucionPorEstadoItem[];
};

const BACKGROUND_COLORS = [
  "#0a3a96", // Azul fuerte
  "#3a7bfd", // Azul medio
  "#74d493", // Verde
  "#fbc46b", // Amarillo
  "#f16368", // Rojo
  "#cccccc", // Gris
];

export default function DistribucionPorEstadoChart({ data }: Props) {
  const labels = data.map((d) => d.estadoNombre);
  const values = data.map((d) => d.cantidad);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Cantidad de Reclamos",
        data: values,
        backgroundColor: BACKGROUND_COLORS.slice(0, labels.length),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Distribución de Reclamos por Estado Actual",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const total = context.dataset.data.reduce(
              (sum: number, value: number) => sum + value,
              0
            );
            const currentValue = context.raw;
            const percentage = ((currentValue / total) * 100).toFixed(1);
            return `${label}: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}