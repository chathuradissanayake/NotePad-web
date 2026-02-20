const API_URL = import.meta.env.VITE_API_URL || "/api/notes";

// helper to get headers with JWT
export const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get all notes
export const getNotes = async () => {
  const res = await fetch(API_URL, {
    headers: authHeaders(),
  });
  return res.json();
};

// Get single note
export const getNote = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: authHeaders(),
  });
  return res.json();
};

// Create note
export const createNote = async (note) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(note),
  });
  return res.json();
};

// Update note
export const updateNote = async (id, note) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(note),
  });
  return res.json();
};

// Delete note
export const deleteNote = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
};
