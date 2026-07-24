import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import logo from "../../assets/FPClogo.png";
import "./Loginstyle.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const demoAccounts = [
  {
    role: "College Head",
    email: "head@test.com",
    password: "123456",
  },
  {
    role: "Department Head",
    email: "comp@gmail.edu",
    password: "123456",
  },
  {
    role: "Registrar",
    email: "registrar@test.com",
    password: "123456",
  },
  {
    role: "Teacher",
    email: "john3@gmail.com",
    password: "TEA008@123",
  },
];

const fillCredentials = (account) => {
  setEmail(account.email);
  setPassword(account.password);
};

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const user = {
        _id: res.data.user?._id,
        name: res.data.user?.name,
        email: res.data.user?.email,
        role: res.data.user?.role,
      };

      login(user, res.data.token);

      const routes = {
        college_head: "/college-head",
        department_head: "/department-head",
        registrar: "/registrar",
        teacher: "/teacher",
      };

      navigate(routes[user.role] || "/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>
      <div className="info-top-links">

    <Link to="/admissions">
      Admissions
    </Link>

    <Link to="/academics">
      Academics
    </Link>

    <Link to="/news">
      News
    </Link>

    <Link to="/contact">
      Contact
    </Link>

  </div>

      <div className="login-container">
        {/* Left Side */}
        
        <div className="login-info">

  {/* Quick Links */}

  

  <img
    src={logo}
    alt="College Logo"
    className="college-logoo"
  />

  <h1>Tesfa technical and vocational training college</h1>

  <p className="description">Our College Management System streamlines administrative tasks, enhances communication, and provides a centralized platform for managing student records, faculty information, and academic processes.
  </p>

  <div className="erp-features">
    <div>Student Management</div>
    <div>Academic Records</div>
    <div>Teacher Portal</div>
    <div>Department Management</div>
  </div>

</div>

        {/* Right Side */}
        <div className="login-card">
          <div className="card-headerr">
            <h2>Welcome Back, please sign in</h2>
          </div>

          <form onSubmit={submit}>
            {error && (
              <div className="error-message">{error}</div>
            )}

            <div className="input-groupp">
              <label>Email</label>

              <div className="input-box">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="input-groupp">
              <label>Password</label>

              <div className="input-box">
                <Lock size={18} />

                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="login-links">
              <Link to="/">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing In..."
                : "Sign In"}
              <ArrowRight size={18} />
            </button>
           <div className="quick-access">
  <h4>Quick Access</h4>

  <div className="quick-grid">
    {demoAccounts.map((account) => (
      <button
        key={account.role}
        type="button"
        className="quick-account"
        onClick={() =>
          fillCredentials(account)
        }
      >
        {account.role}
      </button>
    ))}
  </div>
</div>

          </form>
          <h3 className="footer-text">© 2026 Tesfa technical and vocational training college. All rights reserved.</h3>
      
          
        </div>
        </div>
    </div>
  );
}