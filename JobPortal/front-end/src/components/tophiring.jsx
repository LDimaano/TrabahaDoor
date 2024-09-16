import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TopHiringList({ title }) {
  const items = title === "Top Hiring Industries" 
    ? [
        { name: "Manufacturing", count: 35 },
        { name: "Retail", count: 28 },
        { name: "Education", count: 25 },
        { name: "Healthcare", count: 20 },
        { name: "Marketing", count: 19 }
      ]
    : [
        { name: "Alorica Lipa", count: 300, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ec88b39b53b292ed088ebdba70b5a4b483eed63aaf6e38adffa7b9d6d81927b7?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" },
        { name: "CDO Foodsphere, INC.", count: 275, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/3175f88792ecd32d496bbea0bc774ffb96c031fd25dc463c65af52d708ad7ea2?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" },
        { name: "EPSON", count: 225, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/77e3295199b5d8627ad007aa2541f5e36ef85b6c5a67c5950719c925eea153b4?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" },
        { name: "Honda Philippines, INC.", count: 199, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/da2d5a2da81060add465e9494501d897fe92e0aef68a512fa715d06ca4e91082?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" },
        { name: "LBC Express INC.", count: 185, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/5c8b74f0402894e525fb2ba37b96b68ddad6c4e312ec2cbe99386c67cdd55c26?placeholderIfAbsent=true&apiKey=691aa702d0594162a92c71d207580975" }
      ];

  return (
    <section className="card p-3 shadow-sm"> {/* Reduced padding */}
      <h2 className="h6 text-dark">{title}</h2> {/* Reduced font size */}
      <ul className="list-unstyled mt-2"> {/* Reduced top margin */}
        {items.map((item, index) => (
          <li key={index} className="d-flex align-items-center justify-content-between mb-2"> {/* Reduced bottom margin */}
            {item.image && <img src={item.image} alt="" className="rounded-circle me-2" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />} {/* Adjusted image size */}
            <span className="text-dark flex-grow-1">{item.name}</span>
            <span className="fw-bold">{item.count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TopHiringList;
