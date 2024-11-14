import React from 'react';

const ContactSection = () => {
  return (
    <section className="py-5" style={{ backgroundColor: '#f8f9fa', padding: '3rem 0' }}>
      <div className="container text-center">
        <h2 className="mb-4" style={{ fontWeight: '700', color: '#333' }}>Contact Us</h2>
        <p className="lead" style={{ marginBottom: '2rem', color: '#555' }}>Visit our office for more inquiries. We would love to hear from you!</p>
        <div className="row justify-content-center mb-5">
          <div className="col-md-6">
            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><strong>Phone:</strong> (043) 779 8550</p>
              <p style={{ fontSize: '1.1rem' }}><strong>Facebook:</strong> <a href="https://www.facebook.com/sanjosebatangasPESO" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>facebook.com/sanjosebatangasPESO</a></p>
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
              style={{ borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' }}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
