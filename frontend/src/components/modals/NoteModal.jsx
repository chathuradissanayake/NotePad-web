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
    <Modal isVisible={isOpen} onClose={handleClose} width="max-w-md w-full ">
      <form onSubmit={handleSubmit} className="rounded mb-4">
        <input
          name="subject"
          type="text"
          autoFocus
          placeholder="Subject"
          className="border p-2 w-full mb-2 rounded"
          value={form.subject}
          onChange={handleChange}
          aria-label="subject"
        />
        <textarea
          name="body"
          placeholder="Note"
          className="border p-2 w-full mb-2 rounded"
          value={form.body}
          onChange={handleChange}
          aria-label="body"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isDisabled}
            className={`px-4 py-2 rounded text-white ${isDisabled ? 'bg-blue-300' : 'bg-blue-500'}`}
          >
            {noteToEdit ? 'Update Note' : 'Add Note'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
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