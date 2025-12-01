// src/components/Charts/topProyectos.tsx
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

export type TopProyectoItem = {
  proyectoId: string;
  proyectoNombre?: string;
  cantidad: number;
};

type Props = { 
  data: TopProyectoItem[] 
};

export default function TopProyectosChart({ data }: Props) {
  // === LÓGICA CLAVE: Usa proyectoNombre si está disponible, si no, usa proyectoId ===
  // Esto garantiza que el nombre se use siempre que no sea nulo, indefinido o una cadena vacía.
  const labels = data.map((d) => d.proyectoNombre || d.proyectoId);
  
  const values = data.map((d) => d.cantidad);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Cantidad de reclamos",
        data: values,
        backgroundColor: "rgba(10, 58, 150, 0.6)",
        borderColor: "rgba(10, 58, 150, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Top Proyectos por Cantidad de Reclamos" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad de Reclamos'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Proyectos'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}