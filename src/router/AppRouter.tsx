import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login/login";
import Dashboard from "../pages/Dashboard/dashboard";
import Area from "../pages/Area/area";
import Subarea from "../pages/Subarea/subarea";
import Cliente from "../pages/Cliente/cliente";
import Proyecto from "../pages/Proyecto/proyecto";
import Reclamo from "../pages/Reclamos/reclamo";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/areas" element={<Area />} />
        <Route path="/subareas" element={<Subarea />} />
        <Route path="/clientes" element={<Cliente />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/proyectos" element={<Proyecto />} />
        <Route path="/reclamos" element={<Reclamo />} />
        
      </Routes>
    </BrowserRouter>
  );
}