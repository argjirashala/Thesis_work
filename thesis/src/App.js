//import logo from './logo.svg';


// function App() {
//   return (
//     // <div className="App">
//     //   <header className="App-header">
//     //    {/* <img src={logo} className="App-logo" alt="logo" /> */}
//     //     <p>
//     //       Welcome to thesis project!
//     //     </p>
//     //     {/* <a
//     //       className="App-link"
//     //       href="https://reactjs.org"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       Learn React
//     //     </a> */}
//     //   </header>
//     // </div>
//       <Router>
//         <Switch>
//           <Route path="/" exact component={LoginPage} />
//         </Switch>
//       </Router>
//   );
// }

//export default App;
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Login'; 
import FirebaseTest from './FirebaseTest';
import RegisterPage from './RegisterPage';
import RegisterDoc from './RegisterDoc'





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/test" element={<FirebaseTest />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerdoc" element={<RegisterDoc />} />
      </Routes>
    </Router>
  );
}

export default App;


