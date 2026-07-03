import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { changePassword } from "../../api/profileAPI";
import "../../styles/ChangePassword.css";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!form.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!form.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccessMessage("Password changed successfully!");
      
      // Clear form
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect after delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Unable to change password.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="change-password-page">
      <form className="password-card" onSubmit={handleSubmit}>
        <h2>
          <Lock size={20} />
          Change Password
        </h2>
        <p>Update your account password</p>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <CheckCircle size={10} />
            {successMessage}
          </div>
        )}

        {/* Current Password */}
        <div className="password-group">
          <label>
            Current Password
            <span className="required-star">*</span>
          </label>
          <div className={`password-input ${errors.currentPassword ? "error" : ""}`}>
            <Lock size={18} />
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.currentPassword}
            </span>
          )}
        </div>

        {/* New Password */}
        <div className="password-group">
          <label>
            New Password
            <span className="required-star">*</span>
          </label>
          <div className={`password-input ${errors.newPassword ? "error" : ""}`}>
            <Lock size={18} />
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.newPassword}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="password-group">
          <label>
            Confirm Password
            <span className="required-star">*</span>
          </label>
          <div className={`password-input ${errors.confirmPassword ? "error" : ""}`}>
            <Lock size={18} />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Global Error */}
        {errors.submit && (
          <div className="error-text" style={{ marginBottom: "16px" }}>
            <AlertCircle size={14} />
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="password-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Cancel
          </button>
          <button
            type="submit"
            className="save-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}