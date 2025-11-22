import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { getClientes, deleteCliente } from "../../api/clientes";
import "./cliente.css";

type Cliente = {
  _id: string;
  nombre: string;
  email: string;
  cuit: string;
  direccion: string;
  razonSocial: string;
};

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
      setError("");
    } catch (err) {
      setError("Error al cargar los clientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await deleteCliente(id);
        await loadClientes();
      } catch (err) {
        setError("Error al eliminar el cliente");
        console.error(err);
      }
    }
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClientes = filteredClientes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="clientes-container">
        <Sidebar />
        <div className="clientes-content">
          <div className="loading">Cargando clientes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="clientes-container">
      <Sidebar />

      <div className="clientes-content">
        <div className="clientes-header">
          <h1 className="clientes-title">Clientes</h1>
          <div className="admin-badge">
            <div className="admin-avatar"></div>
            <span className="admin-text">ADMINISTRADOR</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="clientes-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>

          <button className="btn-add">
            Agregar <span className="plus-icon">+</span>
          </button>
        </div>

        <div className="table-container">
          <table className="clientes-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>CUIT</th>
                <th>Dirección</th>
                <th>Razón Social</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    No se encontraron clientes
                  </td>
                </tr>
              ) : (
                paginatedClientes.map((cliente) => (
                  <tr key={cliente._id}>
                    <td className="td-nombre">{cliente.nombre}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.cuit}</td>
                    <td>{cliente.direccion}</td>
                    <td>{cliente.razonSocial}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit">✏️</button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(cliente._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>
            <span className="pagination-info">
              Página {currentPage}/{totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
