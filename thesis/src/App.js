import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Login'; 
import FirebaseTest from './FirebaseTest';
import RegisterPage from './RegisterPage';
import RegisterDoc from './RegisterDoc';
import PatientPage from './indexPatient'; // Assuming you have your components in the same directory
import DoctorPage from './indexDoctor';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/test" element={<FirebaseTest />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerdoc" element={<RegisterDoc />} />
        <Route path="/indexPatient/:userId" element={<PatientPage/>} />
        <Route path="/indexDoctor/:userId" element={<DoctorPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;


