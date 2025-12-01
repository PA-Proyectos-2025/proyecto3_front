import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type Props = {
  data: { estadoActual: string }[];
};

export default function EstadoActualChart({ data }: Props) {
  // Agrupar por estado
  const grouped = data.reduce((acc: any, item) => {
    acc[item.estadoActual] = (acc[item.estadoActual] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Reclamos por estado",
        data: values,
        backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Estado actual de reclamos" },
    },
  };

  return <Pie data={chartData} options={options} />;
}
