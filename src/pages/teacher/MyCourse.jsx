import { useEffect, useState } from "react";
import { 
  BookOpen, 
  GraduationCap, 
  Building2, 
  Clock, 
  AlertCircle,
  RefreshCw,
  User,
  Upload,
  Trash2,
  ExternalLink,
  FileText,
} from "lucide-react";
import { teacherAPI } from "../../services/teacherAPI";
import {
  uploadBook,
  getBooks,
  deleteBook,
} from "../../api/digitalBookAPI";
import "./MyCourse.css";

export default function MyCourse() {
  const [course, setCourse] = useState(null);
  const [books, setBooks] = useState([]);

const [title, setTitle] = useState("");

const [description, setDescription] =
  useState("");

const [file, setFile] = useState(null);

const [uploading, setUploading] =
  useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await teacherAPI.myCourse();
      setCourse(data);
      const list = await getBooks(data._id);

setBooks(list);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
  if (!title || !file) {
    return alert("Select a file.");
  }

  try {
    setUploading(true);

    const formData = new FormData();

    formData.append("title", title);

    formData.append(
      "description",
      description
    );

    formData.append("book", file);

    await uploadBook(formData);

    alert("Book uploaded.");

    setTitle("");

    setDescription("");

    setFile(null);

    loadCourse();

  } catch (err) {

    console.error(err);

    alert(
      err.response?.data?.message ||
      "Upload failed."
    );

  } finally {

    setUploading(false);

  }
};

const removeBook = async (id) => {

  if (
    !window.confirm("Delete this book?")
  )
    return;

  await deleteBook(id);

  loadCourse();

};

  if (loading) {
    return (
      <div className="teacher-course-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-course-page">
        <div className="empty-state">
          <AlertCircle size={48} />
          <h2>Unable to Load Course</h2>
          <p>{error}</p>
          <button 
            className="retry-btn" 
            onClick={loadCourse}
            style={{
              marginTop: "12px",
              padding: "10px 24px",
              background: "#1a1f2e",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="teacher-course-page">
        <div className="empty-state">
          <BookOpen size={48} />
          <h2>No Course Assigned</h2>
          <p>You haven't been assigned a course yet. Please contact your department head.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-course-page">
      <div className="page-header">
        <h1>
          <BookOpen size={18} />
          My Course
        </h1>
        <p>View your assigned teaching course details</p>
      </div>

      <div className="course-card">
        <div className="course-title">
          <BookOpen size={18} />
          <div>
            <h2>{course.courseName}</h2>
            <p>{course.courseCode}</p>
          </div>
        </div>

        <div className="course-grid">
          <div className="info-box">
            <GraduationCap size={22} />
            <div>
              <span>Level</span>
              <strong>{course.level || "N/A"}</strong>
            </div>
          </div>

          <div className="info-box">
            <Clock size={22} />
            <div>
              <span>Semester</span>
              <strong>{course.semester || "N/A"}</strong>
            </div>
          </div>

          <div className="info-box">
            <Building2 size={22} />
            <div>
              <span>Department</span>
              <strong>{course.department?.name || "N/A"}</strong>
            </div>
          </div>

          <div className="info-box">
            <BookOpen size={22} />
            <div>
              <span>Credit Hour</span>
              <strong>{course.creditHour || "N/A"}</strong>
            </div>
          </div>

          <div className="info-box">
            <User size={22} />
            <div>
              <span>Section</span>
              <strong>{course.section || "N/A"}</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="library-card">

  <div className="library-header">

    <h2>

      <BookOpen size={20} />

      Digital Course Library

    </h2>

  </div>

  <div className="upload-grid">

    <input
      placeholder="Book title"
      value={title}
      onChange={(e)=>
        setTitle(e.target.value)
      }
    />

    <input
      placeholder="Description"
      value={description}
      onChange={(e)=>
        setDescription(e.target.value)
      }
    />

    <input
      type="file"
      accept=".pdf,.doc,.docx,.ppt,.pptx"
      onChange={(e)=>
        setFile(e.target.files[0])
      }
    />

    <button
      onClick={handleUpload}
      disabled={uploading}
      className="upload-btn"
    >

      <Upload size={18}/>

      {uploading
        ? "Uploading..."
        : "Upload Book"}

    </button>

  </div>

  <div className="book-list">

    {books.length===0 ? (

      <div className="empty-books">

        No books uploaded.

      </div>

    ) : (

      books.map(book=>(
        <div
          key={book._id}
          className="book-item"
        >

          <div>

            <FileText size={22}/>

            <div>

              <strong>

                {book.title}

              </strong>

              <p>

                {book.description}

              </p>

            </div>

          </div>

          <div className="book-actions">

            <a
              href={`http://localhost:5000/${book.filePath}`}
              target="_blank"
              rel="noreferrer"
            >

              <ExternalLink size={18}/>

            </a>

            <button
              onClick={()=>
                removeBook(book._id)
              }
            >

              <Trash2 size={18}/>

            </button>

          </div>

        </div>
      ))
    )}

  </div>

</div>
    </div>
  );
}