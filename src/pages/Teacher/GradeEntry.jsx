import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Teacher.css";

export default function GradeEntry() {

  const [students, setStudents] =
    useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents =
    async () => {
      const res =
        await api.get(
          "/grades/students"
        );

      setStudents(res.data);
    };

  const saveGrades =
    async () => {

      await api.post(
        "/grades/save",
        students
      );

      alert(
        "Grades Saved"
      );
    };

  const updateField =
    (index, field, value) => {

      const updated =
        [...students];

      updated[index][field] =
        Number(value);

      setStudents(updated);
    };

  return (
    <div className="page">

      <h1>Grade Entry</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Assignment</th>
            <th>Quiz</th>
            <th>Mid</th>
            <th>Final</th>
          </tr>
        </thead>

        <tbody>
          {students.map(
            (student, index) => (
              <tr key={student._id}>
                <td>
                  {student.studentId}
                </td>

                <td>
                  {student.firstName}
                </td>

                <td>
                  <input
                    type="number"
                    onChange={(e) =>
                      updateField(
                        index,
                        "assignment",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    onChange={(e) =>
                      updateField(
                        index,
                        "quiz",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    onChange={(e) =>
                      updateField(
                        index,
                        "midExam",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    onChange={(e) =>
                      updateField(
                        index,
                        "finalExam",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <button onClick={saveGrades}>
        Save Grades
      </button>

    </div>
  );
}