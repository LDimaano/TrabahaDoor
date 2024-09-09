import { useState } from 'react';

const Announcements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { src: "/assets/jobfair.jpg", alt: "First slide", caption: "PESO SAN JOSE" },
    { src: "/assets/Peso1.jpg", alt: "Second slide", caption: "PESO SAN JOSE" },
    { src: "/assets/Peso2.jpg", alt: "Third slide", caption: "PESO SAN JOSE" },
    { src: "/assets/Peso3.jpg", alt: "Fifth slide", caption: "PESO SAN JOSE" },
    { src: "/assets/Peso4.jpg", alt: "Sixth slide", caption: "PESO SAN JOSE" }
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

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="mb-4">ANNOUNCEMENTS</h2>
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div key={index} className={`carousel-item ${index === currentIndex ? 'active' : ''}`}>
                <div className="d-flex justify-content-center">
                  <img 
                    src={slide.src} 
                    className="d-block" 
                    alt={slide.alt} 
                    style={{ maxWidth: '700px', height: 'auto' }} 
                  />
                </div>
                <div className="carousel-caption d-none d-md-block">
                  <h5>{slide.caption}</h5>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" onClick={goToPreviousSlide}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" onClick={goToNextSlide}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Announcements;
