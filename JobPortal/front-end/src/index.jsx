import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/index.css';
import Login from './pages/Auth/login';
import Signup from './pages/Auth/signup';
import LandingPage from './pages/landing';
import ProfileCreation from './pages/Jobseeker/j_profilecreation';
import EmployerProfileCreation from './pages/Employer/e_profilecreation';
import JobPostingForm from './pages/Employer/jobposting'; 
import HomeJobseeker from './pages/Jobseeker/home_jobseeker';
import Jobdescription from './pages/Jobseeker/jobdescription';
import ApplicantList from './pages/Employer/applicantlist';
import ApplicantProfile from './pages/Employer/appdetails';
import HomeEmployer from './pages/Employer/home_employer';
import MyProfile from './pages/Jobseeker/js_myprofile'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/j_profilecreation" element={<ProfileCreation />} />
        <Route path="/e_profilecreation" element={<EmployerProfileCreation />} />
        <Route path="/jobposting" element={<JobPostingForm />} />
        <Route path="/home_jobseeker" element={<HomeJobseeker />} />
        <Route path="/jobdescription/:jobId" element={<Jobdescription />} />
        <Route path="/js_myprofile" element={<MyProfile />} />
        <Route path="/applicantlist" element={<ApplicantList />} />
        <Route path="/appdetails" element={<ApplicantProfile />} /> 
        <Route path="/home_employer" element={<HomeEmployer />} /> 
      </Routes>
    </Router>
  </React.StrictMode>
);