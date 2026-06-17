import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ViewStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const { data } =
        await api.get(
          `/students/${id}`
        );

      setStudent(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!student) {
    return (
      <h2>
        Student not found
      </h2>
    );
  }

  return (
    <div className="page-container">

      <h1>
        Student Profile
      </h1>

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>
          {student.firstName}{" "}
          {student.fatherName}{" "}
          {student.grandfatherName}
        </h2>

        <hr />

        <p>
          <strong>
            Student ID:
          </strong>{" "}
          {student.studentId}
        </p>

        <p>
          <strong>
            Gender:
          </strong>{" "}
          {student.gender}
        </p>

        <p>
          <strong>
            Department:
          </strong>{" "}
          {student.department?.name}
        </p>

        <p>
          <strong>
            Level:
          </strong>{" "}
          {student.level}
        </p>

        <p>
          <strong>
            Academic Year:
          </strong>{" "}
          {student.academicYear}
        </p>

        <p>
          <strong>
            Batch:
          </strong>{" "}
          {student.batch}
        </p>

        <p>
          <strong>
            Phone:
          </strong>{" "}
          {student.phone}
        </p>

        <p>
          <strong>
            Email:
          </strong>{" "}
          {student.email}
        </p>

        <p>
          <strong>
            Nationality:
          </strong>{" "}
          {student.nationality}
        </p>

        <p>
          <strong>
            Region:
          </strong>{" "}
          {student.region}
        </p>

        <p>
          <strong>
            City:
          </strong>{" "}
          {student.city}
        </p>

        <p>
          <strong>
            Address:
          </strong>{" "}
          {student.address}
        </p>

        <hr />

        <h3>
          Guardian Information
        </h3>

        <p>
          <strong>
            Guardian Name:
          </strong>{" "}
          {student.guardianName}
        </p>

        <p>
          <strong>
            Guardian Phone:
          </strong>{" "}
          {student.guardianPhone}
        </p>

        <p>
          <strong>
            Relationship:
          </strong>{" "}
          {student.relationship}
        </p>

        <hr />

        <p>
          <strong>
            Status:
          </strong>{" "}
          {student.status}
        </p>

        <p>
          <strong>
            Registered:
          </strong>{" "}
          {new Date(
            student.createdAt
          ).toLocaleDateString()}
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() =>
              navigate(
                `/registrar/students/edit/${student._id}`
              )
            }
          >
            Edit Student
          </button>

          <button
            onClick={() =>
              window.print()
            }
          >
            Print
          </button>

          <button
            onClick={() =>
              navigate(
                "/registrar/records"
              )
            }
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}