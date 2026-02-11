import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';

const initialForm = { subject: '', body: '' };

const NoteModal = ({ isOpen, onClose, onSubmit, noteToEdit, clearEdit }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (noteToEdit) {
      setForm({
        subject: noteToEdit.subject ?? '',
        body: noteToEdit.body ?? '',
      });
    } else {
      setForm(initialForm);
    }
  }, [noteToEdit]);

  const handleClose = useCallback(() => {
    clearEdit?.();
    setForm(initialForm);
    onClose?.();
  }, [clearEdit, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const subject = form.subject.trim();
      const body = form.body.trim();
      if (!subject || !body) {
        return alert('Fill all fields');
      }
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

  const isDisabled = !form.subject.trim() || !form.body.trim();

  return (
    <Modal isVisible={isOpen} onClose={handleClose} width="max-w-2xl w-full">
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg shadow-2xl overflow-hidden">
        {/* Header with realistic notepad design */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4 flex items-center justify-between border-b-4 border-cyan-700">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h2 className="text-xl font-semibold text-white">
              {noteToEdit ? 'Edit Note' : 'New Note'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-cyan-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Subject input with underline style */}
          <div className="mb-6">
            <input
              name="subject"
              type="text"
              autoFocus
              placeholder="Title..."
              className="w-full text-2xl font-bold bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 pb-2 border-b-2 border-cyan-300 focus:border-cyan-500 transition-colors"
              value={form.subject}
              onChange={handleChange}
              aria-label="subject"
            />
          </div>

          {/* Body textarea with lined paper effect */}
          <div className="relative">
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 35px, #06b6d4 35px, #06b6d4 36px)',
                opacity: 0.1
              }}
            />
            <textarea
              name="body"
              placeholder="Start writing your note..."
              className="w-full h-64 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 resize-none font-mono text-base leading-9 relative z-10"
              value={form.body}
              onChange={handleChange}
              aria-label="body"
              style={{ lineHeight: '36px' }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t-2 border-cyan-200">
            <button
              type="submit"
              disabled={isDisabled}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                isDisabled 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {noteToEdit ? '✓ Update Note' : '+ Add Note'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

NoteModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  noteToEdit: PropTypes.object,
  clearEdit: PropTypes.func,
};

NoteModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  noteToEdit: null,
  clearEdit: () => {},
};

export default NoteModal;