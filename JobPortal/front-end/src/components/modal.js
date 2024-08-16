import React from 'react';
import '../css/modal.css';

function Modal({ isOpen, onClose, content }) {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="modalCloseButton" onClick={onClose}>&times;</button>
        <div className="modalScrollableContent">
          {content}
        </div>
      </div>
    </div>
  );
}

export default Modal;
