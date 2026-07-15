import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  FileQuestion,
  Eye,
} from "lucide-react";

import { getExam, updateExam, getQuestions, deleteQuestion, } from "../../../api/examAPI";


import "../../../styles/exams/QuestionList.css";

export default function QuestionList() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [exam, setExam] = useState(null);

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadData();
  }, [examId]);

 const loadData = async () => {
  try {
    setLoading(true);

    const exam = await getExam(examId);
    const questions = await getQuestions(examId);
    console.log("========== EXAM ==========");
    console.log(exam);

    console.log("========== QUESTIONS ==========");
    console.log(questions);

    console.log("Is Array:", Array.isArray(questions));

    setExam(exam);

    setQuestions(
      Array.isArray(questions)
        ? questions
        : []
    );

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

 const totalMarks = useMemo(() => {
  if (!Array.isArray(questions)) return 0;

  return questions.reduce(
    (sum, q) => sum + Number(q.marks || 0),
    0
  );
}, [questions]);

  const progress =
  exam && exam.totalMarks > 0
    ? (totalMarks / exam.totalMarks) * 100
    : 0;

  const canPublish =
    exam &&
    questions.length > 0 &&
    totalMarks === exam.totalMarks &&
    exam.status === "Draft";

  const publishExam = async () => {
    try {
      await updateExam(exam._id, {
        status: "Published",
      });

      alert("Exam published successfully.");

      loadData();

    } catch (err) {
      console.error(err);
    }
  };

  const removeQuestion = async (id) => {

    if (
      !window.confirm(
        "Delete this question?"
      )
    )
      return;

    try {

      await deleteQuestion(id);

      loadData();

    } catch (err) {

      console.error(err);

    }
  };

  if (loading)
    return <p>Loading...</p>;

  return (
    <div className="question-page">

      <div className="question-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/teacher/exams")
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>

          <h1>{exam?.title}</h1>

          <p>
            {exam?.course?.courseCode} •{" "}
            {exam?.examType}
          </p>

        </div>

      </div>

      {/* Statistics */}

      <div className="exam-summary">

        <div className="summary-card">
          <h2>{questions.length}</h2>
          <span>Questions</span>
        </div>

        <div className="summary-card">
          <h2>
            {totalMarks}/{exam?.totalMarks}
          </h2>
          <span>Marks</span>
        </div>

        <div className="summary-card">
          <h2>{progress.toFixed(0)}%</h2>
          <span>Completed</span>
        </div>

        <div className="summary-card">
          <h2>{exam?.status}</h2>
          <span>Status</span>
        </div>

      </div>

      {/* Progress */}

      <div className="progress-card">

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <p>

          {totalMarks} / {exam?.totalMarks} marks

        </p>

      </div>

      {/* Toolbar */}

      <div className="toolbar">

        <button
          className="add-btn"
          onClick={() =>
            navigate(
              `/teacher/exams/${examId}/questions/create`
            )
          }
        >
          <Plus size={18} />
          Add Question
        </button>

       <button
    className="publish-btn"
    onClick={() =>
        navigate(
            `/teacher/exams/${examId}/publish`
        )
    }
>
    Publish Exam
</button>

      </div>

      {!canPublish && exam?.status === "Draft" && (
        <div className="warning">

          <strong>Exam cannot be published.</strong>

          <br />

          Total Question Marks:
          {" "}
          {totalMarks}

          /

          {exam?.totalMarks}

        </div>
      )}

      {/* Questions */}

      {questions.length === 0 ? (

        <div className="empty-state">

          <FileQuestion size={70} />

          <h2>No Questions Added</h2>

          <p>
            Click Add Question to begin.
          </p>

        </div>

      ) : (

        <div className="question-list">

          {questions.map((question) => (

            <div
              key={question._id}
              className="question-card"
            >

              <div className="question-top">

                <h3>

                  Question {question.order}

                </h3>

                <span>

                  {question.marks} Marks

                </span>

              </div>

              <p>

                {question.questionText}

              </p>

              <small>

                {question.questionType}

              </small>

              <div className="question-actions">

                <button
                  onClick={() =>
                    navigate(
                      `/teacher/questions/edit/${question._id}`
                    )
                  }
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    removeQuestion(
                      question._id
                    )
                  }
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
  onClick={() =>
    navigate(
      `/teacher/questions/${question._id}/preview`
    )
  }
>
  <Eye size={16} />
  Preview
</button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}