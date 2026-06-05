import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Trash2,
} from "lucide-react";

import "./Teachers.css";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();


  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/department-teachers");
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to load teachers");
    }
  };

  const createTeacher = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      return alert("Please fill all fields");
    }

    try {
      const res = await api.post(
        "/department-teachers",
        form
      );

      setCredentials(
        res.data?.loginCredentials || null
      );

      setForm({
        name: "",
        email: "",
      });

      setShowModal(false);

      fetchTeachers();
    } catch (error) {
      console.error("Create teacher error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create teacher"
      );
    }
  };
  const filteredTeachers = teachers.filter(
  (teacher) =>
    teacher.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    teacher.email
      .toLowerCase()
      .includes(search.toLowerCase())
);

  const deleteTeacher = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/department-teachers/${id}`
      );

      fetchTeachers();
    } catch (error) {
      console.error("Delete teacher error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete teacher"
      );
    }
  };

  return (
    <>
      <div className="teacher-page">

  <div className="teacher-top">

    <div>
      <h1>Department Teachers</h1>
      <p>
        Manage teachers assigned
        to your department
      </p>
    </div>

<button
  className="add-btn"
  onClick={() => navigate("/department-head/create-teacher")}
>
  <Plus size={18} />
  Add Teacher
</button>

  </div>

  <div className="stats-grid">

    <div className="stat-card">
      <h2>{teachers.length}</h2>
      <p>Total Teachers</p>
    </div>

    <div className="stat-card">
      <h2>
        {
          teachers.filter(
            (t) => t.status === "active"
          ).length
        }
      </h2>
      <p>Active Teachers</p>
    </div>

  </div>

  {credentials && (
    <div className="credential-box">

      <h3>
        Login Credentials
      </h3>

      <div className="credential-row">
        <span>Email</span>
        <strong>
          {credentials.email}
        </strong>
      </div>

      <div className="credential-row">
        <span>Password</span>
        <strong>
          {credentials.password}
        </strong>
      </div>

      <small>
        Save these credentials.
        Password will not be shown again.
      </small>

    </div>
  )}

  <div className="table-card">

    <div className="table-header">

      <input
        type="text"
        placeholder="Search teacher..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

    </div>

    <table>

      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>

        {filteredTeachers.length > 0 ? (

          filteredTeachers.map(
            (teacher) => (
              <tr key={teacher._id}>
                <td>
                  {teacher.name}
                </td>

                <td>
                  {teacher.email}
                </td>

                <td>
                  <span className="dept-badge">
                    {teacher.department
                      ?.name || "N/A"}
                  </span>
                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteTeacher(
                        teacher._id
                      )
                    }
                  >
                    <Trash2 size={18} />
                  </button>

                </td>
              </tr>
            )
          )

        ) : (

          <tr>
            <td
              colSpan="4"
              className="empty-row"
            >
              No teachers found
            </td>
          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>

      {showModal && (
        <div
          className="modal"
          onClick={() =>
            setShowModal(false)
          }
        >
          <div
            className="modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h3>Add Teacher</h3>

            <input
              type="text"
              placeholder="Teacher Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={createTeacher}
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}