import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Login/Login";
import RegisterPage from "./Register/RegisterPage";
import RegisterDoc from "./Register/RegisterDoc";
import PatientPage from "./Patient/indexPatient";
import DoctorPage from "./Doctor/indexDoctor";
import AdminPage from "./Admin/indexAdmin";
import EditDoctor from "./Admin/EditDoctor";
import EditPatient from "./Admin/EditPatient";
import Logout from "./Logout/Logout";
import UpcomingApp from "./Doctor/UpcomingApp";
import ListOfApp from "./Doctor/ListOfApp";
import SetAvailability from "./Doctor/SetAvailability";
import AllBookedApp from "./Patient/AllBookedApp";
import ListOfPat from "./Admin/ListOfPat";
import FinishedApp from "./Patient/FinishedAppointments";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication and Autherization */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerdoc" element={<RegisterDoc />} />

        {/* Admin */}
        <Route path="/indexAdmin" element={<AdminPage />} />
        <Route path="/patienttable" element={<ListOfPat />} />
        <Route path="/EditDoctor/:id" element={<EditDoctor />} />
        <Route path="/EditPatient/:id" element={<EditPatient />} />

        {/* Doctor */}
        <Route path="/indexDoctor/:userId" element={<DoctorPage />} />
        <Route path="/setavailability/:userId" element={<SetAvailability />} />
        <Route path="/upcomingappointments/:userId" element={<UpcomingApp />} />
        <Route path="/appointmentsTable/:userId" element={<ListOfApp />} />

        {/* Patient */}
        <Route path="/indexPatient/:userId" element={<PatientPage />} />
        <Route path="/bookedappointments/:userId" element={<AllBookedApp />} />
        <Route path="/finishedappointments/:userId" element={<FinishedApp />} />
      </Routes>
    </Router>
  );
}

export default App;
