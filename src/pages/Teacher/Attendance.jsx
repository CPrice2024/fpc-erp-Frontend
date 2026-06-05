import { useEffect, useState } from "react";
import {
  getClassStudents,
  createAttendance,
} from "../../api/attendanceApi";

export default function Attendance() {
  const [classId, setClassId] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  // 📄 Load students of class
  const loadStudents = async () => {
    if (!classId) return;

    try {
      const res = await getClassStudents(classId);
      setStudents(res.data);

      // reset attendance state
      const initial = {};
      res.data.forEach((s) => {
        initial[s._id] = "present";
      });
      setAttendance(initial);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [classId]);

  // ✔ Toggle attendance
  const toggleStatus = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]:
        prev[id] === "present" ? "absent" : "present",
    }));
  };

  // 💾 Save attendance
  const handleSave = async () => {
    try {
      setLoading(true);

      await createAttendance({
        classId,
        records: Object.keys(attendance).map((id) => ({
          studentId: id,
          status: attendance[id],
        })),
      });

      alert("Attendance saved!");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Attendance System</h2>

      {/* CLASS SELECT */}
      <input
        placeholder="Enter Class ID"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
      />

      {/* STUDENT LIST */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>
                <button
                  onClick={() => toggleStatus(s._id)}
                  style={{
                    background:
                      attendance[s._id] === "present"
                        ? "green"
                        : "red",
                    color: "white",
                  }}
                >
                  {attendance[s._id]}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SAVE */}
      <button onClick={handleSave} disabled={loading}>
        Save Attendance
      </button>
    </div>
  );
}