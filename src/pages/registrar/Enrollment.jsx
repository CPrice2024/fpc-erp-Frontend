
import { useState, useEffect, useRef  } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { 
  User, 
  BookOpen, 
  Phone, 
  Users, 
  Upload, 
  Camera,
  Save,
  X,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

import api from "../../api/axios";
import "./Enrollment.css";

export default function Enrollment() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const { id } = useParams();

const isEditMode = !!id;

  const isEdit = !!id;  
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
  const [showCamera, setShowCamera] = useState(false);

const videoRef = useRef(null);
const canvasRef = useRef(null);
const streamRef = useRef(null);

const startCamera = async () => {
  try {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
      });

    streamRef.current = stream;

    setShowCamera(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, 100);

  } catch (error) {
    console.error(error);
    alert("Camera access denied");
  }
};

const stopCamera = () => {
  if (streamRef.current) {
    streamRef.current
      .getTracks()
      .forEach(track => track.stop());
  }

  setShowCamera(false);
};

const capturePhoto = () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;

  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  canvas.toBlob((blob) => {

    const file = new File(
      [blob],
      `student-${Date.now()}.jpg`,
      {
        type: "image/jpeg",
      }
    );

    setPhotoFile(file);
    setPhotoPreview(
      URL.createObjectURL(blob)
    );

    stopCamera();

  }, "image/jpeg");
};
const handlePhotoChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    setPhotoFile(file);
    setPhotoPreview(
      URL.createObjectURL(file)
    );
  }
};

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    gender: "",
    dob: "",
    nationality: "",


    // Inmate Information
isInmate: false,
prisonId: "",
crimeType: "",
sentenceDuration: "",
securityLevel: "",
prisonFacility: "",
cellNumber: "",
imprisonmentStartDate: "",
expectedReleaseDate: "",
paroleDate: "",
currentStatus: "",
assignedOfficer: "",
officerPhone: "",
    
    // Education Details
    department: "",
    level: "",
    batch: "",
    academicYear: "",
    institutionName: "",
educationType: "",
educationLanguage: "",

registrationDate: "",
educationStartDate: "",
educationEndDate: "",
durationMonths: "",
    studentId: "",
    highestQualification: "",
previousInstitution: "",
previousEducation: "",

program: "",
major: "",
semester: "",

studyMode: "",
enrollmentStatus: "",
educationSponsor: "",
    
    // Contact Information
    phone: "",
    email: "",
    region: "",
    Woreda: "",
    city: "",
    SpecificPlace: "",
    address: "",
    
    // Guardian Details
    guardianName: "",
    guardianPhone: "",
    relationship: "",
  });

const steps = [
  {
    id: "personal",
    title: "Personal Information",
    icon: User,
  },

  {
    id: "education",
    title: "Education Details",
    icon: BookOpen,
  },

  ...(formData.isInmate
    ? [
        {
          id: "inmate",
          title: "Inmate Details",
          icon: Users,
        },
      ]
    : []),

  {
    id: "contact",
    title: "Contact Information",
    icon: Phone,
  },

  {
    id: "guardian",
    title: "Guardian Details",
    icon: Users,
  },
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

  

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? checked
        : value,
  }));
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

const fetchStudent = async () => {

  try {

    const { data } =
      await api.get(
        `/registrars/students/${id}`
      );

      setFormData((prev) => ({
  ...prev,
  ...data,

  department:
    data.department?._id ||
    data.department ||
    "",

  dob:
    data.dob?.split("T")[0] || "",

  registrationDate:
    data.registrationDate?.split("T")[0] || "",

  educationStartDate:
    data.educationStartDate?.split("T")[0] || "",

  educationEndDate:
    data.educationEndDate?.split("T")[0] || "",

  imprisonmentStartDate:
    data.imprisonmentStartDate?.split("T")[0] || "",

  expectedReleaseDate:
    data.expectedReleaseDate?.split("T")[0] || "",

  paroleDate:
    data.paroleDate?.split("T")[0] || "",

  isInmate:
    data.isInmate || false,
}));

    if (data.photo) {
      setPhotoPreview(
        `http://localhost:5000${data.photo}`
      );
    }

  } catch (error) {
    console.error(error);
  }
};

const handleSubmit = async () => {
  try {

    setLoading(true);

    const submitData =
      new FormData();

      Object.entries(formData).forEach(([key, value]) => {
  submitData.append(
    key,
    value ?? ""
  );
});


    if (photoFile) {
      submitData.append(
        "photo",
        photoFile
      );
    }

    if (isEditMode) {

      await api.put(
        `/registrars/students/${id}`,
        submitData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Student updated successfully"
      );

    } else {

      await api.post(
        "/registrars/students",
        submitData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Student registered successfully"
      );

    }

    navigate(
      "/registrar/records"
    );

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Operation failed"
    );

  } finally {
    setLoading(false);
  }
};

