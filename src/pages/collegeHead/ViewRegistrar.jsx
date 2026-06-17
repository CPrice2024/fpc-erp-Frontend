import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  ArrowLeft,
  Edit2,
  Clock,
  UserCheck,
  UserX
} from "lucide-react";
import "./RegistrarForms.css";

export default function ViewRegistrar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registrar, setRegistrar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrar();
  }, [id]);

  const fetchRegistrar = async () => {
    try {
      const { data } = await api.get(`/registrars/${id}`);
      setRegistrar(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="registrar-page">
        <div className="loading-state-registrar">
          <div className="spinner"></div>
          <p>Loading registrar details...</p>
        </div>
      </div>
    );
  }

  if (!registrar) {
    return (
      <div className="registrar-page">
        <div className="empty-state-registrar">
          <User size={48} />
          <h3>Registrar not found</h3>
          <p>The registrar you're looking for doesn't exist</p>
          <button
            className="btn-primary-registrar"
            onClick={() => navigate("/college-head/registrars")}
          >
            <ArrowLeft size={16} />
            Back to Registrars
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registrar-page">
      <div className="page-header-registrar">
        <div>
          <h1 className="page-title-registrar">
            <User size={28} />
            Registrar Details
          </h1>
          <p className="page-subtitle-registrar">
            View registrar information and account details
          </p>
        </div>
        <div className="header-actions-registrar">
          <button
            className="btn-secondary-registrar"
            onClick={() => navigate("/college-head/registrars")}
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            className="btn-primary-registrar"
            onClick={() => navigate(`/college-head/registrars/edit/${registrar._id}`)}
          >
            <Edit2 size={18} />
            Edit
          </button>
        </div>
      </div>

      <div className="details-card-registrar">
        <div className="details-header-registrar">
          <div className="avatar">
            <User size={32} />
          </div>
          <div className="name-title">
            <h2>{registrar.name}</h2>
            <p className="role">Registrar</p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span className={`status-badge-registrar ${registrar.status}`}>
              <span className="status-dot"></span>
              {registrar.status}
            </span>
          </div>
        </div>

        <div className="details-body-registrar">
          <div className="detail-row-registrar">
            <span className="detail-label">
              <Mail size={18} />
              Email Address
            </span>
            <span className="detail-value">{registrar.email}</span>
          </div>

          <div className="detail-row-registrar">
            <span className="detail-label">
              <Phone size={18} />
              Phone Number
            </span>
            <span className="detail-value">{registrar.phone}</span>
          </div>

          <div className="detail-row-registrar">
            <span className="detail-label">
              <Shield size={18} />
              Role
            </span>
            <span className="detail-value" style={{ textTransform: "capitalize" }}>
              {registrar.role || "Registrar"}
            </span>
          </div>

          <div className="detail-row-registrar">
            <span className="detail-label">
              <Calendar size={18} />
              Created
            </span>
            <span className="detail-value">{formatDate(registrar.createdAt)}</span>
          </div>

          {registrar.updatedAt && registrar.updatedAt !== registrar.createdAt && (
            <div className="detail-row-registrar">
              <span className="detail-label">
                <Clock size={18} />
                Last Updated
              </span>
              <span className="detail-value">{formatDate(registrar.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}