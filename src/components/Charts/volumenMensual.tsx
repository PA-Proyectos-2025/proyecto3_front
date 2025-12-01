
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

// Registrar los módulos de Chart.js (obligatorio para que funcione)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Tipado de cada item que devuelve el backend
export type VolumenMensualItem = {
  _id: { year: number; month: number };
  total: number;
};

// Props del componente
type Props = {
  data: VolumenMensualItem[];
};

export default function VolumenMensualChart({ data }: Props) {
  // Labels: mes/año
  const labels = data.map((d) => `${d._id.month}/${d._id.year}`);
  // Valores: cantidad de reclamos
  const values = data.map((d) => d.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Reclamos por mes",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Volumen mensual de reclamos" },
    },
  };

  return <Bar data={chartData} options={options} />;
}
