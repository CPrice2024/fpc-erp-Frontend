import { useAuth } from "./useAuth";

export const useRole = () => {
  const { user } = useAuth();

  const role = user?.role || "";

  return {
    role,

    isCollegeHead:
      role === "collegeHead",

    isDepartmentHead:
      role === "departmentHead",

    isRegistrar:
      role === "registrar",

    isTeacher:
      role === "teacher",

    hasRole: (...roles) =>
      roles.includes(role),
  };
};