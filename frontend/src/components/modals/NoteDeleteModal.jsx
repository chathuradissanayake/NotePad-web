import React from "react";
import PropTypes from "prop-types";
import Modal from "../common/Modal";

const NoteDeleteModal = ({ isVisible, onClose, onConfirm, noteTitle }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose} width="w-96">
      <div className="text-left">
        <h3 className="text-lg font-semibold mb-2 text-red-600">Delete note</h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete{noteTitle ? ` "${noteTitle}"` : " this note"}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

NoteDeleteModal.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  noteTitle: PropTypes.string,
};

NoteDeleteModal.defaultProps = {
  isVisible: false,
  onClose: () => {},
  onConfirm: () => {},
  noteTitle: "",
};

export default NoteDeleteModal;