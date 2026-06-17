import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Users,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Search,
  UserCheck,
  UserX,
  Mail,
  Phone,
  User,
} from "lucide-react";
import "./RegistrarForms.css";

export default function Registrars() {
  const navigate = useNavigate();
  const [registrars, setRegistrars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRegistrars();
  }, []);

  const fetchRegistrars = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/registrars");
      setRegistrars(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRegistrar = async (id) => {
    if (!window.confirm("Delete this registrar?")) return;
    try {
      await api.delete(`/registrars/${id}`);
      fetchRegistrars();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/registrars/${id}/toggle-status`);
      fetchRegistrars();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRegistrars = registrars.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="registrar-page">
      <div className="page-header-registrar">
        <div>
          <h1 className="page-title-registrar">
            <Users size={28} />
            Registrar Management
          </h1>
          <p className="page-subtitle-registrar">
            Manage registrar accounts and permissions
          </p>
        </div>
        <div className="header-actions-registrar">
          <button
            className="btn-primary-registrar"
            onClick={() => navigate("/college-head/registrars/create")}
          >
            <Plus size={18} />
            Add Registrar
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="stats-card-registrar">
        <div className="stat-left">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div>
            <div className="stat-number">{registrars.length}</div>
            <div className="stat-label">Total Registrars</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#16a34a" }}>
              {registrars.filter(r => r.status === "active").length}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Active</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#dc2626" }}>
              {registrars.filter(r => r.status === "inactive").length}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Inactive</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-filters-registrar">
        <div className="search-bar-registrar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container-registrar">
        {loading ? (
          <div className="loading-state-registrar">
            <div className="spinner"></div>
            <p>Loading registrars...</p>
          </div>
        ) : (
          <table className="registrars-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrars.map((r) => (
                <tr key={r._id}>
                  <td data-label="Name">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        background: "#eff6ff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#3b82f6"
                      }}>
                        <User size={18} />
                      </div>
                      <span style={{ fontWeight: 500 }}>{r.name}</span>
                    </div>
                  </td>
                  <td data-label="Email">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail size={14} style={{ color: "#94a3b8" }} />
                      {r.email}
                    </div>
                  </td>
                  <td data-label="Phone">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={14} style={{ color: "#94a3b8" }} />
                      {r.phone}
                    </div>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge-registrar ${r.status}`}>
                      <span className="status-dot"></span>
                      {r.status}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="actions-cell-registrar">
                      <button
                        className="action-btn-registrar view"
                        onClick={() => navigate(`/college-head/registrars/view/${r._id}`)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="action-btn-registrar edit"
                        onClick={() => navigate(`/college-head/registrars/edit/${r._id}`)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className={`action-btn-registrar toggle ${r.status === "inactive" ? "inactive" : ""}`}
                        onClick={() => toggleStatus(r._id)}
                      >
                        {r.status === "active" ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button
                        className="action-btn-registrar delete"
                        onClick={() => deleteRegistrar(r._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {filteredRegistrars.length === 0 && !loading && (
          <div className="empty-state-registrar">
            <Users size={48} />
            <h3>No registrars found</h3>
            <p>Create your first registrar account to get started</p>
            <button
              className="btn-primary-registrar"
              onClick={() => navigate("/college-head/registrars/create")}
            >
              <Plus size={16} />
              Add Registrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}