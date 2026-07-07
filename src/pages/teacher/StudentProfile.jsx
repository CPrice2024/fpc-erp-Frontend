import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  User,
  GraduationCap,
  Phone,
  Mail,
  Users,
} from "lucide-react";

import {
  getStudentProfile,
} from "../../api/teacherApi";

import "./StudentProfile.css";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function StudentProfile() {

  const { id } = useParams();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchStudent();

  }, []);

  const fetchStudent = async () => {

    try {

      const res =
        await getStudentProfile(id);

      setData(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading)
    return (
    <div className="teacher-course-page">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading student profile...</p>
      </div>
    </div>
  );

  if (!data)
    return <h2>No Student Found</h2>;

  const student = data.student;

  return (

    <div className="profile-page">

      <div className="profile-card">

        <img
          src={`${API_URL}${student.photo}`}
          alt=""
          className="profile-photo"
        />

        <div>

          <h1>

            {student.firstName}
            {" "}
            {student.fatherName}

          </h1>

          <p>

            {student.studentId}

          </p>

        </div>

      </div>

      <div className="info-grid">

        <div className="info-box">

          <GraduationCap/>

          <div>

            <span>Department</span>

            <strong>

              {student.department.name}

            </strong>

          </div>

        </div>

        <div className="info-box">

          <User/>

          <div>

            <span>Level</span>

            <strong>

              {student.level}

            </strong>

          </div>

        </div>

        <div className="info-box">

          <GraduationCap/>

          <div>

            <span>Semester</span>

            <strong>

              {student.semester}

            </strong>

          </div>

        </div>

        <div className="info-box">

          <Mail/>

          <div>

            <span>Email</span>

            <strong>

              {student.email}

            </strong>

          </div>

        </div>

        <div className="info-box">

          <Phone/>

          <div>

            <span>Phone</span>

            <strong>

              {student.phone}

            </strong>

          </div>

        </div>

        <div className="info-box">

          <Users/>

          <div>

            <span>Guardian</span>

            <strong>

              {student.guardianName}

            </strong>

          </div>

        </div>

      </div>

    </div>

  );

}