import React from 'react';
import './Modal.css';
import QRCode from 'qrcode.react';

const Modal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <p>Diagnosis: {appointment.diagnosis}</p>
        <p>Therapy: {appointment.therapy}</p>
        <p>For extra information scan the QR code below:</p>
        <QRCode value={`${appointment.info}`} />
        {appointment.fileURL && (
            <iframe className="iframe" src={appointment.fileURL}></iframe>
        )}
      </div>
    </div>
  );
}

export default Modal;
