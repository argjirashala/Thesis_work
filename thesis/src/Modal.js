import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <p>Diagnosis: {appointment.diagnosis}</p>
        <p>Therapy: {appointment.therapy}</p>
        {appointment.fileURL && (
          <a href={appointment.fileURL} download>Download File</a>
        )}
      </div>
    </div>
  );
}

export default Modal;
