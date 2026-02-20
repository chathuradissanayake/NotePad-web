import React from "react";
import PropTypes from "prop-types";
import Modal from "../common/Modal";

const LogoutModal = ({ isVisible, onClose, onConfirm, userName }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose} width="w-96">
      <div className="text-left">
        <h3 className="text-lg font-semibold mb-2">Confirm logout</h3>
        {userName && <p className="text-sm text-gray-600 mb-4">Logout from {userName}?</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

LogoutModal.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  userName: PropTypes.string,
};

LogoutModal.defaultProps = {
  isVisible: false,
  onClose: () => {},
  onConfirm: () => {},
  userName: "",
};

export default LogoutModal;