import { useState, useEffect } from 'react';

const Announcements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { src: "/assets/Peso1.jpg", alt: "First slide", caption: "An overview of the successful job fair organized by the Public Employment Service Office" },
    { src: "/assets/Peso2.jpg", alt: "Second slide", caption: "Showcasing dynamic interactions with job seekers and employers" },
    { src: "/assets/Peso3.jpg", alt: "Third slide", caption: "PESO opens opportunities to many residents of San Jose" },
    { src: "/assets/Peso4.jpg", alt: "Fourth slide", caption: "Connecting employers to qualified candidates" },
  ];

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="mb-4">Public Employment Service Office of San Jose</h2>
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div key={index} className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
                <div className="d-flex justify-content-center">
                  <img 
                    src={slide.src} 
                    className="d-block w-100" // Use Bootstrap classes for responsive width
                    alt={slide.alt} 
                    style={{ height: '400px', objectFit: 'cover' }} // Inline styles for uniform height
                  />
                </div>
                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-2 rounded">
                  <h5>{slide.caption}</h5>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" onClick={goToPreviousSlide}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" onClick={goToNextSlide}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Announcements;
