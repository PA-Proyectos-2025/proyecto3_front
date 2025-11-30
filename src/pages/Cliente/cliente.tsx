import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { getClientes, deleteCliente, type Cliente } from "../../api/clientes"; // ← Importa el tipo Cliente
import ClienteForm from "../../components/ClienteForm/clienteForm";
import "./cliente.css";

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estados para el formulario
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  
  const itemsPerPage = 3;

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      console.log('🚀 Cargando clientes...');
      
      const data = await getClientes();
      
      console.log('📦 Clientes cargados:', data);
      
      setClientes(data);
      setError("");
    } catch (err) {
      setError("Error al cargar los clientes");
      console.error('💥 Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        console.log("🗑️ Eliminando cliente con ID:", id);
        await deleteCliente(id);
        console.log("✅ Cliente eliminado exitosamente");
        await loadClientes();
        alert("Cliente eliminado correctamente");
      } catch (err: any) {
        console.error("💥 Error al eliminar:", err);
        setError(err.message || "Error al eliminar el cliente");
        alert("Error al eliminar el cliente");
      }
    }
  };

  const handleEdit = (cliente: Cliente) => {
    console.log("✏️ Editando cliente:", cliente);
    setSelectedCliente(cliente);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedCliente(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCliente(null);
  };

  const handleFormSuccess = async () => {
    console.log("✅ Operación exitosa, recargando datos...");
    await loadClientes();
    handleFormClose();
  };

  const filteredClientes = clientes.filter((cliente) =>
    (cliente.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (cliente.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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
              placeholder="Buscar cliente por nombre o email"
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

          <button className="btn-add" onClick={handleAdd}>
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
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(cliente)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(cliente._id)}
                          title="Eliminar"
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

        {totalPages > 1 && (
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

      {isFormOpen && (
        <ClienteForm
          cliente={selectedCliente}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}