import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/index.css';
import Login from './pages/login';
import Signup from './pages/signup';
import LandingPage from './pages/landing';
import ProfileCreation from './components/j_profilecreation';
import EmployerProfileCreation from './components/e_profilecreation';
import JobPostingForm from './pages/jobposting';
import JobPostingPage from './pages/jobposting2';  
import HomeJobseeker from './pages/home_jobseeker';
import Jobdescription from './pages/jobdescription';
import ApplicantList from './pages/applicantlist';
import ApplicantProfile from './pages/appdetails';



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/j_profilecreation" element={<ProfileCreation/>} />
        <Route path="/e_profilecreation" element={<EmployerProfileCreation/>} />
        <Route path="/jobposting" element={<JobPostingForm/>} />
        <Route path="/home_jobseeker" element={<HomeJobseeker />} />
        <Route path="/jobposting2" element={<JobPostingPage/>} />
        <Route path="/jobdescription" element={<Jobdescription />} />
        <Route path="/applicantlist" element={<ApplicantList/>} />
        <Route path="/appdetails" element={<ApplicantProfile/>} /> 
      </Routes>
    </Router>
  </React.StrictMode>
);
