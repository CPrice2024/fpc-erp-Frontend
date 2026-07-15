import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";

import { getExamResults } from "../../../api/examAPI";

import "../../../styles/exams/ExamResults.css";

export default function ExamResults() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [examType, setExamType] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadResults();
  }, [examType]);

  const loadResults = async () => {
    try {
      setLoading(true);

      const data = await getExamResults(examType);

      setResults(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    return results.filter((item) => {

      const student =
        `${item.student?.studentId || ""} ${item.student?.firstName || ""} ${item.student?.fatherName || ""}`
          .toLowerCase();

      const exam =
        item.exam?.title?.toLowerCase() || "";

      return (
        student.includes(search.toLowerCase()) ||
        exam.includes(search.toLowerCase())
      );
    });
  }, [results, search]);

  return (
    <div className="exam-results-page">

      {/* Header */}

      <div className="page-header">

        <div>

          <h1>Digital Exam Results</h1>

          <p>
            View all submitted online examinations.
          </p>

        </div>

        <button
          className="refresh-btn"
          onClick={loadResults}
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      {/* Filters */}

      <div className="toolbar">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search student or exam..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="filter-box">

          <Filter size={18} />

          <select
            value={examType}
            onChange={(e) =>
              setExamType(e.target.value)
            }
          >
            <option value="">All Exams</option>
            <option value="Quiz">Quiz</option>
            <option value="Mid">Mid</option>
            <option value="Final">Final</option>
          </select>

        </div>

      </div>

      {/* Table */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>#</th>

              <th>Student</th>

              <th>Exam</th>

              <th>Course</th>

              <th>Type</th>

              <th>Score</th>

              <th>Percentage</th>

              <th>Status</th>

              <th>Submitted</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan="10">
                  Loading...
                </td>

              </tr>

            ) : filteredResults.length === 0 ? (

              <tr>

                <td colSpan="10">
                  No results found.
                </td>

              </tr>

            ) : (

              filteredResults.map(
                (item, index) => (

                  <tr key={item._id}>

                    <td>{index + 1}</td>

                    <td>

                      <strong>
                        {item.student?.studentId}
                      </strong>

                      <br />

                      {item.student?.firstName}{" "}
                      {item.student?.fatherName}

                    </td>

                    <td>
                      {item.exam?.title}
                    </td>

                    <td>
                      {item.course?.courseCode}
                      <br />
                      {item.course?.courseName}
                    </td>

                    <td>
                      {item.exam?.examType}
                    </td>

                    <td>
                      {item.score} /
                      {item.totalMarks}
                    </td>

                    <td>
                      {item.percentage}%
                    </td>

                    <td>

                      <span
                        className={
                          item.isPassed
                            ? "passed"
                            : "failed"
                        }
                      >
                        {item.isPassed
                          ? "Passed"
                          : "Failed"}
                      </span>

                    </td>

                    <td>

                      {item.submittedAt
                        ? new Date(
                            item.submittedAt
                          ).toLocaleString()
                        : "-"}

                    </td>

                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(
                            `/teacher/exams/results/${item._id}`
                          )
                        }
                      >
                        <Eye size={16} />

                        View

                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

      {/* Summary */}

      <div className="summary-cards">

        <div className="summary-card">

          <FileSpreadsheet size={22} />

          <div>

            <h3>
              {filteredResults.length}
            </h3>

            <p>Total Attempts</p>

          </div>

        </div>

        <div className="summary-card">

          <h3>

            {
              filteredResults.filter(
                (r) => r.isPassed
              ).length
            }

          </h3>

          <p>Passed</p>

        </div>

        <div className="summary-card">

          <h3>

            {
              filteredResults.filter(
                (r) => !r.isPassed
              ).length
            }

          </h3>

          <p>Failed</p>

        </div>

      </div>

    </div>
  );
}