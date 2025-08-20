import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const Announcements = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/getannouncement`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSlides(data);
        } else if (Array.isArray(data.announcements)) {
          setSlides(data.announcements);
        } else {
          setSlides([]); // fallback
        }
      })
      .catch((err) => {
        console.error(err);
        setSlides([]);
      });
  }, []);

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

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  const openModal = (imageUrl, caption) => {
    setSelectedImage(imageUrl);
    setSelectedCaption(caption);
    setShowModal(true);
  };

  if (slides.length === 0) {
    return <p className="text-center">No announcements available</p>;
  }

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="mb-4" style={{ fontWeight: "700", color: "#333" }}>
          Public Employment Service Office of San Jose
        </h2>
        <div id="carouselExampleControls" className="carousel slide">
          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-item ${index === currentIndex ? "active" : ""}`}
              >
                <div className="d-flex flex-column align-items-center">
                  <img
                    src={slide.image_url}
                    className="d-block img-fluid"
                    alt={slide.caption}
                    style={{
                      maxHeight: "400px",
                      objectFit: "cover",
                      width: "100%",
                      cursor: "pointer",
                    }}
                    onClick={() => openModal(slide.image_url, slide.caption)}
                  />
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => openModal(slide.image_url, slide.caption)}
                  >
                    View Full Announcement
                  </Button>
                </div>
                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-2 rounded">
                  <h5>{slide.caption}</h5>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            onClick={goToPreviousSlide}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            onClick={goToNextSlide}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Modal for full image view */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Body className="text-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full Announcement"
              className="img-fluid rounded mb-3"
              style={{ maxHeight: "70vh" }}
            />
          )}
          {selectedCaption && (
            <h5 className="mt-2">{selectedCaption}</h5>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Announcements;
