
import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Shield,
  Edit,
  CheckCircle,
} from "lucide-react";

export default function AdvancedDepartmentHeadDashboard() {
  const department = "Computer Science";

  const [teachers, setTeachers] = useState([
    {
      id: "T001",
      name: "Dr. Abebe",
      email: "abebe@cs.com",
      role: "Senior",
      status: "active",
      permissions: {
        attendance: true,
        students: false,
        reports: true,
      },
    },
    {
      id: "T002",
      name: "Tigist",
      email: "tigist@cs.com",
      role: "Assistant",
      status: "inactive",
      permissions: {
        attendance: true,
        students: true,
        reports: false,
      },
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Assistant",
  });

  // 🔍 Filter
  const filtered = teachers.filter((t) => {
    return (
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === "all" || t.status === filterStatus)
    );
  });

  // ➕ Add Teacher
  const addTeacher = () => {
    const newT = {
      id: "T" + (teachers.length + 1).toString().padStart(3, "0"),
      ...form,
      status: "active",
      permissions: {
        attendance: true,
        students: false,
        reports: false,
      },
    };
    setTeachers([...teachers, newT]);
    setShowModal(false);
    setForm({ name: "", email: "", role: "Assistant" });
  };

  // 🔁 Toggle permission
  const togglePermission = (id, key) => {
    setTeachers(
      teachers.map((t) =>
        t.id === id
          ? {
              ...t,
              permissions: {
                ...t.permissions,
                [key]: !t.permissions[key],
              },
            }
          : t
      )
    );
  };

  // 🔁 Toggle status
  const toggleStatus = (id) => {
    setTeachers(
      teachers.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "active" ? "inactive" : "active" }
          : t
      )
    );
  };

  // ❌ Delete
  const deleteTeacher = (id) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  // ✅ Bulk Activate
  const bulkActivate = () => {
    setTeachers(
      teachers.map((t) =>
        selected.includes(t.id) ? { ...t, status: "active" } : t
      )
    );
    setSelected([]);
  };

  return (
        <div className="teacher-dashboard">

          {/* Header */}
          <div className="dashboard-header">
            <h1>{department} Department</h1>

            <button className="register-btn" onClick={() => setShowModal(true)}>
              <UserPlus size={16} /> Add Teacher
            </button>
          </div>

          {/* Filters */}
          <div className="card filter-bar">
            <div className="input-group">
              <Search size={16} />
              <input
                placeholder="Search teacher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button onClick={bulkActivate} className="filter-btn">
              Bulk Activate
            </button>
          </div>

          {/* Table */}
          <div className="card">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(t.id)}
                        onChange={() =>
                          setSelected((prev) =>
                            prev.includes(t.id)
                              ? prev.filter((i) => i !== t.id)
                              : [...prev, t.id]
                          )
                        }
                      />
                    </td>

                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.role}</td>

                    <td>
                      <span className={`status ${t.status}`}>
                        {t.status}
                      </span>
                    </td>

                    <td>
                      <div className="perm">
                        {["attendance", "students", "reports"].map((p) => (
                          <button
                            key={p}
                            onClick={() => togglePermission(t.id, p)}
                            className={t.permissions[p] ? "on" : "off"}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </td>

                    <td className="actions">
                      <button onClick={() => toggleStatus(t.id)}>
                        <Shield size={16} />
                      </button>

                      <button>
                        <Edit size={16} />
                      </button>

                      <button onClick={() => deleteTeacher(t.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Add Teacher</h3>

                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                >
                  <option>Senior</option>
                  <option>Assistant</option>
                  <option>Contract</option>
                </select>

                <button onClick={addTeacher} className="register-btn">
                  Save
                </button>

                <button onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        .filter-bar {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .teacher-table {
          width: 100%;
          border-collapse: collapse;
        }

        .teacher-table th,
        .teacher-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        .status.active {
          color: green;
        }

        .status.inactive {
          color: red;
        }

        .perm button {
          margin: 2px;
          padding: 4px 8px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }

        .on {
          background: #10b981;
          color: white;
        }

        .off {
          background: #ddd;
        }

        .actions button {
          margin-right: 5px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 300px;
        }
      `}</style>
    </div>
  );
}