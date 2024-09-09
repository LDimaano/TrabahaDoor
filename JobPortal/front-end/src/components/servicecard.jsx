const ServiceCard = ({ icon, title, description }) => {
    return (
      <div className="col-lg-3 col-md-6 mb-4">
        <div className="card h-100 text-center">
          <img src={icon} alt="" className="card-img-top" />
          <div className="card-body">
            <h4 className="card-title">{title}</h4>
            <p className="card-text">{description}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ServiceCard;
  