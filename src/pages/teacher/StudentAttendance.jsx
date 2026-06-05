import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Teacher.css";

export default function Attendance() {

  const [students, setStudents] =
    useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents =
    async () => {
      const res =
        await api.get(
          "/teachers/attendance-students"
        );

      setStudents(res.data);
    };

  const submitAttendance =
    async () => {

      const records =
        students.map((s) => ({
          student: s._id,
          teacher:
            localStorage.getItem(
              "userId"
            ),
          status:
            s.status || "Present",
        }));

      await api.post(
        "/teachers/attendance",
        { records }
      );

      alert(
        "Attendance Saved"
      );
    };

  return (
    <div className="page">
      <h1>Attendance</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.studentId}</td>

              <td>
                {s.firstName}
              </td>

              <td>
                <select
                  onChange={(e) => {
                    s.status =
                      e.target.value;
                  }}
                >
                  <option>
                    Present
                  </option>

                  <option>
                    Absent
                  </option>

                  <option>
                    Late
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={submitAttendance}
      >
        Save Attendance
      </button>
    </div>
  );
}