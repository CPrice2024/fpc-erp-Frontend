import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Save,
  CheckCircle,
  Copy,
  EyeOff,
  Printer,
  AlertCircle
} from "lucide-react";
import "./RegistrarForms.css";

export default function CreateRegistrar() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [createdRegistrar, setCreatedRegistrar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await api.post("/registrars", formData);
      setCreatedRegistrar(data);
      setFormData({ name: "", email: "", phone: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create registrar");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    const text = `Registrar Login Credentials\n\nEmail: ${createdRegistrar.loginCredentials.email}\nPassword: ${createdRegistrar.loginCredentials.password}`;
    navigator.clipboard.writeText(text);
    alert("Credentials copied to clipboard");
  };

  return (
    <div className="registrar-page">
      <div className="page-header-registrar">
        <div>
          <h1 className="page-title-registrar">
            <UserPlus size={28} />
            Create Registrar
          </h1>
          <p className="page-subtitle-registrar">
            Add a new registrar account with login credentials
          </p>
        </div>
        <div className="header-actions-registrar">
          <button
           className="upload-btnn"
            onClick={() => navigate("/college-head/registrars")}
          >
            <ArrowLeft size={18} />
            Back to List
          </button>
        </div>
      </div>

      <div className="form-container-registrar">
        <div className="form-title">Registrar Information</div>
        <div className="form-subtitle">Fill in the details below to create a new registrar account</div>

        {createdRegistrar && (
          <div className="credentials-section">
            <div className="cred-header">
              <CheckCircle size={20} style={{ color: "#16a34a" }} />
              <h4>Registrar Created Successfully</h4>
            </div>
            <div className="credentials-grid">
              <div className="cred-item">
                <div className="cred-label">Email</div>
                <div className="cred-value">{createdRegistrar.loginCredentials.email}</div>
              </div>
              <div className="cred-item">
                <div className="cred-label">Password</div>
                <div className="cred-value" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {showPassword ? createdRegistrar.loginCredentials.password : "••••••••••••"}
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                  >
                    <EyeOff size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="cred-actions">
              <button className="upload-btnn" onClick={copyCredentials}>
                <Copy size={16} />
                Copy Credentials
              </button>
              <button className="upload-btnn" onClick={() => window.print()}>
                <Printer size={16} />
                Print
              </button>
              <button
                className="upload-btnn"
                onClick={() => navigate("/college-head/registrars")}
              >
                View All Registrars
              </button>
            </div>
          </div>
        )}

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

          <div className="form-actions-registrar">
            <button
              type="button"
              className="upload-btnn"
              onClick={() => navigate("/college-head/registrars")}
            >
              <ArrowLeft size={16} />
              Cancel
            </button>
            <button
              type="submit"
              className="upload-btnn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16 }}></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Registrar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}