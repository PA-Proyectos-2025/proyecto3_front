import "./sidebar.css";
import { Users, LayoutDashboard, UsersRound, FolderOpen, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/areas", icon: Users, label: "Áreas" },
    { path: "/subareas", icon: Users, label: "Subáreas" },
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/clientes", icon: UsersRound, label: "Clientes" },
    { path: "/proyectos", icon: FolderOpen, label: "Proyectos" },
    { path: "/reclamos", icon: AlertTriangle, label: "Reclamos" },
    { path: "/historial", icon: null, label: "Historial" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon ? (
                <item.icon className="sidebar-icon" size={24} />
              ) : (
                <div className="sidebar-icon info-icon">
                  <span>i</span>
                </div>
              )}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        Salir
      </button>
    </div>
  );
}