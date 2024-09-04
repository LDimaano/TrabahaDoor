import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/index.css';
import Login from './components/login';
import Signup from './components/signup';
import LandingPage from './components/landingpage';
import JobSeekerRegistration from './components/j_registration';
import ProfileCreation from './components/j_profilecreation';
import EmployerProfileCreation from './components/e_profilecreation';
import StudentProfileCreation from './components/s_profilecreation';
import StudentRegistration from './components/js_registration';
import EmployerRegistration from './components/employer_registration';
import JobPostingForm from './components/jobposting';
import JobPostingPage from './components/jobposting_desc';  
import HomeJobseeker from './components/home_jobseeker';
import Jobdescription from './components/jobdescription';
import Joblisting from './components/joblisting';
import ApplicantProfile from './components/applicantdetail';



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/j_registration" element={<JobSeekerRegistration />} />
        <Route path="/js_registration" element={<StudentRegistration />} />
        <Route path="/employer_registration" element={<EmployerRegistration />} />
        <Route path="/j_profilecreation" element={<ProfileCreation/>} />
        <Route path="/e_profilecreation" element={<EmployerProfileCreation/>} />
        <Route path="/s_profilecreation" element={<StudentProfileCreation/>} />
        <Route path="/jobposting" element={<JobPostingForm/>} />
        <Route path="/home_jobseeker" element={<HomeJobseeker />} />
        <Route path="/jobposting_desc" element={<JobPostingPage/>} />
        <Route path="/jobdescription" element={<Jobdescription />} />
        <Route path="/joblisting" element={<Joblisting />} />
        <Route path="/applicantdetail" element={<ApplicantProfile/>} />
      </Routes>
    </Router>
  </React.StrictMode>
);
