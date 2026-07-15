import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileQuestion,
  BookOpen,
  Save,
} from "lucide-react";

import {
  getExam,
  updateExam,
  getQuestions,
} from "../../../api/examAPI";


import "../../../styles/exams/PublishExam.css";

export default function PublishExam() {

  const { examId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [publishing, setPublishing] = useState(false);

  const [exam, setExam] = useState(null);

  const [questions, setQuestions] = useState([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {
  try {
    setLoading(true);

    const exam = await getExam(examId);
    const questions = await getQuestions(examId);

    setExam(exam);

    setQuestions(
      Array.isArray(questions)
        ? questions
        : []
    );

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
};

  if (loading)
    return <h2>Loading...</h2>;

 const totalMarks =
  Array.isArray(questions)
    ? questions.reduce(
        (sum, q) => sum + Number(q.marks || 0),
        0
      )
    : 0;

  const isReady =

    questions.length > 0 &&

    totalMarks === exam?.totalMarks;

  const publishExam = async () => {

    if (!isReady) {

      return alert(
        "Exam validation failed."
      );

    }

    try {

      setPublishing(true);

      await updateExam(examId, {
        status: "Published",
      });

      alert("Exam Published Successfully.");

      navigate("/teacher/exams");

    } catch (error) {

      console.error(error);

    } finally {

      setPublishing(false);

    }

  };
  if (loading) {
  return <h2>Loading...</h2>;
}

if (!exam) {
  return <h2>Exam not found.</h2>;
}

  return (

    <div className="publish-page">

      <div className="page-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate(
              `/teacher/exams/${examId}/questions`
            )
          }
        >
          <ArrowLeft size={18} />

          Back

        </button>

        <h1>

          Publish Examination

        </h1>

      </div>

      {/* Summary */}

      <div className="summary-grid">

        <div className="summary-card">

          <BookOpen size={30} />

          <h3>

            {exam?.title}

          </h3>

          <p>

            {exam?.examType}

          </p>

        </div>

        <div className="summary-card">

          <FileQuestion size={30} />

          <h3>

            {questions.length}

          </h3>

          <p>

            Questions

          </p>

        </div>

        <div className="summary-card">

          <CheckCircle size={30} />

          <h3>

            {totalMarks}

          </h3>

          <p>

            Total Marks

          </p>

        </div>

        <div className="summary-card">

          <Clock size={30} />

          <h3>

            {exam?.duration}

          </h3>

          <p>

            Minutes

          </p>

        </div>

      </div>

      {/* Validation */}

      <div className="validation-card">

        <h2>

          Validation Checklist

        </h2>

        <ul>

          <li>

            {questions.length > 0 ? "✅" : "❌"}

            Questions Added

          </li>

          <li>

            {totalMarks === exam?.totalMarks
              ? "✅"
              : "❌"}

            Marks Match

          </li>

          <li>

            {exam?.startTime ? "✅" : "❌"}

            Start Time Set

          </li>

          <li>

            {exam?.endTime ? "✅" : "❌"}

            End Time Set

          </li>

          <li>

            {exam.duration > 0
              ? "✅"
              : "❌"}

            Duration Set

          </li>

        </ul>

      </div>

      {/* Settings */}

      <div className="settings-card">

        <h2>

          Exam Settings

        </h2>

        <table>

          <tbody>

            <tr>

              <td>

                Shuffle Questions

              </td>

              <td>

                {exam?.shuffleQuestions
                  ? "Yes"
                  : "No"}

              </td>

            </tr>

            <tr>

              <td>

                Shuffle Options

              </td>

              <td>

                {exam.shuffleOptions
                  ? "Yes"
                  : "No"}

              </td>

            </tr>

            <tr>

              <td>

                Allow Review

              </td>

              <td>

                {exam.allowReview
                  ? "Yes"
                  : "No"}

              </td>

            </tr>

            <tr>

              <td>

                Allow Navigation

              </td>

              <td>

                {exam.allowNavigation
                  ? "Yes"
                  : "No"}

              </td>

            </tr>

            <tr>

              <td>

                Show Result

              </td>

              <td>

                {exam.showResult
                  ? "Immediately"
                  : "After Release"}

              </td>

            </tr>

          </tbody>

        </table>

      </div>

      {/* Warning */}

      {!isReady && (

        <div className="warning-box">

          <AlertTriangle size={22} />

          <div>

            <strong>

              Exam Cannot Be Published

            </strong>

            <p>

              Total Question Marks must equal
              Exam Total Marks.

            </p>

          </div>

        </div>

      )}

      {/* Footer */}

      <div className="actions">

        <button
          className="cancel-btn"
          onClick={() =>
            navigate(
              `/teacher/exams/${examId}/questions`
            )
          }
        >
          Cancel
        </button>

        <button
          className="publish-btn"
          disabled={!isReady || publishing}
          onClick={publishExam}
        >
          <Save size={18} />

          {publishing
            ? "Publishing..."
            : "Publish Exam"}

        </button>

      </div>

    </div>

  );

}