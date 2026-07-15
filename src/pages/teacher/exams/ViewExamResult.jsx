import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Award,
  User,
  BookOpen,
  Calendar,
} from "lucide-react";

import { getExamResult } from "../../../api/examAPI";

import "../../../styles/exams/ViewExamResult.css";

export default function ViewExamResult() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadResult();
  }, [id]);

  const loadResult = async () => {
    try {
      setLoading(true);

      const data = await getExamResult(id);

      setResult(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="exam-result-loading">
        Loading Result...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="exam-result-loading">
        Result not found.
      </div>
    );
  }

  return (
    <div className="view-exam-result">

      {/* Header */}

      <div className="page-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/teacher/exams/results")
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1>Exam Result Details</h1>

      </div>

      {/* Summary */}

      <div className="result-summary">

        <div className="summary-card">

          <User size={22} />

          <div>

            <h3>
              {result.student?.firstName}{" "}
              {result.student?.fatherName}
            </h3>

            <p>
              {result.student?.studentId}
            </p>

          </div>

        </div>

        <div className="summary-card">

          <BookOpen size={22} />

          <div>

            <h3>
              {result.exam?.title}
            </h3>

            <p>
              {result.exam?.examType}
            </p>

          </div>

        </div>

        <div className="summary-card">

          <Award size={22} />

          <div>

            <h3>
              {result.score} / {result.totalMarks}
            </h3>

            <p>
              {result.percentage}%
            </p>

          </div>

        </div>

        <div className="summary-card">

          <Calendar size={22} />

          <div>

            <h3>
              {result.submittedAt
                ? new Date(
                    result.submittedAt
                  ).toLocaleString()
                : "-"}
            </h3>

            <p>
              Submitted
            </p>

          </div>

        </div>

      </div>

      {/* Status */}

      <div className="result-status">

        {result.isPassed ? (

          <span className="passed">

            <CheckCircle size={18} />

            Passed

          </span>

        ) : (

          <span className="failed">

            <XCircle size={18} />

            Failed

          </span>

        )}

      </div>

      {/* Questions */}

      <div className="question-section">

        <h2>Question Review</h2>

        {result.answers?.length === 0 ? (

          <p>No answers found.</p>

        ) : (

          result.answers?.map(
            (answer, index) => (

              <div
                key={answer._id}
                className="question-card"
              >

                <h3>

                  Question {index + 1}

                </h3>

                <p>

                  {answer.question?.questionText}

                </p>

                <div className="answer-grid">

                  <div>

                    <strong>

                      Student Answer

                    </strong>

                    <p>

                      {answer.selectedAnswer}

                    </p>

                  </div>

                  <div>

                    <strong>

                      Correct Answer

                    </strong>

                    <p>

                      {
                        answer.question
                          ?.correctAnswer
                      }

                    </p>

                  </div>

                  <div>

                    <strong>

                      Marks

                    </strong>

                    <p>

                      {answer.marksAwarded} /
                      {
                        answer.question
                          ?.marks
                      }

                    </p>

                  </div>

                  <div>

                    <strong>

                      Result

                    </strong>

                    <p
                      className={
                        answer.isCorrect
                          ? "correct"
                          : "incorrect"
                      }
                    >

                      {answer.isCorrect
                        ? "Correct"
                        : "Incorrect"}

                    </p>

                  </div>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}