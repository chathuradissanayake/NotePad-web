import React, { useState, useEffect, useCallback, useMemo } from "react";
import NoteList from "../components/NoteList";
import NoteModal from "../components/NoteModal";
import AdminNoteList from "../components/admin-notes/AdminNoteList";
import AdminNoteModal from "../components/admin-notes/AdminNoteModal";
import LogoutModal from "../components/modals/LogoutModal";
import { getNotes, createNote, updateNote, deleteNote } from "../api/notes";
import { getAllNotes as getAdminNotes, deleteAnyNote, updateAnyNote } from "../api/admin";

const useDebounced = (value, delay = 250) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const Notes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // search + debounce
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search);

  // admin email filter
  const [emailFilter, setEmailFilter] = useState("all");
  const [emailQuery, setEmailQuery] = useState("");

  // token / role
  const token = user?.token ?? null;
  const isAdmin = useMemo(() => {
    try {
      if (!token) return false;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.role === "admin";
    } catch {
      return false;
    }
  }, [token]);

  // admin mode persistence
  const [isAdminMode, setIsAdminMode] = useState(() => localStorage.getItem("adminMode") === "true");
  useEffect(() => {
    if (isAdmin) localStorage.setItem("adminMode", String(isAdminMode));
    else localStorage.removeItem("adminMode");
  }, [isAdmin, isAdminMode]);

  const toggleAdminMode = useCallback(() => {
    if (!isAdmin) return;
    setIsAdminMode((v) => !v);
  }, [isAdmin]);

  const inAdminMode = isAdmin && isAdminMode;

  // helpers
  const toArray = (data) => (Array.isArray(data) ? data : data?.notes ?? []);
  const noteId = (n) => n._id || n.id;

  // fetch notes (single, reusable)
  const fetchNotes = useCallback(async () => {
    try {
      const data = inAdminMode ? await getAdminNotes() : await getNotes();
      setNotes(toArray(data));
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setNotes([]);
    }
  }, [inAdminMode]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = inAdminMode ? await getAdminNotes() : await getNotes();
        if (!cancelled) setNotes(toArray(data));
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        if (!cancelled) setNotes([]);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [inAdminMode]);

  // create/update/delete handlers
  const handleSave = useCallback(
    async (payload) => {
      try {
        if (editNote) {
          const id = noteId(editNote);
          if (inAdminMode) await updateAnyNote(id, payload);
          else await updateNote(id, payload);
        } else {
          await createNote(payload);
        }
        setEditNote(null);
        setIsModalOpen(false);
        await fetchNotes();
      } catch (err) {
        console.error("Failed to save note:", err);
      }
    },
    [editNote, inAdminMode, fetchNotes]
  );

  const handleEdit = useCallback((note) => {
    setEditNote(note);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      try {
        if (inAdminMode) await deleteAnyNote(id);
        else await deleteNote(id);
        await fetchNotes();
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    },
    [inAdminMode, fetchNotes]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditNote(null);
  }, []);

  const performLogout = useCallback(() => {
    localStorage.clear();
    window.location.href = "/";
  }, []);

  // email options derived from current notes
  const emailOptions = useMemo(() => {
    return Array.from(new Set(notes.map((n) => n.userEmail).filter(Boolean))).sort();
  }, [notes]);

  // client-side filtering: subject/body/date + admin email filters
  const displayedNotes = useMemo(() => {
    if (!debouncedSearch && !emailQuery && emailFilter === "all") return notes;
    const q = (debouncedSearch || "").toLowerCase();
    const eq = (emailQuery || "").trim().toLowerCase();

    return notes.filter((n) => {
      if (inAdminMode) {
        if (emailFilter !== "all" && (n.userEmail || "").toLowerCase() !== emailFilter.toLowerCase()) return false;
        if (eq && !(n.userEmail || "").toLowerCase().includes(eq)) return false;
      }

      if (!q) return true;

      if (n.subject?.toLowerCase().includes(q)) return true;
      if (n.body?.toLowerCase().includes(q)) return true;

      const created = n.createdAt ? new Date(n.createdAt).toLocaleString() : "";
      const updated = n.updatedAt ? new Date(n.updatedAt).toLocaleString() : "";
      if (created.toLowerCase().includes(q) || updated.toLowerCase().includes(q)) return true;

      const createdIso = n.createdAt ? new Date(n.createdAt).toISOString().split("T")[0] : "";
      const updatedIso = n.updatedAt ? new Date(n.updatedAt).toISOString().split("T")[0] : "";
      if (createdIso.includes(q) || updatedIso.includes(q)) return true;

      return false;
    });
  }, [notes, debouncedSearch, inAdminMode, emailFilter, emailQuery]);

  return (
    <div
      className={`min-h-screen ${
        inAdminMode ? "bg-linear-to-br from-red-50 via-purple-50 to-purple-100" : "bg-linear-to-br from-cyan-50 to-sky-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-10">
          <div className="mb-4">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex-1 text-left">
                <h1
                  className={`text-3xl md:text-5xl font-bold bg-linear-to-r bg-clip-text text-transparent mb-1 md:mb-2 ${
                    inAdminMode ? "from-red-400 to-purple-400" : "from-cyan-400 to-sky-400"
                  }`}
                >
                  JustNotepad {isAdmin && <span className={`inline-block py-1 text-xs ${inAdminMode ? 'text-red-400' : 'text-cyan-400'} rounded-full`}>Adminqq</span>}
                </h1>
                <p className="text-gray-600 font-light text-md">{inAdminMode ? "Admin Dashboard | All Notes" : "Your thoughts, organized beautifully"}</p>
              </div>

              <div className="flex items-center gap-4 ml-4">
                {/* Desktop search */}
                <div className={`hidden sm:flex items-center bg-white rounded-lg border ${inAdminMode ? "border-red-200" : "border-cyan-200"} px-3 py-2 w-72`}>
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subject, body or date" className="w-full text-sm outline-none placeholder-gray-400" />
                  {search && (
                    <button onClick={() => setSearch("")} className="ml-2 text-gray-500 text-xs">
                      Clear
                    </button>
                  )}
                </div>

                {/* Admin email filter (desktop) */}
                {inAdminMode && (
                  <div className="hidden sm:flex items-center gap-2 ml-2">
                    <input type="text" value={emailQuery} onChange={(e) => setEmailQuery(e.target.value)} placeholder="Filter emails..." className="text-sm px-2 py-2 border border-red-200 bg-white rounded-md w-40 placeholder-gray-400" />
                    <select value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} className="text-sm px-2 py-2 text-gray-700 border border-red-200 rounded-md bg-white">
                      <option value="all">All users</option>
                      {emailOptions.map((em) => (
                        <option key={em} value={em}>
                          {em}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Profile picture */}
                {user && (
                  <div className="relative">
                    <button onClick={() => setIsProfileMenuOpen((p) => !p)} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 hover:border-red-500 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Profile menu">
                      <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>

                    {isProfileMenuOpen && (
                      <>
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                          <div className="p-4 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500 mt-1 break-all">{user.email}</p>

                            {isAdmin && (
                              <div className="mt-3 flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-xs text-gray-500">Admin mode</p>
                                  <p className="text-[11px] text-gray-400">View and manage all notes</p>
                                </div>
                                <button onClick={toggleAdminMode} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAdminMode ? "bg-red-400" : "bg-gray-300"}`} aria-label="Toggle admin mode">
                                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAdminMode ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                              </div>
                            )}
                          </div>

                          <button onClick={() => setShowLogoutModal(true)} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            Logout
                          </button>
                        </div>
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile search row (below title + picture) */}
            <div className="sm:hidden mt-3">
              <div className={`flex items-center bg-white rounded-lg border ${inAdminMode ? "border-red-200" : "border-cyan-200"} px-3 py-2 w-full`}>
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subject, body or date" className="w-full text-sm outline-none placeholder-gray-400" />
                {search && (
                  <button onClick={() => setSearch("")} className="ml-2 text-gray-500 text-xs">
                    Clear
                  </button>
                )}
              </div>

              {/* Mobile admin email filter */}
              {inAdminMode && (
                <div className="sm:hidden mt-3 flex gap-2">
                  <input type="text" value={emailQuery} onChange={(e) => setEmailQuery(e.target.value)} placeholder="Filter emails..." className="text-sm px-2 py-2 border border-red-200 bg-white rounded-md w-full placeholder-gray-400" />
                  <select value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} className="text-sm px-2 py-2 text-gray-700 border border-red-200 rounded-md bg-white">
                    <option value="all">All users</option>
                    {emailOptions.map((em) => (
                      <option key={em} value={em}>
                        {em}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Modal */}
        {inAdminMode ? (
          <AdminNoteModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSave} noteToEdit={editNote} onDelete={handleDelete} clearEdit={() => setEditNote(null)} />
        ) : (
          <NoteModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSave} noteToEdit={editNote} onDelete={handleDelete} />
        )}

        <LogoutModal
          isVisible={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={performLogout}
          userName={user?.name}
        />

        {/* Notes */}
        {inAdminMode ? (
          <AdminNoteList notes={displayedNotes} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <NoteList notes={displayedNotes} onEdit={handleEdit} onCreate={() => setIsModalOpen(true)} />
        )}
      </div>
    </div>
  );
};

export default Notes;
