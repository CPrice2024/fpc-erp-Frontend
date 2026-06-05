import { useEffect, useState } from "react";
import {
  getClassStudents,
  saveGrades,
} from "../../api/gradeApi";

export default function Grades() {
  const [classId, setClassId] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  const [loading, setLoading] = useState(false);

  // 📄 Load students
  const loadStudents = async () => {
    if (!classId) return;

    try {
      const res = await getClassStudents(classId);
      setStudents(res.data);

      const initial = {};
      res.data.forEach((s) => {
        initial[s._id] = "";
      });
      setMarks(initial);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [classId]);

  // ✏️ Handle mark change
  const handleChange = (id, value) => {
    setMarks((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 🧠 Calculate grade
const getGrade = (mark) => {
  if (mark >= 60) return "PASS";
  return "FAIL";
};

  // 💾 Save grades
 const handleSave = async () => {
  try {
    setLoading(true);

    const payload = students.map((s) => {
      const mark = Number(marks[s._id] || 0);

      return {
        studentId: s._id,
        classId,
        mark,
        status: mark >= 60 ? "PASS" : "FAIL",
      };
    });

    await saveGrades({ results: payload });

    alert("Grades saved successfully!");
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h2>Grades System</h2>

      {/* CLASS INPUT */}
      <input
        placeholder="Class ID"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
      />

      {/* TABLE */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mark</th>
            <th>Grade</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => {
            const mark = marks[s._id] || 0;

            return (
              <tr key={s._id}>
                <td>{s.name}</td>

                <td>
                  <input
                    type="number"
                    value={marks[s._id]}
                    onChange={(e) =>
                      handleChange(s._id, e.target.value)
                    }
                  />
                </td>

                <td>{getGrade(mark)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* SAVE */}
      <button onClick={handleSave} disabled={loading}>
        Save Grades
      </button>
    </div>
  );
}