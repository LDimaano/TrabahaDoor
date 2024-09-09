import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function Header() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user-info', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });


        if (response.ok) {
          const data = await response.json();
          setEmail(data.email);
        } else {
          console.error('Failed to fetch email:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };


    fetchEmail();
  }, []);


  return (
    <nav className="navbar navbar-expand-lg bg-transparent">
    <div className="container">
      <a className="navbar-brand d-flex align-items-center" href="#">
        <img
          src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`}
          alt="TrabahaDoor Logo"
          width="30"
          height="30"
          className="me-2"
        />
        <span className="fw-bold">TrabahaDoor</span>
      </a>
      <div className="navbar-text">
        Welcome, {email || 'Guest'}
      </div>
    </div>
  </nav>
  );
}


function SearchForm() {
  return (
    <section className="container my-4">
      <form className="row g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Job title or keyword"
            aria-label="Job title or keyword"
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" aria-label="Select Industry">
            <option value="">Select Industry</option>
            <option value="agriculture">Agriculture</option>
            <option value="tourism">Tourism</option>
            <option value="marketing">Marketing</option>
            <option value="business">Business</option>
            <option value="hr">Human Resource</option>
            <option value="healthcare">Healthcare</option>
            <option value="engineering">Engineering</option>
            <option value="technology">Technology</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>
    </section>
  );
}


function FilterSection() {
  const employmentTypes = ['Full-time', 'Part-Time', 'Remote', 'Internship', 'Contract'];
  const categories = ['Agriculture', 'Tourism', 'Marketing', 'Business', 'Human Resource', 'Healthcare', 'Engineering', 'Technology'];
  const salaryRanges = ['$700 - $1000', '$1000 - $1500', '$1500 - $2000', '$3000 or above'];


  return (
    <div className="col-md-3">
      <FilterGroup title="Type of Employment" items={employmentTypes} />
      <FilterGroup title="Categories" items={categories} />
      <FilterGroup title="Salary Range" items={salaryRanges} />
    </div>
  );
}


function FilterGroup({ title, items }) {
  return (
    <div className="mb-4">
      <h5>{title}</h5>
      {items.map((item, index) => (
        <div key={index} className="form-check">
          <input className="form-check-input" type="checkbox" id={`filter-${index}`} />
          <label className="form-check-label" htmlFor={`filter-${index}`}>
            {item}
          </label>
        </div>
      ))}
    </div>
  );
}


const jobListings = [
  {
    id: 1,
    title: 'Accounting Staff',
    company: 'ACE Hardware Phils., INC.',
    location: 'Abra, San Jose',
    type: 'Full-Time',
    category: 'Business',
    logo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9425037a463a3276bdd0dbe0bb7a97e94562d9cb4cf54c89ff3e657f8ba47003?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
    applicants: 5,
    capacity: 10
  },
  {
    id: 2,
    title: 'Customer Associate',
    company: 'LBC Express INC.',
    location: 'San Jose Batangas',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7e9a9c379bf2a5338cc9fde75045b1de52a97535c4bf64bfa94b37a227b37a57?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975',
    applicants: 4,
    capacity: 5
  },
];


function JobList() {
  return (
    <div className="col-md-9">
      <h2>All Jobs</h2>
      <ul className="list-group">
        {jobListings.map(job => (
          <JobListItem key={job.id} job={job} />
        ))}
      </ul>
    </div>
  );
}


function JobListItem({ job }) {
  const navigate = useNavigate();


  const handleApplyClick = () => {
    navigate('/jobdescription');
  };


  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex">
        <img
          src={job.logo}
          alt={`${job.company} logo`}
          width="50"
          height="50"
          className="me-3"
        />
        <div>
          <h5>{job.title}</h5>
          <p>{job.company} - {job.location}</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleApplyClick}>
        Apply
      </button>
    </li>
  );
}


function Pagination() {
  return (
    <nav className="d-flex justify-content-center my-4">
      <ul className="pagination">
        <li className="page-item">
          <a className="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {[1, 2, 3, 4, 5, '...', 33].map((page, index) => (
          <li key={index} className={`page-item ${page === 1 ? 'active' : ''}`}>
            <a className="page-link" href="#">{page}</a>
          </li>
        ))}
        <li className="page-item">
          <a className="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}


function HomeJobSeeker() {
  return (
    <div className="container">
      <Header />
      <main className="row mt-4">
        <SearchForm />
        <div className="d-flex">
          <FilterSection />
          <JobList />
        </div>
        <Pagination />
      </main>
    </div>
  );
}


export default HomeJobSeeker;