useEffect(() => {

  if (id) {
    fetchStudent();
  }

}, [id]);

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
      <div className="form-row">

  <label className="checkbox-label">

    <input
      type="checkbox"
      name="isInmate"
      checked={formData.isInmate}
      onChange={handleChange}
      disabled={isView}
      
    />
     <h3>Inmate Student</h3>

  </label>
 

</div>
    </div>
  );

  const renderInmateDetails = () => (
  <div className="step-content">

    <h3 className="section-title">
      Inmate Information
    </h3>

    <div className="form-row">

      <div className="form-group">
        <label>Prison ID</label>
        <input
          name="prisonId"
          value={formData.prisonId}
          onChange={handleChange}
          disabled={isView}
        />
      </div>

      <div className="form-group">
        <label>Crime Type</label>
        <input
          name="crimeType"
          value={formData.crimeType}
          onChange={handleChange}
          disabled={isView}
        />
      </div>

      <div className="form-group">
        <label>Sentence Duration (Years)</label>
        <input
          type="number"
          name="sentenceDuration"
          value={formData.sentenceDuration}
          onChange={handleChange}
          disabled={isView}
        />
      </div>

    </div>

    <div className="form-row">

      <div className="form-group">
        <label>Security Level</label>

        <select
          name="securityLevel"
          value={formData.securityLevel}
          onChange={handleChange}
          disabled={isView}
        >
          <option value="">Select</option>
          <option>Minimum</option>
          <option>Medium</option>
          <option>Maximum</option>
          <option>Special</option>
        </select>

      </div>

      <div className="form-group">
        <label>Prison Facility</label>

        <input
          name="prisonFacility"
          value={formData.prisonFacility}
          onChange={handleChange}
          disabled={isView}
        />

      </div>

      <div className="form-group">
        <label>Cell Number</label>

        <input
          name="cellNumber"
          value={formData.cellNumber}
          onChange={handleChange}
          disabled={isView}
        />

      </div>

    </div>

    <div className="form-row">

      <div className="form-group">
        <label>Imprisonment Start Date</label>

        <input
          type="date"
          name="imprisonmentStartDate"
          value={formData.imprisonmentStartDate}
          onChange={handleChange}
          disabled={isView}
        />

      </div>

      <div className="form-group">
        <label>Expected Release Date</label>

        <input
          type="date"
          name="expectedReleaseDate"
          value={formData.expectedReleaseDate}
          onChange={handleChange}
          disabled={isView}
        />

      </div>

      <div className="form-group">
        <label>Parole Date</label>

        <input
          type="date"
          name="paroleDate"
          value={formData.paroleDate}
          onChange={handleChange}
          disabled={isView}
        />

      </div>

    </div>

    <div className="form-row">

      <div className="form-group">

        <label>Current Status</label>

        <select
          name="currentStatus"
          value={formData.currentStatus}
          onChange={handleChange}
          disabled={isView}
        >
          <option value="">Select</option>
          <option>In Custody</option>
          <option>Released</option>
          <option>Transferred</option>
          <option>Parole</option>
        </select>

      </div>

      <div className="form-group">

        <label>Assigned Officer</label>

        <input
          name="assignedOfficer"
          value={formData.assignedOfficer}
          onChange={handleChange}
          disabled={isView}
        />

      </div>

      <div className="form-group">

        <label>Officer Phone</label>

        <input
          name="officerPhone"
          value={formData.officerPhone}
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
        {/* Previous Education */}
        <div className="form-group">
  <label>Institution Name</label>
  <input
    name="institutionName"
    value={formData.institutionName}
    onChange={handleChange}
    disabled={isView}
  />
</div>

<div className="form-group">
  <label>Education Type</label>
  <select
    name="educationType"
    value={formData.educationType}
    onChange={handleChange}
    disabled={isView}
  >
    <option value="">Select</option>
    <option>Primary</option>
    <option>Secondary</option>
    <option>TVET</option>
    <option>Diploma</option>
    <option>Bachelor</option>
    <option>Master</option>
  </select>
</div>

<div className="form-group">
  <label>Highest Qualification</label>

  <input
    type="text"
    name="highestQualification"
    value={formData.highestQualification}
    onChange={handleChange}
  />
</div>

<div className="form-group">
  <label>Previous Institution</label>

  <input
    type="text"
    name="previousInstitution"
    value={formData.previousInstitution}
    onChange={handleChange}
  />
</div>

<div className="form-group">
  <label>Previous Education</label>

  <select
    name="previousEducation"
    value={formData.previousEducation}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option>Primary</option>
    <option>Secondary</option>
    <option>TVET</option>
    <option>Diploma</option>
    <option>Bachelor</option>
    <option>Master</option>
  </select>
</div>
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
  <label>Program</label>

  <input
    type="text"
    name="program"
    value={formData.program}
    onChange={handleChange}
  />
</div>

<div className="form-group">
  <label>Major / Specialization</label>

  <input
    type="text"
    name="major"
    value={formData.major}
    onChange={handleChange}
  />
</div>

<div className="form-group">
  <label>Semester</label>

  <select
    name="semester"
    value={formData.semester}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option>Semester I</option>
    <option>Semester II</option>
    <option>Semester III</option>
  </select>
</div>
<div className="form-group">
  <label>Study Mode</label>

  <select
    name="studyMode"
    value={formData.studyMode}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option>Full Time</option>
    <option>Part Time</option>
    <option>Weekend</option>
    <option>Distance</option>
  </select>
</div>

<div className="form-group">
  <label>Enrollment Status</label>

  <select
    name="enrollmentStatus"
    value={formData.enrollmentStatus}
    onChange={handleChange}
  >
    <option value="">Select</option>
    <option>Enrolled</option>
    <option>Deferred</option>
    <option>Graduated</option>
    <option>Suspended</option>
    <option>Withdrawn</option>
  </select>
</div>

<div className="form-group">
  <label>Education Sponsor</label>

  <input
    type="text"
    name="educationSponsor"
    value={formData.educationSponsor}
    onChange={handleChange}
  />
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
  <label>Registration Date</label>

  <input
    type="date"
    name="registrationDate"
    value={formData.registrationDate}
    onChange={handleChange}
    disabled={isView}
  />
</div>

<div className="form-group">
  <label>Education Start Date</label>

  <input
    type="date"
    name="educationStartDate"
    value={formData.educationStartDate}
    onChange={handleChange}
    disabled={isView}
  />
</div>

<div className="form-group">
  <label>Education End Date</label>

  <input
    type="date"
    name="educationEndDate"
    value={formData.educationEndDate}
    onChange={handleChange}
    disabled={isView}
  />
</div>

<div className="form-group">
  <label>Duration (Months)</label>

  <input
    type="number"
    name="durationMonths"
    value={formData.durationMonths}
    onChange={handleChange}
    disabled={isView}
  />
</div>
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
          <label>Woreda *</label>
          <input
            name="Woreda"
            placeholder="Enter Woreda"
            value={formData.Woreda}
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
        <div className="form-group">
          <label>Specific Place *</label>
          <input
            name="SpecificPlace"
            placeholder="Enter Specific Place"
            value={formData.SpecificPlace}
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

  let index = 0;

  if (activeStep === index)
    return renderPersonalInfo();

  index++;

  if (activeStep === index)
    return renderEducationDetails();

  index++;

  if (formData.isInmate) {

    if (activeStep === index)
      return renderInmateDetails();

    index++;
  }

  if (activeStep === index)
    return renderContactInfo();

  index++;

  if (activeStep === index)
    return renderGuardianDetails();

  return null;
};

  return (
          <div className="enrollment-container">
            {/* Header */}
            <div className="enrollment-container">
              <div>
                <h1>
  {isEditMode
    ? "Edit Student"
    : "Student Enrollment"}
</h1>
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

        <img
          src={photoPreview}
          alt="Student"
        />

      ) : (

        <div className="photo-placeholder">
          <Camera size={40} />
          <span>Student Photo</span>
        </div>

      )}

    </div>

    {!isView && (

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >

        {/* Upload Photo */}
        <div className="form-navigation">

        <label className="upload-btnn">

          <Upload size={16} />
          Upload

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handlePhotoChange}
          />

        </label>
        <button
          type="button"
          className="upload-btnn"
          onClick={startCamera}
        >
          <Camera size={16} />
          Take Photo
        </button>
        </div>

        {/* Take Photo */}

        

      </div>

    )}

  </div>

  {/* Camera Modal */}

  {showCamera && (

    <div className="camera-modal">

      <div className="camera-card">

        <h3>
          Capture Student Photo
        </h3>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="camera-video"
        />

        <canvas
          ref={canvasRef}
          style={{
            display: "none",
          }}
        />

        <div className="camera-actions">

          <button
            type="button"
            className="add-btn"
            onClick={capturePhoto}
          >
            <Camera size={18} />
            Capture
          </button>

          <button
            type="button"
            className="refresh-btn"
            onClick={stopCamera}
          >
            <X size={18} />
            Cancel
          </button>

        </div>

      </div>

    </div>

  )}

</div>
            

            {/* Form Card */}
            <div className="form-card">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {activeStep > 0 && (
                  <button
                    type="button"
                    className="refresh-btn"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                )}
                
                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    className="refresh-btn"
                    onClick={handleNext}
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="add-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : buttonTitle}
                    <Save size={18} />
                  </button>
                )}
                
                <button
                  type="button"
                  className="refresh-btn"
                  onClick={() => navigate("/registrar/records")}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
  );
}