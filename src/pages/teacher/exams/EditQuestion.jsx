import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

import {
  getQuestion,
  updateQuestion,
} from "../../../api/examAPI";

import "../../../styles/exams/CreateQuestion.css";

export default function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    exam: "",

    questionText: "",

    questionType: "Multiple Choice",

    marks: 5,

    order: 1,

    explanation: "",

    image: "",

    isRequired: true,

    status: "Draft",

    correctAnswer: "",

    options: [],
  });

  const letters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
  ];

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
  try {
    const question = await getQuestion(id);

    console.log(question);

    setForm({
  exam: question.exam || "",
  questionText: question.questionText || "",
  questionType: question.questionType || "Multiple Choice",
  marks: question.marks || 5,
  order: question.order || 1,
  explanation: question.explanation || "",
  image: question.image || "",
  isRequired:
    question.isRequired ?? true,
  status: question.status || "Draft",
  correctAnswer:
    question.correctAnswer || "",
  options: question.options || [],
});

  } catch (err) {
    console.error(err);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const updateOption = (index, value) => {
    const list = [...form.options];

    list[index].text = value;

    setForm({
      ...form,
      options: list,
    });
  };

  const addOption = () => {
    if (form.options.length >= 8) return;

    setForm({
      ...form,
      options: [
        ...form.options,
        {
          optionId:
            letters[form.options.length],
          text: "",
        },
      ],
    });
  };

  const removeOption = (index) => {
    if (form.options.length <= 2) return;

    const list = form.options.filter(
      (_, i) => i !== index
    );

    setForm({
      ...form,
      options: list,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateQuestion(id, form);

      alert("Question updated successfully.");

      navigate(
        `/teacher/exams/${form.exam}/questions`
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to update question."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-question-page">

      <div className="page-header">

        <button
          onClick={() =>
            navigate(
              `/teacher/exams/${form.exam}/questions`
            )
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1>Edit Question</h1>

      </div>

      <form onSubmit={submit}>

        {/* Question */}

        <div className="card">

          <h2>Question Information</h2>

          <label>Question</label>

          <textarea
            rows={4}
            name="questionText"
            value={form.questionText}
            onChange={handleChange}
          />

          <div className="grid">

            <div>

              <label>Question Type</label>

              <select
                name="questionType"
                value={form.questionType}
                onChange={handleChange}
              >
                <option>
                  Multiple Choice
                </option>

                <option>
                  True / False
                </option>

                <option>
                  Short Answer
                </option>

                <option>
                  Essay
                </option>

              </select>

            </div>

            <div>

              <label>Marks</label>

              <input
                type="number"
                name="marks"
                value={form.marks}
                onChange={handleChange}
              />

            </div>

            <div>

              <label>Order</label>

              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

        {/* Multiple Choice */}

        {form.questionType ===
          "Multiple Choice" && (

          <div className="card">

            <div className="title-row">

              <h2>Options</h2>

              <button
                type="button"
                onClick={addOption}
              >
                <Plus size={16} />
                Add Option
              </button>

            </div>

            {form.options.map(
              (option, index) => (

                <div
                  key={index}
                  className="option-row"
                >

                  <input
                    type="radio"
                    checked={
                      form.correctAnswer ===
                      option.optionId
                    }
                    onChange={() =>
                      setForm({
                        ...form,
                        correctAnswer:
                          option.optionId,
                      })
                    }
                  />

                  <span>
                    {option.optionId}
                  </span>

                  <input
                    value={option.text}
                    onChange={(e) =>
                      updateOption(
                        index,
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeOption(index)
                    }
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              )
            )}

          </div>

        )}

        {/* True False */}

        {form.questionType ===
          "True / False" && (

          <div className="card">

            <h2>Correct Answer</h2>

            <select
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleChange}
            >

              <option value="True">
                True
              </option>

              <option value="False">
                False
              </option>

            </select>

          </div>

        )}

        {/* Short Answer */}

        {form.questionType ===
          "Short Answer" && (

          <div className="card">

            <h2>Correct Answer</h2>

            <input
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleChange}
            />

          </div>

        )}

        {/* Essay */}

        {form.questionType ===
          "Essay" && (

          <div className="card">

            <h2>Essay Question</h2>

            <p>
              Essay questions require manual grading.
            </p>

          </div>

        )}

        {/* Explanation */}

        <div className="card">

          <h2>Explanation</h2>

          <textarea
            rows={4}
            name="explanation"
            value={form.explanation}
            onChange={handleChange}
          />

        </div>

        {/* Required */}

        <div className="card">

          <label>

            <input
              type="checkbox"
              name="isRequired"
              checked={form.isRequired}
              onChange={handleChange}
            />

            Required Question

          </label>

        </div>

        {/* Buttons */}

        <div className="actions">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/teacher/exams/${form.exam}/questions`
              )
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
          >
            <Save size={18} />

            {loading
              ? "Updating..."
              : "Update Question"}
          </button>

        </div>

      </form>

    </div>
  );
}