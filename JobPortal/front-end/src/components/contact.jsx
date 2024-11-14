import React from 'react';

const ContactSection = () => {
  return (
    <section className="py-5" style={{ backgroundColor: '#f0f0f0', padding: '2rem 0' }}>
      <div className="container text-center">
        <h2 className="mb-4">CONTACT US</h2>
        <p className="lead" style={{ marginBottom: '1.5rem', color: '#6c757d' }}>Visit our office for more inquiries. We would love to hear from you!</p>
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <p><strong>Phone:</strong> (043) 779 8550</p>
              <p><strong>Facebook:</strong> <a href="https://www.facebook.com/sanjosebatangasPESO" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>facebook.com/sanjosebatangasPESO</a></p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <iframe
              src="https://www.google.com/maps?q=13.8693544,121.1062008&z=15&output=embed"
              className="w-100 border-0"
              height="400"
              allowFullScreen=""
              loading="lazy"
              title="Office Location"
              style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
