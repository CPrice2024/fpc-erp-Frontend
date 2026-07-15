import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  FileQuestion,
} from "lucide-react";

import { getQuestion } from "../../../api/examAPI";

import "../../../styles/exams/PreviewQuestion.css";

export default function PreviewQuestion() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [question, setQuestion] = useState(null);

  useEffect(() => {

    loadQuestion();

  }, []);

  const loadQuestion = async () => {
  try {
    setLoading(true);

    const question = await getQuestion(id);

    setQuestion({
      exam: question.exam || "",
      order: question.order || 1,
      marks: question.marks || 0,
      questionText: question.questionText || "",
      questionType: question.questionType || "Multiple Choice",
      options: question.options || [],
      correctAnswer: question.correctAnswer || "",
      explanation: question.explanation || "",
      image: question.image || "",
    });

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {

    return <h2>Loading...</h2>;

  }

  if (!question) {

    return <h2>Question not found.</h2>;

  }

  return (

    <div className="preview-question-page">

      {/* Header */}

      <div className="preview-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate(
              `/teacher/exams/${question.exam}/questions`
            )
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1>

          <FileQuestion size={28} />

          Preview Question

        </h1>

      </div>

      {/* Card */}

      <div className="preview-card">

        <div className="question-top">

          <span>

            Question {question.order}

          </span>

          <span>

            {question.marks} Marks

          </span>

        </div>

        <h2>

          {question.questionText}

        </h2>

        {question.image && (

          <img
            src={question.image}
            alt="Question"
            className="question-image"
          />

        )}

        {/* Multiple Choice */}

        {question.questionType ===
          "Multiple Choice" && (

          <div className="option-list">

            {question.options.map((option) => (

              <div
                key={option.optionId}
                className={`option-card ${
                  option.optionId ===
                  question.correctAnswer
                    ? "correct"
                    : ""
                }`}
              >

                <span>

                  {option.optionId}

                </span>

                <p>

                  {option.text}

                </p>

                {option.optionId ===
                  question.correctAnswer && (

                  <CheckCircle
                    size={18}
                  />

                )}

              </div>

            ))}

          </div>

        )}

        {/* True / False */}

        {question.questionType ===
          "True / False" && (

          <div className="answer-box">

            <strong>

              Correct Answer:

            </strong>

            <p>

              {question.correctAnswer}

            </p>

          </div>

        )}

        {/* Short Answer */}

        {question.questionType ===
          "Short Answer" && (

          <div className="answer-box">

            <strong>

              Expected Answer

            </strong>

            <p>

              {question.correctAnswer}

            </p>

          </div>

        )}

        {/* Essay */}

        {question.questionType ===
          "Essay" && (

          <div className="essay-box">

            <p>

              Student will write the answer
              inside a large text editor.

            </p>

          </div>

        )}

        {/* Explanation */}

        {question.explanation && (

          <div className="explanation-box">

            <h3>

              Explanation

            </h3>

            <p>

              {question.explanation}

            </p>

          </div>

        )}

      </div>

    </div>

  );

}