import React from 'react';
import StepperItem from './stepperitem';
import 'bootstrap/dist/css/bootstrap.min.css';

const JobPostingStepper = () => {
  const steps = [
    { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6a42fd1310401124f065989747c4a4f9f75a4e05167b241e82d076d6bb0a9963?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", title: "Job Information", isActive: true },
    { imgSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/46c54760f1a99081a79cc0bf9bcef9fc0e5a10546bbbac656e7081a2d3814873?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975", title: "Job Description", isActive: false },
  ];

  return (
    <nav className="d-flex justify-content-between my-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <StepperItem
            imgSrc={step.imgSrc}
            stepNumber={index + 1}
            title={step.title}
            isActive={step.isActive}
          />
          {index < steps.length - 1 && <div className="mx-2 border-end" style={{ height: '2rem' }} />}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default JobPostingStepper;
