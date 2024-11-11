import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';




import Login from './pages/Auth/login';
import Signup from './pages/Auth/signup';
import LandingPage from './pages/landing';
import ProfileCreation from './pages/Jobseeker/j_profilecreation';
import EmployerProfileCreation from './pages/Employer/e_profilecreation';
import JobPostingForm from './pages/Employer/jobposting'; 
import HomeJobseeker from './pages/Jobseeker/home_jobseeker';
import Jobdescription from './pages/Jobseeker/jobdescription';
import EmpJobdescription from './pages/Employer/emp_jobdescription';
import ApplicantList from './pages/Employer/applicantlist';
import Applicantdetails from './pages/Employer/appdetails';
import HomeEmployer from './pages/Employer/home_employer';
import MyProfile from './pages/Jobseeker/js_myprofile'; 
import ProfileEditForm from './pages/Jobseeker/js_profile_edit'; 
import JobseekerJobListing from './pages/Jobseeker/js_joblistings'; 
import Notifications from './pages/Jobseeker/js_notifications'; 
import EmpProfile from './pages/Employer/emp_profile'; 
import UpdateEmpProfile from './pages/Employer/e_profileupdate'; 
import ApplicantJoblisting from './pages/Employer/applicant_joblisting'; 
import ApplicantProfile from './pages/Employer/applicant_profile'; 

import EmpNotifications from './pages/Employer/emp_notifications';
import EmpMyProfile from './pages/Employer/emp_myprofile';
import WaitApproval from './pages/Employer/waitapproval';
import EmpTimeToFill from './pages/Employer/emp_timetofill';
import EmployerDashboard from './pages/Employer/empdashboard';

import DashboardAnalytics from './pages/Admin/admindashboard';
import AdminEmployer from './pages/Admin/admin_employers';
import AdminApplicants from './pages/Admin/admin_applicants';
import AdminJobs from './pages/Admin/admin_joblistings';
import AdminUsers from './pages/Admin/admin_users';
import AdminArchivedUsers from './pages/Admin/admin_archived_users';
import AdminUnapprovedEmp from './pages/Admin/admin_unapprovedemp';
import Adminupdateemp from './pages/Admin/admin_updateemp';
import Adminupdatejs from './pages/Admin/admin_updatejs';

import UserProfileJs from './pages/Admin/userjs_profile'; 
import UserProfileEmp from './pages/Admin/useremp_profile';
import SeeJobListing from './pages/Admin/seejoblisting';
import SeeApplicantList from './pages/Admin/seeapplicantlist'; 
import JsEmpProfile from './pages/Jobseeker/js_empprofile';
import JsEmpJobListings from './pages/Jobseeker/js_empjoblisting';
import UpdateEmpjoblist from './pages/Employer/jobpostingupdate';
import UploadDocuments from './pages/Employer/employerfiles';

import EmailVerification from './pages/Auth/verify';
import Unverified from './pages/Auth/unverified';


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
        <Route path="/emp_jobdescription/:jobId" element={<EmpJobdescription />} />
        <Route path="/js_myprofile" element={<MyProfile />} />
        <Route path="/userjs_profile/:user_id" element={<UserProfileJs />} />
        <Route path="/useremp_profile/:user_id" element={<UserProfileEmp />} />  
        <Route path="/js_joblistings" element={<JobseekerJobListing />} />
        <Route path="/applicantlist/:jobId" element={<ApplicantList />} />
        <Route path="/seeapplicantlist/:jobId" element={<SeeApplicantList />} />
        <Route path="/appdetails" element={<Applicantdetails />} /> 
        <Route path="/home_employer" element={<HomeEmployer />} /> 
        <Route path="/js_notifications" element={<Notifications />} /> 
        <Route path="/emp_profile" element={<EmpProfile />} /> 
        <Route path="/applicant_joblisting" element={<ApplicantJoblisting />} /> 
        <Route path="/applicant_profile/:user_id" element={<ApplicantProfile />} /> 
        <Route path="/admindashboard" element={<DashboardAnalytics />} /> 
        <Route path="/admin_employers" element={<AdminEmployer />} /> 
        <Route path="/admin_applicants" element={<AdminApplicants />} /> 
        <Route path="/admin_joblistings" element={<AdminJobs />} /> 
        <Route path="/seejoblisting/:jobId" element={<SeeJobListing/>} />
        <Route path="/admin_users" element={<AdminUsers />} /> 
        <Route path="/admin_archived_users" element={<AdminArchivedUsers />} /> 
        <Route path="/admin_unapprovedemp" element={<AdminUnapprovedEmp />} /> 
        <Route path="/emp_notifications" element={<EmpNotifications />} /> 
        <Route path="/emp_myprofile" element={<EmpMyProfile />} /> 
        <Route path="/waitapproval" element={<WaitApproval />} /> 
        <Route path="/emp_timetofill" element={<EmpTimeToFill />} /> 
        <Route path="/js_empprofile/:userId" element={<JsEmpProfile />} />
        <Route path="/js_empjoblisting/:userId" element={<JsEmpJobListings />} />
        <Route path="/js_profile_edit/:userId" element={<ProfileEditForm />} />
        <Route path="/e_profileupdate/:userId" element={<UpdateEmpProfile />} />
        <Route path="/jobpostingupdate/:job_id" element={<UpdateEmpjoblist />} />
        <Route path="/employerfiles" element={<UploadDocuments />} />
        <Route path="/empdashboard" element={<EmployerDashboard />} />
        <Route path="/admin_updateemp/:user_id" element={<Adminupdateemp />} />
        <Route path="/admin_updatejs/:user_id" element={<Adminupdatejs />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/unverified-account" element={<Unverified />} />
      </Routes>
    </Router>
  </React.StrictMode>
  
);
