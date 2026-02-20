import { authHeaders } from "./notes";

const API_URL = import.meta.env.VITE_API_ADMIN_URL || "/api/admin";

const handleRes = async (res) => {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Admin API error");
  }
  return res.json().catch(() => ({}));
};

export const getAllNotes = async (params = "") => {
  const res = await fetch(`${API_URL}/notes${params ? `?${params}` : ""}`, {
    headers: authHeaders(),
  });
  return handleRes(res);
};

export const deleteAnyNote = async (id) => {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleRes(res);
};

export const updateAnyNote = async (id, body) => {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleRes(res);
};

export const getAllUsers = async () => {
  const res = await fetch(`${API_URL}/users`, {
    headers: authHeaders(),
  });
  return handleRes(res);
};

export const updateUserRole = async (userId, role) => {
  const res = await fetch(`${API_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ role }),
  });
  return handleRes(res);
};

export const deleteUser = async (userId) => {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleRes(res);
};