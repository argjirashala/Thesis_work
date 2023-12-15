import React from "react";
import "./Modal.css";
import QRCode from "qrcode.react";

const Modal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen) return null;

  const downloadDetails = () => {
    if (!appointment) return;

    const content = `
      Diagnosis: ${appointment.diagnosis}
      Therapy: ${appointment.therapy}
      Extra Information: ${appointment.info}
    `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `appointment_details.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <p>Diagnosis: {appointment.diagnosis}</p>
        <p>Therapy: {appointment.therapy}</p>
        <p>For extra information scan the QR code below:</p>
        <QRCode className="qr-code" value={`${appointment.info}`} />
        {appointment.fileURL && (
          <iframe className="iframe" src={appointment.fileURL}></iframe>
        )}
        <a href={appointment.fileURL} download>
          Download File
        </a>
        &nbsp;&nbsp;
        <button className="confirm-button" onClick={downloadDetails}>
          Download Details
        </button>
      </div>
    </div>
  );
};

export default Modal;
