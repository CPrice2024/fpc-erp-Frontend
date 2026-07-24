import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  FileQuestion,
  Edit,
  Trash2,
  BarChart3,
} from "lucide-react";

import { getExams } from "../../../api/examAPI";

import "../../../styles/exams/ExamList.css";

export default function ExamList() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadExams();
  }, []);

 const loadExams = async () => {
  try {
    setLoading(true);

    const data = await getExams();

    console.log("EXAMS RESPONSE:", data);
    console.log("IS ARRAY:", Array.isArray(data));

    setExams(Array.isArray(data) ? data : []);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {

      const matchSearch =
        exam.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "All"
          ? true
          : exam.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [exams, search, statusFilter]);

  const stats = {
    total: exams.length,

    draft: exams.filter(
      (x) => x.status === "Draft"
    ).length,

    published: exams.filter(
      (x) => x.status === "Published"
    ).length,

    completed: exams.filter(
      (x) => x.status === "Completed"
    ).length,
  };

  return (
    <div className="exam-page">

      {/* Header */}

      <div className="exam-header">

        <div>

          <h1>Digital Examinations</h1>

          <p>
            Manage all digital exams.
          </p>

        </div>

        <button
          className="upload-btnn"
          onClick={() =>
            navigate("/teacher/exams/create")
          }
        >
          <Plus size={18} />
          Create Exam
        </button>

      </div>

      {/* Filters */}

      <div className="exam-toolbar">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search exam..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>Draft</option>
          <option>Published</option>
          <option>Completed</option>
        </select>

      </div>

      {/* Statistics */}

      <div className="exam-stats">

        <div className="stat-card">
          <h2>{stats.total}</h2>
          <span>Total Exams</span>
        </div>

        <div className="stat-card">
          <h2>{stats.draft}</h2>
          <span>Draft</span>
        </div>

        <div className="stat-card">
          <h2>{stats.published}</h2>
          <span>Published</span>
        </div>

        <div className="stat-card">
          <h2>{stats.completed}</h2>
          <span>Completed</span>
        </div>

      </div>

      {/* Table */}

      <div className="exam-table">

        {loading ? (

          <p>Loading...</p>

        ) : filteredExams.length === 0 ? (

          <div className="empty">

            <FileQuestion size={60} />

            <h3>No Exams Found</h3>

          </div>

        ) : (

          <table>

            <thead>

              <tr>

                <th>Title</th>

                <th>Course</th>

                <th>Type</th>

                <th>Status</th>

                <th>Duration</th>

                <th>Total Marks</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredExams.map((exam) => (

                <tr key={exam._id}>

                  <td>{exam.title}</td>

                  <td>
                    {exam.course?.courseName}
                  </td>

                  <td>{exam.examType}</td>

                  <td>{exam.status}</td>

                  <td>
                    {exam.duration} mins
                  </td>

                  <td>
                    {exam.totalMarks}
                  </td>

                  <td className="actions">

                    <button
                    className="upload-btnn"
                      onClick={() =>
                        navigate(
                          `/teacher/exams/edit/${exam._id}`
                        )
                      }
                    >
                      <Edit size={16} />
                    </button>

                    <button
                    className="upload-btnn"
                      onClick={() =>
                        navigate(
                          `/teacher/exams/${exam._id}/questions`
                        )
                      }
                    >
                      <FileQuestion size={16} />
                    </button>

                    <button
                    className="upload-btnn"
                      onClick={() =>
                        navigate(
                          "/teacher/exams/results"
                        )
                      }
                    >
                      <BarChart3 size={16} />
                    </button>

                    <button
                    className="upload-btnn">
                      
                      <Trash2 size={16} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}