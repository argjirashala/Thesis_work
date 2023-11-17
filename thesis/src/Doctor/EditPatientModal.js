import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";

function EditPatientModal({ patient, onClose, onSave }) {
  const db = getFirestore();
  const storage = getStorage();
  const [uploadingFile, setUploadingFile] = useState(null);
  const [formData, setFormData] = useState({
    diagnosis: patient.diagnosis || "",
    therapy: patient.therapy || "",
    info: patient.info || "",
    fileURL: patient.fileURL || "",
  });

  const handleFileUpload = async (file) => {
    if (!file) {
      alert("Please select a file to upload first!");
      return;
    }

    const storageRef = ref(storage, 'files/' + patient.id + "/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // You can implement progress here
      },
      (error) => {
          console.error("File upload error:", error);
      },
      async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const appointmentRef = doc(db, "appointments", patient.id);
          await setDoc(appointmentRef, { fileURL: downloadURL }, { merge: true });
          setFormData(prevFormData => ({ ...prevFormData, fileURL: downloadURL }));
          setUploadingFile(null);
      }
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingFile(file);
    } else {
      alert("Failed to select file. Please try again!");
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Save other form data excluding the file
    const {...otherFormData } = formData;
    onSave(otherFormData);
    onClose();
  };

  return (
    <div className="modal">
      <button className="close-btn" onClick={onClose}>&times;</button>
      <h3>Edit Patient</h3>
      <form>
    <div className="form-row">
      <label>Diagnosis</label>
      <input className='input-detail'
        type="text"
        name="diagnosis"
        value={formData.diagnosis}
        onChange={handleChange}
      />
    </div>
    <div className="form-row">
      <label>Therapy</label>
      <input className='input-detail'
        type="text"
        name="therapy"
        value={formData.therapy}
        onChange={handleChange}
      />
    </div>
    <div className="form-row">
      <label>Link for extra information</label>
      <input className='input-detail'
        type="text"
        name="therapy"
        value={formData.info}
        onChange={handleChange}
      />
    </div>
    <div className="form-row"><br></br><br></br></div>
    <div className="form-row">
      <label>File</label>
      <input type="file" onChange={handleFileChange} />
    </div>
    <div className="form-row">
      <button className='detail-button' type="button" onClick={() => handleFileUpload(uploadingFile)}>Upload File</button>
    </div>
    <div className="form-row">
      <button className='detail-button' type="button" onClick={handleSave}>Save</button>
    </div>
  </form>
    </div>
  );
}

export default EditPatientModal;
