import { useState } from "react";
import API from "../../api/axios";

function Register() {
  const [formData, setFormData] =
    useState({
      studentId: "",
      firstName: "",
      fatherName: "",
      department: "",
      batch: "",
      gender: "",
      phone: "",
      email: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      await API.post(
        "/students",
        formData
      );

      alert(
        "Student Registered Successfully"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="studentId"
        onChange={handleChange}
      />

      <input
        name="firstName"
        onChange={handleChange}
      />

      <button type="submit">
        Save
      </button>
    </form>
  );
}

export default Register;