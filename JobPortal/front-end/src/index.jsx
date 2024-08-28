import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/index.css';
import Login from './components/login';
import Signup from './components/signup';
import Homepage from './components/homepage';
import JobSeekerRegistration from './components/j_registration';
import StudentRegistration from './components/js_registration';
import EmployerRegistration from './components/employer_registration';
import JobPostingForm from './components/jobposting';
import JobPostingDesc from './components/jobposting_desc';  
import HomeJobseeker from './components/home_jobseeker';
import Jobdescription from './components/Jobdescription';
import Joblisting from './components/joblisting';



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/j_registration" element={<JobSeekerRegistration />} />
        <Route path="/js_registration" element={<StudentRegistration />} />
        <Route path="/employer_registration" element={<EmployerRegistration />} />
        <Route path="/jobposting" element={<JobPostingForm/>} />
        <Route path="/home_jobseeker" element={<HomeJobseeker />} />
        <Route path="/jobposting_desc" element={<JobPostingDesc/>} />
        <Route path="/Jobdescription" element={<Jobdescription />} />
        <Route path="/joblisting" element={<Joblisting />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
