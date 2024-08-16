import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/index.css';
import Login from './components/login';
import Signup from './components/signup';
import Homepage from './components/homepage';
import SignupJobseeker from './components/signup_jobseeker'; 
import SignupJobseeker2 from './components/signup_jobseeker2'; 
import SignupJobseeker3 from './components/signup_jobseeker3'; 
// import SignupEmployer from './components/signup_employer';   

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/signup_jobseeker" element={<SignupJobseeker />} /> 
        <Route path="/signup_jobseeker2" element={<SignupJobseeker2 />} />
        <Route path="/signup_jobseeker3" element={<SignupJobseeker3 />} />
        {/* <Route path="/signup_employer" element={<SignupEmployer />} />  */}
      </Routes>
    </Router>
  </React.StrictMode>
);
