import React from 'react';
import Modal from '../common/Modal';
import NoteForm from '../NoteForm';

const NoteModal = ({ isOpen, onClose, onSubmit, noteToEdit, clearEdit }) => {
  const handleSubmit = async (note) => {
    await onSubmit(note);
    onClose();
  };

  const handleClose = () => {
    clearEdit();
    onClose();
  };

  return (
    <Modal isVisible={isOpen} onClose={handleClose} width="max-w-md w-full">
      <NoteForm onSubmit={handleSubmit} noteToEdit={noteToEdit} clearEdit={handleClose} />
    </Modal>
  );
};

export default NoteModal;