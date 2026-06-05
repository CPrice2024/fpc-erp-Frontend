
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import "./StudentRecords.css";

export default function StudentRecords() {
  const navigate = useNavigate();

  const [students, setStudents] =
    useState([]);

  const [filteredStudents,
    setFilteredStudents] =
    useState([]);

  const [departments,
    setDepartments] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [departmentFilter,
    setDepartmentFilter] =
    useState("");

  const [levelFilter,
    setLevelFilter] =
    useState("");

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [
    students,
    search,
    departmentFilter,
    levelFilter,
  ]);

  const fetchStudents =
    async () => {
      try {
        setLoading(true);

        const res =
          await api.get(
            "/registrars/students"
          );

        setStudents(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const fetchDepartments =
    async () => {
      try {
        const res =
          await api.get(
            "/registrars/departments"
          );

        setDepartments(res.data);
      } catch (error) {
        console.error(error);
      }
    };

  const filterStudents =
    () => {
      let data = [...students];

      if (search) {
        data = data.filter(
          (student) =>
            student.firstName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            student.studentId
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );
      }

      if (departmentFilter) {
        data = data.filter(
          (student) =>
            student.department?._id ===
            departmentFilter
        );
      }

      if (levelFilter) {
        data = data.filter(
          (student) =>
            student.level ===
            levelFilter
        );
      }

      setFilteredStudents(data);
    };

  const deleteStudent =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Delete this student?"
        );

      if (!confirmDelete) return;

      try {
        await api.delete(
          `/students/${id}`
        );

        fetchStudents();
      } catch (error) {
        console.error(error);
      }
    };

  return (
        <div className="records-page">

          {/* Header */}
          <div className="page-header">

            <div>
              <h1>
                Student Records
              </h1>

              <p>
                Manage all
                registered students
              </p>
            </div>

            <div className="header-actions">

              <button
                className="refresh-btn"
                onClick={
                  fetchStudents
                }
              >
                <RefreshCw
                  size={18}
                />
                Refresh
              </button>

              <button
                className="add-btn"
                onClick={() =>
                  navigate(
                    "/registrar/admission"
                  )
                }
              >
                <UserPlus
                  size={18}
                />
                Add Student
              </button>

            </div>

          </div>

          {/* Filters */}

          <div className="filters">

            <div className="search-box">
              <Search size={18} />

              <input
                placeholder="Search Student..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>

            <select
              value={
                departmentFilter
              }
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All Departments
              </option>

              {departments.map(
                (dept) => (
                  <option
                    key={dept._id}
                    value={
                      dept._id
                    }
                  >
                    {dept.name}
                  </option>
                )
              )}
            </select>

            <select
              value={levelFilter}
              onChange={(e) =>
                setLevelFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All Levels
              </option>

              <option>
                Level I
              </option>

              <option>
                Level II
              </option>

              <option>
                Level III
              </option>

              <option>
                Level IV
              </option>

              <option>
                Level V
              </option>
            </select>

          </div>

          {/* Table */}

          <div className="table-card">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Department</th>
                  <th>Level</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredStudents.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="8"
                    >
                      No Students
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(
                    (student) => (
                      <tr
                        key={
                          student._id
                        }
                      >
                        <td>
                          {
                            student.studentId
                          }
                        </td>

                        <td>
                          {
                            student.firstName
                          }{" "}
                          {
                            student.fatherName
                          }
                        </td>

                        <td>
                          {
                            student.gender
                          }
                        </td>

                        <td>
                          {student
                            .department
                            ?.name ||
                            "-"}
                        </td>

                        <td>
                          {
                            student.level
                          }
                        </td>

                        <td>
                          {
                            student.phone
                          }
                        </td>

                        <td>
                          <span className="active">
                            {
                              student.status
                            }
                          </span>
                        </td>

                        <td>

                          <button
                            className="view"
                            onClick={() =>
                              navigate(
                                `/registrar/student/${student._id}`
                              )
                            }
                          >
                            <Eye
                              size={
                                16
                              }
                            />
                          </button>

                          <button
                            className="edit"
                            onClick={() =>
                              navigate(
                                `/registrar/student/edit/${student._id}`
                              )
                            }
                          >
                            <Edit
                              size={
                                16
                              }
                            />
                          </button>

                          <button
                            className="delete"
                            onClick={() =>
                              deleteStudent(
                                student._id
                              )
                            }
                          >
                            <Trash2
                              size={
                                16
                              }
                            />
                          </button>

                        </td>
                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
  );
}