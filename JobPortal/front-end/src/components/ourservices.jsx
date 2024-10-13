import ServiceCard from './servicecard';

const services = [
  {
    icon: "/assets/jobmatching.jpg",
    title: "JOB MATCHING",
    description: "Matching job seekers with available job vacancies."
  },
  {
    icon: "/assets/career.jpg",
    title: "CAREER GUIDANCE",
    description: "Assisting individuals in making informed decisions about their careers."
  },
  {
    icon: "/assets/skill.jpg",
    title: "SKILLS TRAINING",
    description: "Providing or coordinating skills training programs to improve the employability of job seekers."
  },
  {
    icon: "/assets/job.jpg",
    title: "JOB FAIRS",
    description: "Organizing events to connect job seekers with employers."
  }
];

const OurServices = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4">OUR SERVICES</h2>
        <div className="row g-4">
          {services.map((service, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
