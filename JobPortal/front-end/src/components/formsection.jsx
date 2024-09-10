import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FormSection = ({ title, description, children }) => (
  <section className="mb-4">
    <h3 className="h5">{title}</h3>
    <p>{description}</p>
    <div>{children}</div>
  </section>
);

export default FormSection;
