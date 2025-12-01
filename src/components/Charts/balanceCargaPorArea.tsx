// src/components/Charts/BalanceCargaChart.tsx (MODIFICADO)
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

// Define el tipo de dato que SE ESPERA DE LA API (Corregido)
export type BalanceCargaItem = {
  areaId: string; // Se devuelve el ID del área
  nombre: string; // <-- CORREGIDO: Usar 'nombre'
  cantidad: number; // <-- CORREGIDO: Usar 'cantidad'
};

type Props = { 
  data: BalanceCargaItem[] 
};

export default function BalanceCargaChart({ data }: Props) {
  // Mapeamos los datos para Chart.js
  // === CAMBIO CLAVE AQUÍ: Usamos d.nombre y d.cantidad ===
  const labels = data.map((d) => d.nombre);
  const values = data.map((d) => d.cantidad);

  // console.log("Etiquetas (Nombres):", labels);
  // console.log("Valores (Cantidad):", values);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: "Reclamos Asignados (Carga)",
        data: values,
        backgroundColor: "rgba(255, 159, 64, 0.8)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: 'y' as const, 
    plugins: {
      legend: { position: "top" as const },
      title: { 
        display: true, 
        text: "Balance de Carga por Área/Responsable" 
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad de Reclamos'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Área / Responsable'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}