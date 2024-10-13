const ContactSection = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4">CONTACT US</h2>
        <p className="lead">Visit our office for more inquiries. We would love to hear from you!</p>
        <div className="row">
          <div className="col-12">
            <iframe
              src="https://www.google.com/maps?q=13.8693544,121.1062008&z=15&output=embed"
              className="w-100 border-0"
              height="400"
              allowFullScreen=""
              loading="lazy"
              title="Office Location"
              style={{ borderRadius: '8px' }}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
