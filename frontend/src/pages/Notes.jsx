import React, { useState, useEffect } from "react";
import NoteList from "../components/NoteList";
import NoteModal from "../components/modals/NoteModal";
import { getNotes, createNote, updateNote, deleteNote } from "../api/notes";

const Notes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Fetch notes on component mount
  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchNotes();
    })();
  }, []);

  // Create or update note
  const handleAdd = async (note) => {
    try {
      if (editNote) {
        await updateNote(editNote._id, note);
      } else {
        await createNote(note);
      }
      setEditNote(null);
      setIsModalOpen(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  //Edit note
  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  // Delete note
  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 to-sky-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-12">
          
          {/* Header Container - Flexbox Layout */}
          <div className="flex items-center justify-between mb-4">
            
            {/* Title Section */}
            <div className="flex-1 text-left">
              <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent mb-1 md:mb-2">
                JustNotepad
              </h1>
              <p className="text-gray-600 font-light text-md">
                Your thoughts, organized beautifully
              </p>
            </div>

            {/*User Profile */}
            {user && (
              <div className="relative ml-4">
                {/* Profile Picture Button */}
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 hover:border-cyan-500 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan-500 flex-shrink-0"
                >
                  <img
                    src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-1 break-all">{user?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}

                {/* Click outside to close */}
                {isProfileMenuOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/*Modal */}
        <NoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAdd}
          noteToEdit={editNote}
          onDelete={handleDelete}
        />

        {/* Notes */}
        <NoteList
          notes={notes}
          onEdit={handleEdit}
          onCreate={() => setIsModalOpen(true)}
        />
      </div>
    </div>
  );
};

export default Notes;
