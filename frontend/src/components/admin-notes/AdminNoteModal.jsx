import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

const initialForm = { subject: "", body: "" };

const AdminNoteModal = ({ isOpen, onClose, onSubmit, noteToEdit, clearEdit, onDelete }) => {
  const [form, setForm] = useState(initialForm);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (noteToEdit) {
      setForm({
        subject: noteToEdit.subject ?? "",
        body: noteToEdit.body ?? "",
      });
    } else {
      setForm(initialForm);
    }
  }, [noteToEdit]);

  // timestamp (show updated if newer else created)
  const created = noteToEdit?.createdAt ? new Date(noteToEdit.createdAt) : null;
  const updated = noteToEdit?.updatedAt ? new Date(noteToEdit.updatedAt) : null;
  const isUpdated = updated && created && updated.getTime() > created.getTime();
  const tsLabel = isUpdated ? "Updated" : "Created";
  const tsTime = (isUpdated ? updated : created)?.toLocaleString();

  const handleClose = useCallback(() => {
    clearEdit?.();
    setForm(initialForm);
    setShowMenu(false);
    onClose?.();
  }, [clearEdit, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) handleClose();
  }, [handleClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const subject = form.subject.trim();
      const body = form.body.trim();
      if (!subject || !body) return alert("Fill all fields");
      try {
        await onSubmit({ subject, body });
      } catch (err) {
        console.error(err);
      } finally {
        setForm(initialForm);
        onClose?.();
      }
    },
    [form, onSubmit, onClose]
  );

  const handleDelete = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete?.(noteToEdit._id);
      handleClose();
    }
  }, [noteToEdit, onDelete, handleClose]);

  const isDisabled = !form.subject.trim() || !form.body.trim();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full md:w-full lg:w-full xl:w-2/3 md:h-screen shadow-lg rounded-none md:rounded-lg">
        <div className="bg-linear-to-br from-cyan-50 to-teal-50 h-full rounded-none md:rounded-lg overflow-hidden flex flex-col">
          <div className="bg-linear-to-r from-cyan-400 to-sky-400 px-4 md:px-6 py-4 flex items-center justify-between border-b-4 border-sky-500">
            <div className="flex flex-col">
              <h2 className="text-lg md:text-xl font-semibold text-white">
                {noteToEdit ? "Admin: Edit Note" : "Admin: New Note"}
              </h2>
              {noteToEdit?.userEmail && (
                <p className="text-xs text-cyan-100 mt-1 truncate max-w-lg">
                  User: {noteToEdit.userEmail}
                </p>
              )}
              {tsTime && (
                <p className="text-xs text-cyan-100 mt-1">
                  {tsLabel}: {tsTime}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {noteToEdit && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-white hover:text-cyan-200 transition-colors p-1"
                    aria-label="more"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                        </svg>
                        Delete Note
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button onClick={handleClose} className="text-white hover:text-cyan-200 transition-colors" aria-label="close">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
            <div className="mb-4 md:mb-6">
              <input
                name="subject"
                type="text"
                autoFocus
                placeholder="Title..."
                className="w-full text-xl md:text-2xl font-bold bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 pb-2 border-b-2 border-cyan-300 focus:border-cyan-500 transition-colors"
                value={form.subject}
                onChange={handleChange}
                aria-label="subject"
              />
            </div>

            <div className="relative flex-1 overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "repeating-linear-gradient(transparent, transparent 35px, #06b6d4 35px, #06b6d4 36px)",
                  opacity: 0.1,
                }}
              />
              <textarea
                name="body"
                placeholder="Start writing your note..."
                className="w-full h-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 resize-none font-mono text-sm md:text-base leading-9 relative z-10"
                value={form.body}
                onChange={handleChange}
                aria-label="body"
                style={{ lineHeight: "36px" }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6 pt-4 border-t-2 border-cyan-200">
              <button
                type="submit"
                disabled={isDisabled}
                className={`flex-1 px-4 md:px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-linear-to-r from-cyan-400 to-sky-400 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {noteToEdit ? "✓ Update Note" : "+ Add Note"}
              </button>
              <button type="button" onClick={handleClose} className="px-4 md:px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all transform hover:scale-105">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AdminNoteModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  noteToEdit: PropTypes.object,
  clearEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

AdminNoteModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  noteToEdit: null,
  clearEdit: () => {},
  onDelete: () => {},
};

export default AdminNoteModal;