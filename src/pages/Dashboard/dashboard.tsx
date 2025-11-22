import Sidebar from "../../components/Sidebar/sidebar";
import StatusCard from "../../components/StatusCard/statusCard";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Panel de Administración</h1>
          <div className="admin-badge">
            <div className="admin-avatar"></div>
            <span className="admin-text">ADMINISTRADOR</span>
          </div>
        </div>

        <div className="cards-container">
          <StatusCard color="yellow" value={8} label="Pendientes" icon="⏱" />
          <StatusCard color="blue" value={18} label="En proceso" icon="⚙️" />
          <StatusCard color="green" value={20} label="Resueltos" icon="✔" />
          <StatusCard color="red" value={11} label="Críticos" icon="⚠️" />
        </div>
      </div>
    </div>
  );
}