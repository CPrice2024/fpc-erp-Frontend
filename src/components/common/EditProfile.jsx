import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Upload, User, Mail, Phone, Building2, Briefcase, AlertCircle } from "lucide-react";
import { getProfile, updateProfile } from "../../api/profileAPI";
import "../../styles/EditProfile.css";
import avatar from "../../assets/avatar.png";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(avatar);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await getProfile();

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        department: data.department?.name || "",
        role: data.role || "",
      });

      if (data.photo) {
        setPreview(
          `${import.meta.env.VITE_API_URL.replace("/api", "")}${data.photo}`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (form.phone && !/^\+?[\d\s-]{10,}$/.test(form.phone)) {
      newErrors.phone = "Phone number is invalid";
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

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        photo: "Photo must be less than 5MB",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors({
        ...errors,
        photo: "Please upload an image file",
      });
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setErrors({
      ...errors,
      photo: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      if (photo) {
        formData.append("photo", photo);
      }

      await updateProfile(formData);
      setSuccessMessage("Profile updated successfully!");
      
      // Reset photo state after successful update
      setPhoto(null);
      
      // Redirect after delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrors({
        submit: err.response?.data?.message || "Failed to update profile.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="edit-profile-page">
      <form className="edit-profile-card" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>
        <p className="card-subtitle">Update your personal information and photo</p>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <AlertCircle size={18} />
            {successMessage}
          </div>
        )}

        {/* Photo Section */}
        <div className="photo-section">
          <img src={preview} alt="Profile" className="edit-photo" />
          <label className="upload-btn">
            <Upload size={18} />
            Change Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhoto}
            />
          </label>
          {errors.photo && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.photo}
            </span>
          )}
        </div>

        {/* Form Grid */}
        <div className="form-grid">
          <div className="full-width">
            <label>
              Full Name
              <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? "error" : ""}
              />
            </div>
            {errors.name && (
              <span className="error-text">
                <AlertCircle size={14} />
                {errors.name}
              </span>
            )}
          </div>

          <div className="full-width">
            <label>
              Email
              <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@college.edu"
                className={errors.email ? "error" : ""}
              />
            </div>
            {errors.email && (
              <span className="error-text">
                <AlertCircle size={14} />
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label>Phone</label>
            <div className="input-with-icon">
              <Phone className="input-icon" size={18} />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className={errors.phone ? "error" : ""}
              />
            </div>
            {errors.phone && (
              <span className="error-text">
                <AlertCircle size={14} />
                {errors.phone}
              </span>
            )}
          </div>

          <div>
            <label>Department</label>
            <div className="input-with-icon">
              <Building2 className="input-icon" size={18} />
              <input
                value={form.department}
                disabled
              />
            </div>
          </div>

          <div>
            <label>Role</label>
            <div className="input-with-icon">
              <Briefcase className="input-icon" size={18} />
              <input
                value={form.role}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Global Error */}
        {errors.submit && (
          <div className="error-text" style={{ marginBottom: "16px" }}>
            <AlertCircle size={14} />
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="edit-actions">
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}