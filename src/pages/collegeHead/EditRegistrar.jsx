import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import {
  User,
  Mail,
  Phone,
  ArrowLeft,
  Save,
  Shield,
  UserCog,
  AlertCircle
} from "lucide-react";
import "./RegistrarForms.css";

export default function EditRegistrar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRegistrar();
  }, [id]);

  const fetchRegistrar = async () => {
    try {
      const { data } = await api.get(`/registrars/${id}`);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        status: data.status || "active",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/registrars/${id}`, formData);
      navigate("/college-head/registrars");
    } catch (error) {
      console.error(error);
      alert("Failed to update registrar");
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="registrar-page">
      <div className="page-header-registrar">
        <div>
          <h1 className="page-title-registrar">
            <UserCog size={28} />
            Edit Registrar
          </h1>
          <p className="page-subtitle-registrar">
            Update registrar information and permissions
          </p>
        </div>
        <div className="header-actions-registrar">
          <button
            className="btn-secondary-registrar"
            onClick={() => navigate("/college-head/registrars")}
          >
            <ArrowLeft size={18} />
            Back to List
          </button>
        </div>
      </div>

      <div className="form-container-registrar">
        <div className="form-title">Edit Registrar Details</div>
        <div className="form-subtitle">Update the registrar's information below</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group-registrar">
            <label>
              <User size={16} />
              Full Name
              <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="form-control-registrar"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-registrar">
            <label>
              <Mail size={16} />
              Email Address
              <span className="required-star">*</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-control-registrar"
              placeholder="registrar@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-registrar">
            <label>
              <Phone size={16} />
              Phone Number
              <span className="required-star">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              className="form-control-registrar"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-registrar">
            <label>
              <Shield size={16} />
              Status
            </label>
            <select
              name="status"
              className="form-control-registrar"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-actions-registrar">
            <button
              type="button"
              className="btn-cancel-registrar"
              onClick={() => navigate("/college-head/registrars")}
            >
              <ArrowLeft size={16} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-registrar"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16 }}></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update Registrar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}