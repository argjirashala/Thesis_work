//import logo from './logo.svg';
import './App.css';

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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

