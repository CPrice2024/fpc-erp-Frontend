// src/pages/registrar/Enrollment.jsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  BookOpen, 
  Phone, 
  Users, 
  Upload, 
  Camera,
  Save,
  X,
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import api from "../../api/axios";
import "./Enrollment.css";

export default function Enrollment() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  const isEdit = pathname.includes("/edit/");
  const isView = pathname.includes("/view/");

  const pageTitle = isView
    ? "View Student"
    : isEdit
    ? "Edit Student"
    : "Register Student";

  const buttonTitle = isView
    ? "Back"
    : isEdit
    ? "Update Student"
    : "Register Student";

  const [activeStep, setActiveStep] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    gender: "",
    dob: "",
    nationality: "",
    
    // Education Details
    department: "",
    level: "",
    batch: "",
    academicYear: "",
    studentId: "",
    
    // Contact Information
    phone: "",
    email: "",
    region: "",
    city: "",
    address: "",
    
    // Guardian Details
    guardianName: "",
    guardianPhone: "",
    relationship: "",
  });

  const steps = [
    { id: "personal", title: "Personal Information", icon: User },
    { id: "education", title: "Education Details", icon: BookOpen },
    { id: "contact", title: "Contact Information", icon: Phone },
    { id: "guardian", title: "Guardian Details", icon: Users },
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/registrars/departments");
      setDepartments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isView) {
        navigate("/registrar/students");
        return;
      }

      setLoading(true);

      if (isEdit) {
        alert("Update API will be connected next");
      } else {
        await api.post("/registrars/students", formData);
        alert("Student registered successfully!");
      }

      navigate("/registrar/students");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="step-content">
      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input
            name="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
        <div className="form-group">
          <label>Father Name *</label>
          <input
            name="fatherName"
            placeholder="Enter father name"
            value={formData.fatherName}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
        <div className="form-group">
          <label>Grandfather Name</label>
          <input
            name="grandfatherName"
            placeholder="Enter grandfather name"
            value={formData.grandfatherName}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={isView}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date of Birth *</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
        <div className="form-group">
          <label>Nationality *</label>
          <input
            name="nationality"
            placeholder="Enter nationality"
            value={formData.nationality}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
      </div>
    </div>
  );

  const renderEducationDetails = () => (
    <div className="step-content">
      <div className="form-row">
        <div className="form-group">
          <label>Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={isView}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Level *</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            disabled={isView}
          >
            <option value="">Select Level</option>
            <option value="Level I">Level I</option>
            <option value="Level II">Level II</option>
            <option value="Level III">Level III</option>
            <option value="Level IV">Level IV</option>
            <option value="Level V">Level V</option>
          </select>
        </div>
        <div className="form-group">
          <label>Batch *</label>
          <input
            name="batch"
            placeholder="Enter batch (e.g., 2024)"
            value={formData.batch}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Academic Year *</label>
          <input
            name="academicYear"
            placeholder="Enter academic year"
            value={formData.academicYear}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
        <div className="form-group">
          <label>Student ID (Optional)</label>
          <input
            name="studentId"
            placeholder="Enter student ID"
            value={formData.studentId}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="step-content">
      <div className="form-row">
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
        <div className="form-group">
          <label>Email Address *</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Region *</label>
          <input
            name="region"
            placeholder="Enter region"
            value={formData.region}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
        <div className="form-group">
          <label>City *</label>
          <input
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label>Address *</label>
          <textarea
            name="address"
            placeholder="Enter full address"
            value={formData.address}
            onChange={handleChange}
            disabled={isView}
            rows="3"
          />
        </div>
      </div>
    </div>
  );

  const renderGuardianDetails = () => (
    <div className="step-content">
      <div className="form-row">
        <div className="form-group">
          <label>Guardian Name *</label>
          <input
            name="guardianName"
            placeholder="Enter guardian full name"
            value={formData.guardianName}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
        <div className="form-group">
          <label>Guardian Phone *</label>
          <input
            name="guardianPhone"
            placeholder="Enter guardian phone"
            value={formData.guardianPhone}
            onChange={handleChange}
            disabled={isView}
          />
        </div>
        <div className="form-group">
          <label>Relationship *</label>
          <select
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            disabled={isView}
          >
            <option value="">Select Relationship</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Legal Guardian</option>
            <option value="Sibling">Sibling</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderEducationDetails();
      case 2:
        return renderContactInfo();
      case 3:
        return renderGuardianDetails();
      default:
        return null;
    }
  };

  return (
          <div className="enrollment-container">
            {/* Header */}
            <div className="enrollment-header">
              <div>
                <h1>{pageTitle}</h1>
                <p>Fill in the information below to register a new student</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="progress-steps">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === index;
                const isCompleted = activeStep > index;
                
                return (
                  <div
                    key={step.id}
                    className={`step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                    onClick={() => !isView && setActiveStep(index)}
                  >
                    <div className="step-indicator">
                      {isCompleted ? <ChevronRight size={20} /> : <Icon size={20} />}
                    </div>
                    <div className="step-label">{step.title}</div>
                    {index < steps.length - 1 && <div className="step-line" />}
                  </div>
                );
              })}
            </div>

            {/* Photo Upload Section */}
            <div className="photo-upload-section">
              <div className="photo-upload-card">
                <div className="photo-preview">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Student" />
                  ) : (
                    <div className="photo-placeholder">
                      <Camera size={40} />
                      <span>Student Photo</span>
                    </div>
                  )}
                </div>
                {!isView && (
                  <label className="upload-btn">
                    <Upload size={16} />
                    Upload Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Form Card */}
            <div className="form-card">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {activeStep > 0 && (
                  <button
                    type="button"
                    className="nav-btn prev-btn"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                )}
                
                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    className="nav-btn next-btn"
                    onClick={handleNext}
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="nav-btn submit-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : buttonTitle}
                    <Save size={18} />
                  </button>
                )}
                
                <button
                  type="button"
                  className="nav-btn cancel-btn"
                  onClick={() => navigate("/registrar/students")}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
  );
}