import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import { useNavigate } from "react-router-dom";
import {
  Search,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export default function Courses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const courses = [
    {
      id: "C001",
      name: "Introduction to Programming",
      code: "CS101",
      teacher: "Dr. Abebe Kebede",
      credit: 3,
      semester: "1",
    },
    {
      id: "C002",
      name: "Data Structures",
      code: "CS201",
      teacher: "Prof. Tigist Haile",
      credit: 4,
      semester: "2",
    },
  ];
  

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Courses Management" />

        <div className="content-wrapper">
          <div className="teacher-dashboard">

            {/* Header */}
            <div className="dashboard-header">
              <div>
                <h1>Courses</h1>
                <p>Manage department courses</p>
              </div>

              <button
                className="register-btn"
                onClick={() => navigate("/department/courses/add")}
              >
                <PlusCircle size={18} /> Add Course
              </button>
            </div>

            {/* Search */}
            <div className="card">
              <div className="input-group">
                <Search size={18} />
                <input
                  placeholder="Search course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="card">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Teacher</th>
                    <th>Credit</th>
                    <th>Semester</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td>{c.code}</td>
                      <td>{c.name}</td>
                      <td>{c.teacher}</td>
                      <td>{c.credit}</td>
                      <td>{c.semester}</td>

                      <td>
                        <div className="action-btns">
                          <button onClick={() => navigate(`/department/courses/view/${c.id}`)}>
                            <Eye size={16} />
                          </button>

                          <button onClick={() => navigate(`/department/courses/edit/${c.id}`)}>
                            <Pencil size={16} />
                          </button>

                          <button>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}