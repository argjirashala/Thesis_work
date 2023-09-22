import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Login'; 
import FirebaseTest from './FirebaseTest';
import RegisterPage from './RegisterPage';
import RegisterDoc from './RegisterDoc';
import PatientPage from './indexPatient';
import DoctorPage from './indexDoctor';
import AdminPage from './indexAdmin';
import EditDoctor from './EditDoctor';
import EditPatient from './EditPatient';
import Logout from './Logout';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/test" element={<FirebaseTest />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerdoc" element={<RegisterDoc />} />
        <Route path="/indexPatient/:userId" element={<PatientPage/>} />
        <Route path="/indexDoctor/:userId" element={<DoctorPage/>}/>
        <Route path="/indexAdmin" element={<AdminPage/>}/>
        <Route path="/EditDoctor/:id" element={<EditDoctor/>}/>
        <Route path='/EditPatient/:id' element={<EditPatient/>}/>
      </Routes>
    </Router>
  );
}

export default App;


