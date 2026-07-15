import api from "./axios";

export const uploadBook = async (formData) => {
  const { data } = await api.post(
    "/books/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const getBooks = async (courseId) => {
  const { data } = await api.get(
    `/books/course/${courseId}`
  );

  return data;
};

export const deleteBook = async (id) => {
  const { data } = await api.delete(
    `/books/${id}`
  );

  return data;
};