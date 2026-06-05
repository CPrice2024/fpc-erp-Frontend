import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Teacher.css";

export default function MyClass() {

  const [courses, setCourses] =
    useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses =
    async () => {
      try {
        const res =
          await api.get(
            "/teachers/my-classes"
          );

        setCourses(res.data);

      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="page">
      <h1>My Classes</h1>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Course</th>
              <th>Level</th>
              <th>Department</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((c) => (
              <tr key={c._id}>
                <td>{c.courseCode}</td>
                <td>{c.courseName}</td>
                <td>{c.level}</td>
                <td>
                  {c.department?.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}