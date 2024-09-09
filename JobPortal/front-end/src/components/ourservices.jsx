import ServiceCard from './servicecard';

const services = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d7265688ee7776c5a340d1164837f583a5b173148048ade774afb3b45e6ca3b7?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975",
    title: "JOB MATCHING",
    description: "Matching job seekers with available job vacancies."
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/aaf90004eb0f3484461feb54bd2ba2745d5b972e13c19cd22a246859ba671dc0?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975",
    title: "CAREER GUIDANCE",
    description: "Assisting individuals in making informed decisions about their careers."
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/4bc63f0aae35ba3109731d4bb1cc09b251978c856b036c2e0c2128170190f9b3?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975",
    title: "SKILLS TRAINING",
    description: "Providing or coordinating skills training programs to improve the employability of job seekers."
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3010d0775b43daf31c3a2e6366996039cb8c87287b054a40d1d43211752cec05?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975",
    title: "JOB FAIRS",
    description: "Organizing events to connect job seekers with employers."
  }
];

const OurServices = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-4">OUR SERVICES</h2>
        <div className="row">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
