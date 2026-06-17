import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../api/axios";

export default function EditStudent() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [departments,
    setDepartments] =
    useState([]);

  const [formData,
    setFormData] =
    useState({
      firstName: "",
      fatherName: "",
      grandfatherName: "",
      gender: "",
      phone: "",
      email: "",
      department: "",
      level: "",
      status: "active",
      guardianName: "",
      guardianPhone: "",
      relationship: "",
      region: "",
      city: "",
      address: "",
    });

  useEffect(() => {
    fetchStudent();
    fetchDepartments();
  }, []);

  const fetchStudent =
    async () => {
      try {

        const { data } =
          await api.get(
            `/registrars/students/${id}`
          );

        setFormData({
          firstName:
            data.firstName || "",
          fatherName:
            data.fatherName || "",
          grandfatherName:
            data.grandfatherName || "",
          gender:
            data.gender || "",
          phone:
            data.phone || "",
          email:
            data.email || "",
          department:
            data.department?._id ||
            data.department ||
            "",
          level:
            data.level || "",
          status:
            data.status || "",
          guardianName:
            data.guardianName ||
            "",
          guardianPhone:
            data.guardianPhone ||
            "",
          relationship:
            data.relationship ||
            "",
          region:
            data.region || "",
          city:
            data.city || "",
          address:
            data.address || "",
        });

      } catch (error) {
        console.error(error);
      }
    };

  const fetchDepartments =
    async () => {
      try {

        const { data } =
          await api.get(
            "/registrars/departments"
          );

        setDepartments(data);

      } catch (error) {
        console.error(error);
      }
    };

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await api.put(
          `/registrars/students/${id}`,
          formData
        );

        alert(
          "Student updated successfully"
        );

        navigate(
          "/registrar/records"
        );

      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="page-container">

      <h1>
        Edit Student
      </h1>

      <form
        onSubmit={handleSubmit}
      >

        <input
          name="firstName"
          value={
            formData.firstName
          }
          onChange={
            handleChange
          }
          placeholder="First Name"
        />

        <input
          name="fatherName"
          value={
            formData.fatherName
          }
          onChange={
            handleChange
          }
          placeholder="Father Name"
        />

        <input
          name="grandfatherName"
          value={
            formData.grandfatherName
          }
          onChange={
            handleChange
          }
          placeholder="Grandfather Name"
        />

        <select
          name="gender"
          value={
            formData.gender
          }
          onChange={
            handleChange
          }
        >
          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>
        </select>

        <input
          name="phone"
          value={
            formData.phone
          }
          onChange={
            handleChange
          }
          placeholder="Phone"
        />

        <input
          name="email"
          value={
            formData.email
          }
          onChange={
            handleChange
          }
          placeholder="Email"
        />

        <select
          name="department"
          value={
            formData.department
          }
          onChange={
            handleChange
          }
        >
          <option value="">
            Select Department
          </option>

          {departments.map(
            (dept) => (
              <option
                key={dept._id}
                value={dept._id}
              >
                {dept.name}
              </option>
            )
          )}
        </select>

        <input
          name="level"
          value={
            formData.level
          }
          onChange={
            handleChange
          }
          placeholder="Level"
        />

        <input
          name="guardianName"
          value={
            formData.guardianName
          }
          onChange={
            handleChange
          }
          placeholder="Guardian Name"
        />

        <input
          name="guardianPhone"
          value={
            formData.guardianPhone
          }
          onChange={
            handleChange
          }
          placeholder="Guardian Phone"
        />

        <input
          name="relationship"
          value={
            formData.relationship
          }
          onChange={
            handleChange
          }
          placeholder="Relationship"
        />

        <input
          name="region"
          value={
            formData.region
          }
          onChange={
            handleChange
          }
          placeholder="Region"
        />

        <input
          name="city"
          value={
            formData.city
          }
          onChange={
            handleChange
          }
          placeholder="City"
        />

        <textarea
          name="address"
          value={
            formData.address
          }
          onChange={
            handleChange
          }
          placeholder="Address"
        />

        <select
          name="status"
          value={
            formData.status
          }
          onChange={
            handleChange
          }
        >
          <option value="active">
            Active
          </option>

          <option value="graduated">
            Graduated
          </option>

          <option value="suspended">
            Suspended
          </option>

          <option value="withdrawn">
            Withdrawn
          </option>
        </select>

        <button
          type="submit"
        >
          Update Student
        </button>

      </form>

    </div>
  );
}