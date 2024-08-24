import React, { useState } from 'react';
import '../css/employer_registration.css';
import { useNavigate } from 'react-router-dom';

const FormInput = ({ label, value, type = 'text', onChange, id, placeholder, ariaLabel }) => {
    return (
      <div className="inputWrapper">
        <label className="label" htmlFor={id}>{label}</label>
        <input
          className="input"
          type={type}
          value={value}
          onChange={onChange}
          id={id}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
      </div>
    );
  };

const FormRow = ({ children }) => {
    return <div className="formRow">{children}</div>;
  };

  function EmployerRegistration() {
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [location, setLocation] = useState('');
    const [dateFounded, setDateFounded] = useState('');
    const [description, setDescription] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    const navigate = useNavigate();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const formData = {
        companyName,
        industry,
        location,
        dateFounded,
        description,
        jobTitle,
      };
  
      try {
        const response = await fetch('http://localhost:5000/employer_registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        const result = await response.json();
        
        if (response.ok) {
          console.log('Form submitted successfully:', result);
          navigate('/'); // Or wherever you want to navigate
        } else {
          console.error('Error submitting form:', result.error);
        }
      } catch (error) {
        console.error('Network or server error:', error);
      }
    };

  return (
    <main className="r-container">
      <header className="r-header">
        <img 
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a041a0749592ac4adcd0d49d215ec305d8ef2b8bfa04e2e12bc81be88b68fe4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975"
          className="logo"
          alt="TrabahaDoor logo"
        />
        <div className="brandName">TrabahaDoor</div>
      </header>
      <h1 className="title">Hello there! Looking for new job opportunities?</h1>
      <p className="subtitle">Search for people, and job opportunities in your area</p>
      <form onSubmit={handleSubmit}>
        <FormRow>
          <div className="formGroup">
            <FormInput 
              label="Company Name*" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              id="Cname" 
              placeholder="Saint Anthony Montessori" 
              ariaLabel="Enter your first name"
            />
          </div>
          <div className="formGroup">
            <FormInput 
              label="Industry*" 
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              id="industry" 
              placeholder="Healthcare" 
              ariaLabel="Enter what type of Industry"
            />
          </div>
        </FormRow>
        <FormRow>
          <div className="formGroup">
            <FormInput 
              label="Location*" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              id="location" 
              placeholder="San Jose, Batangas" 
              ariaLabel="Enter your location"
            />
          </div>
          <div className="formGroup">
            <FormInput
              type="date"
              label="Date Founded" 
              value={dateFounded}
              onChange={(e) => setDateFounded(e.target.value)}
              id="datefounded"
              placeholder="09/08/2020"
              aria-label="Enter the date founded"
            />
         </div>
        </FormRow>
         <div className="textareaWrapper">
            <label htmlFor="description" className="label">Description*</label>
             <textarea
               id="description"
               className="textarea"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
             />
           </div>
           <br></br>
           <div className="formGroup">
            <label className="label" htmlFor="jobTitle">Job Titles *</label>
            <select 
              id="jobtitles" 
              className="select" 
              value={jobTitle} 
              onChange={(e) => setJobTitle(e.target.value)}
            >
              <option>Choose 1</option>
              {/* Add more options here if needed */}
            </select>
          </div>
        <button type="submit" className="submitButton">Next</button>
      </form>
    </main>
  );
};

export default EmployerRegistration;











// function EmployerRegistration() {
//   const [formData, setFormData] = useState({
//     companyName: 'Saint Anthony Montessori',
//     location: 'San Jose, Batangas',
//     industry: 'Health',
//     dateFounded: '09/08/2020',
//     description: '-',
//     jobTitles: 'Staff Nurse'
//   });

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [id]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <main className="employerRegistration">
//       <header className="header">
//         <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/74f28582fd4b42492e4a1d48e4d627c8f49d90424b66cd2715ca6afc04c850ec?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="TrabahaDoor Logo" className="logo" />
//         <div className="brandName">TrabahaDoor</div>
//       </header>
//       <h1 className="title">Hello there! Looking for qualified candidates?</h1>
//         <p className="subtitle">Search for potential employees and talents in your area</p>
//         <form className="formContainer" onSubmit={handleSubmit}>
//         <div className="formRow">
//   <div className="formColumn">
//     <div className="formGroup">
//       <div className="inputWrapper">
//         <label htmlFor="companyName" className="label">Company name*</label>
//         <input
//           type="text"
//           id="companyName"
//           className="input"
//           value={formData.companyName}
//           onChange={handleInputChange}
//           placeholder="Enter company name"
//         />
//       </div>
//       <div className="inputWrapper">
//         <label htmlFor="location" className="label">Location*</label>
//         <input
//           type="text"
//           id="location"
//           className="input"
//           value={formData.location}
//           onChange={handleInputChange}
//           placeholder="Enter location"
//         />
//       </div>
//     </div>
//   </div>
//   <div className="formColumn">
//     <div className="formGroup">
//       <div className="inputWrapper">
//         <label htmlFor="industry" className="label">Industry *</label>
//         <input
//           type="text"
//           id="industry"
//           className="input"
//           value={formData.industry}
//           onChange={handleInputChange}
//           placeholder="Enter industry"
//         />
//       </div>
//       <div className="inputWrapper">
//         <label htmlFor="dateFounded" className="label">Date founded *</label>
//         <div className="dropdown">
//           <input
//             type="text"
//             id="dateFounded"
//             className="dropdownPlaceholder"
//             value={formData.dateFounded}
//             onChange={handleInputChange}
//             placeholder="Select date"
//           />
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
//           <div className="textareaWrapper">
//             <label htmlFor="description" className="label">Description *</label>
//             <textarea
//               id="description"
//               className="textarea"
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Enter description"
//             />
//           </div>
//           <label htmlFor="jobTitles" className="jobTitlesLabel">Job titles*</label>
//           <input
//             type="text"
//             id="jobTitles"
//             className="jobTitlesInput"
//             value={formData.jobTitles}
//             onChange={handleInputChange}
//             placeholder="Enter job titles"
//           />
//           <button type="submit" className="submitButton">Next</button>
//         </form>
//     </main>
//   );
// }

// export default EmployerRegistration;
