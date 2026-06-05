import { useEffect, useState } from "react";
import API from "../../api/axios";

function AllStudents() {
  const [students, setStudents] =
    useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents =
    async () => {
      try {
        const { data } =
          await API.get(
            "/students"
          );

        setStudents(data);
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div>
      {students.map((student) => (
        <div key={student._id}>
          {student.firstName}
        </div>
      ))}
    </div>
  );
}

export default AllStudents;