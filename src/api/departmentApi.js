import api from "./axios";

export const getDepartments =
  () =>
    api.get("/departments");

export const createDepartment =
  (data) =>
    api.post(
      "/departments",
      data
    );

export const updateDepartment =
  (id, data) =>
    api.put(
      `/departments/${id}`,
      data
    );

export const deleteDepartment =
  (id) =>
    api.delete(
      `/departments/${id}`
    );

export const assignHead =
  (data) =>
    api.post(
      "/departments/assign-head",
      data
    );