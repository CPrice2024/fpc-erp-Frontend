import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import {
  getDepartments,
  deleteDepartment,
} from "../../api/collegeHeadApi";
import "./Departments.css";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();



  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterHead, setFilterHead] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Load departments
  useEffect(() => {
    fetchDepartments();
  }, []);

const fetchDepartments = async () => {
  console.log("🚀 FETCH STARTED");

  try {
    setLoading(true);

    console.log("📡 Calling API...");

    const response = await getDepartments();

    console.log("✅ API RESPONSE:", response);

    let departmentsData = [];

    if (Array.isArray(response.data)) {
      departmentsData = response.data;
    } else if (response.data?.departments) {
      departmentsData = response.data.departments;
    } else if (response.data?.departmentSummary) {
      departmentsData = response.data.departmentSummary;
    }

    console.log("📦 FINAL DATA:", departmentsData);

    setDepartments(departmentsData);

  } catch (error) {
    console.error("❌ API ERROR:", error);

    setDepartments([]);
  } finally {
    console.log("🏁 FINALLY EXECUTED");

    setLoading(false);
  }
};

 


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        await fetchDepartments();
        alert("Department deleted successfully!");
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Error deleting department");
      }
    }
  };

const filteredDepartments = departments.filter((dept) => {
  const matchesSearch =
    (dept?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    (dept?.code || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesFilter =
    !filterHead || dept?.code === filterHead;

  return matchesSearch && matchesFilter;
});

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Code", "Description"];
    const csvData = departments.map((dept) => [
  dept._id || "",
  dept.name || "",
  dept.code || "",
  dept.description || "",
]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "departments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getUniqueCodes = () => {
    return [...new Set(departments.map(dept => dept.code))];
  };

  return (
    <div className="departments-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage college departments and their information</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={exportToCSV}>
            <Download size={18} />
            Export
          </button>
          <button
  className="btn-primary"
  onClick={() =>
    navigate("/college-head/departments/create")
  }
>
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by department name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
        </button>

        {showFilters && (
          <div className="filters-panel">
            <select 
              value={filterHead}
              onChange={(e) => setFilterHead(e.target.value)}
              className="filter-select"
            >
              <option value="">All Codes</option>
              {getUniqueCodes().map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <button 
              className="clear-filters"
              onClick={() => {
                setFilterHead("");
                setSearchTerm("");
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Stats Summary */}
<div className="stats-summary">

  <div className="stat-item">
    <div className="stat-icon">
      <Building2 size={20} />
    </div>

    <div>
      <div className="stat-value">
        {departments.length}
      </div>

      <div className="stat-label">
        Departments
      </div>
    </div>
  </div>

  <div className="stat-item">
    <div className="stat-icon">
      <Users size={20} />
    </div>

    <div>
      <div className="stat-value">
        {departments.reduce(
          (sum, dept) =>
            sum + (dept.students || 0),
          0
        )}
      </div>

      <div className="stat-label">
        Students
      </div>
    </div>
  </div>

  <div className="stat-item">
    <div className="stat-icon">
      <Users size={20} />
    </div>

    <div>
      <div className="stat-value">
        {departments.reduce(
          (sum, dept) =>
            sum +
            (dept.teachers ||
              dept.faculty ||
              0),
          0
        )}
      </div>

      <div className="stat-label">
        Teachers
      </div>
    </div>
  </div>

  <div className="stat-item">
    <div className="stat-icon">
      <Mail size={20} />
    </div>

    <div>
      <div className="stat-value">
        {
          departments.filter(
            (d) => d.departmentHead
          ).length
        }
      </div>

      <div className="stat-label">
        Assigned Heads
      </div>
    </div>
  </div>

</div>

      {/* Departments Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading departments...</p>
          </div>
        ) : (
          <>
            <table className="departments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Code</th>
                  <th>Contact</th>
                  <th>Established</th>
                  <th>Students</th>
                  <th>Faculty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((dept) => (
                  <tr key={dept._id || dept.id}>
                    <td className="id-cell">{dept._id?.slice(-6)}</td>
                    <td className="dept-name-cell">
                      <div className="dept-name-wrapper">
                        <div className="dept-icon">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <div className="dept-name">
                            {dept.name}
                            </div>
                            </div>
                      </div>
                    </td>
                    <td>
                      <div className="code-badge">{dept.code}</div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div><Mail size={12} /> {dept.email}</div>
                        <div><Phone size={12} /> {dept.phone}</div>
                      </div>
                    </td>
                    <td>{dept.established}</td>
                    <td className="student-count">{(dept.students || 0).toLocaleString()}</td>
                    <td>{(dept.teachers || dept.faculty || 0).toLocaleString()}</td>
<td className="actions-cell">

  <button
    className="action-btn view"
    onClick={() =>
      navigate(
        `/college-head/departments/view/${dept._id}`
      )
    }
    title="View"
  >
    <Eye size={16} />
  </button>

  <button
    className="action-btn edit"
    onClick={() =>
      navigate(
        `/college-head/departments/edit/${dept._id}`
      )
    }
    title="Edit"
  >
    <Edit2 size={16} />
  </button>

  <button
    className="action-btn delete"
    onClick={() =>
      handleDelete(dept._id)
    }
    title="Delete"
  >
    <Trash2 size={16} />
  </button>

</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {filteredDepartments.length === 0 && (
              <div className="empty-state">
                <Building2 size={48} />
                <h3>No Departments Available</h3>

<p>
Create your first department to begin
managing academic units.
</p>

<button
  className="btn-primary"
  onClick={() =>
    navigate(
      "/college-head/departments/create"
    )
  }
>
  <Plus size={16} />
  Create Department
</button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default Departments;