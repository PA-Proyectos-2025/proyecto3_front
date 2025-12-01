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

type Props = {
  data: { nombreResponsable: string }[];
};

export default function ReclamoByResponsableChart({ data }: Props) {
  // Normalizar datos: asignar "Sin responsable" si falta el nombre
  const normalizedData = data.map(item => ({
    ...item,
    nombreResponsable: item.nombreResponsable?.trim() || "Cantidad de Reclamos",
  }));

  // Agrupar por responsable
  const grouped = normalizedData.reduce((acc: Record<string, number>, item) => {
    acc[item.nombreResponsable] = (acc[item.nombreResponsable] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  // Asignar color especial si hay "Sin responsable"
  const backgroundColors = labels.map(label =>
    label === "Cantidad de Reclamos" ? "rgba(255, 99, 132, 0.6)" : "rgba(130, 202, 157, 0.6)"
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Reclamos por responsable",
        data: values,
        backgroundColor: backgroundColors,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const, // horizontal
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Reclamos por responsable" },
    },
  };

  return <Bar data={chartData} options={options} />;
}