import {
  Chart as ChartJS,
  ArcElement, // Para gráficos de Pie/Doughnut
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Registrar los elementos necesarios para un gráfico de Torta/Rosquilla
ChartJS.register(ArcElement, Title, Tooltip, Legend);

// Define el tipo de dato que se espera de la API para la distribución por estado
export type DistribucionPorEstadoItem = {
  // Ej: 'Abierto', 'En Proceso', 'Cerrado'
  estadoNombre: string; 
  // Ej: 15, 30, 55
  cantidad: number;
};

type Props = { 
  data: DistribucionPorEstadoItem[] 
};

// Paleta de colores para asegurar una buena visualización en la torta
const BACKGROUND_COLORS = [
  '#0a3a96', // Azul fuerte (ej. Abierto)
  '#3a7bfd', // Azul medio (ej. En Proceso)
  '#74d493', // Verde (ej. Resuelto)
  '#fbc46b', // Amarillo (ej. Pendiente)
  '#f16368', // Rojo (ej. Rechazado)
  '#cccccc', // Gris (ej. Cancelado)
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
        // Usamos solo los colores necesarios
        backgroundColor: BACKGROUND_COLORS.slice(0, labels.length), 
        borderColor: "#ffffff", // Borde blanco entre segmentos
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
        text: "Distribución de Reclamos por Estado Actual" 
      },
      tooltip: {
        callbacks: {
          // Mostrar porcentaje en el tooltip
          label: (context: any) => {
            const label = context.label || '';
            const total = context.dataset.data.reduce((sum: number, value: number) => sum + value, 0);
            const currentValue = context.raw;
            const percentage = ((currentValue / total) * 100).toFixed(1);
            return `${label}: ${currentValue} (${percentage}%)`;
          },
        },
      }
    },
  };

  return <Pie data={chartData} options={options} />;
}