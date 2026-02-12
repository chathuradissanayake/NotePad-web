const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/notes';

// Get all notes
export const getNotes = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

// Get single note
export const getNote = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

// Create note
export const createNote = async (note) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  return res.json();
};

// Update note
export const updateNote = async (id, note) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  return res.json();
};

// Delete note
export const deleteNote = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return res.json();
};
