import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isVisible, onClose, children, width }) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50" onClick={handleClose}>
      <div className={`relative bg-white p-6 rounded-lg shadow-lg ${width}`}>
        <button className="absolute top-2 right-2 text-gray-400" onClick={onClose}>
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;