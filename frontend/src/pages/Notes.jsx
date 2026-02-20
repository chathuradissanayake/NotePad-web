import React, { useState, useEffect, useCallback, useMemo } from "react";
import NoteList from "../components/NoteList";
import NoteModal from "../components/NoteModal";
import AdminNoteList from "../components/admin-notes/AdminNoteList";
import AdminNoteModal from "../components/admin-notes/AdminNoteModal";
import { getNotes, createNote, updateNote, deleteNote } from "../api/notes";
import { getAllNotes as getAdminNotes, deleteAnyNote, updateAnyNote } from "../api/admin";

const Notes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // decode role once from token
  const isAdmin = useMemo(() => {
    try {
      if (!user?.token) return false;
      const payload = JSON.parse(atob(user.token.split(".")[1]));
      return payload?.role === "admin";
    } catch {
      return false;
    }
  }, [user?.token]);

  // admin mode persisted (only for admins)
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem("adminMode") === "true";
  });

  // sync adminMode to localStorage; reset if not admin
  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem("adminMode", String(isAdminMode));
    } else {
      localStorage.removeItem("adminMode");
    }
  }, [isAdmin, isAdminMode]);

  const toggleAdminMode = useCallback(() => {
    setIsAdminMode((prev) => {
      const next = !prev;
      if (!isAdmin) return false;
      return next;
    });
  }, [isAdmin]);

  // derive effective admin mode (non-admins are never in admin mode)
  const effectiveIsAdminMode = isAdmin && isAdminMode;

  const inAdminMode = effectiveIsAdminMode;

  // normalize API response to array
  const toArray = (data) => (Array.isArray(data) ? data : data?.notes ?? []);

  // fetch notes based on mode
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

  // get note id helper
  const noteId = (note) => note._id || note.id;

  // create or update
  const handleSave = useCallback(
    async (payload) => {
      try {
        if (editNote) {
          const id = noteId(editNote);
          inAdminMode ? await updateAnyNote(id, payload) : await updateNote(id, payload);
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

  // edit
  const handleEdit = useCallback((note) => {
    setEditNote(note);
    setIsModalOpen(true);
  }, []);

  // delete
  const handleDelete = useCallback(
    async (id) => {
      try {
        inAdminMode ? await deleteAnyNote(id) : await deleteNote(id);
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

  const logout = useCallback(() => {
    localStorage.clear();
    window.location.href = "/";
  }, []);

  return (
    <div
      className={`min-h-screen ${
        inAdminMode
          ? "bg-linear-to-br from-red-50 via-purple-50 to-purple-100"
          : "bg-linear-to-br from-cyan-50 to-sky-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 text-left">
              <h1 className={`text-3xl md:text-5xl font-bold bg-linear-to-r  bg-clip-text text-transparent mb-1 md:mb-2 ${inAdminMode ? "from-red-400 to-purple-400" : "from-cyan-400 to-sky-400"}`}>
                JustNotepad
              </h1>
              <p className="text-gray-600 font-light text-md">
                {inAdminMode ? "Admin Dashboard — All Notes" : "Your thoughts, organized beautifully"}
              </p>
            </div>

            <div className="flex items-center gap-4 ml-4">
              {/* Admin Toggle */}
              {isAdmin && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <span className="text-xs font-medium text-gray-600">User</span>
                  <button
                    onClick={toggleAdminMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAdminMode ? "bg-red-400" : "bg-gray-300"}`}
                    aria-label="Toggle admin mode"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAdminMode ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-xs font-medium text-red-400">Admin</span>
                </div>
              )}

              {/* Profile */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 hover:border-red-500 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 shrink-0"
                    aria-label="Profile menu"
                  >
                    <img
                      src={user.picture || `https://ui-avatars.com/api/?name=${user.name}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                        <div className="p-4 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500 mt-1 break-all">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
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
        </header>

        {/* Modal */}
        {inAdminMode ? (
          <AdminNoteModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleSave}
            noteToEdit={editNote}
            onDelete={handleDelete}
            clearEdit={() => setEditNote(null)}
          />
        ) : (
          <NoteModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleSave}
            noteToEdit={editNote}
            onDelete={handleDelete}
          />
        )}

        {/* Notes */}
        {inAdminMode ? (
          <AdminNoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <NoteList notes={notes} onEdit={handleEdit} onCreate={() => setIsModalOpen(true)} />
        )}
      </div>
    </div>
  );
};

export default Notes;
