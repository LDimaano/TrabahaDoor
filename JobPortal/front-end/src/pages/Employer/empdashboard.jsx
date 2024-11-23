import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import Sidebar from '../../components/emp_side';
import Header from '../../components/emp_header';
import ChartPlaceholder1 from '../../components/emp_chart1';
import ChartPlaceholder2 from '../../components/emp_chart2';
import ChartPlaceholder3 from '../../components/emp_chart3';
import ChartPlaceholder4 from '../../components/emp_chart4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const EmployerDashboard = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="d-flex">
      <Helmet>
        <title>TrabahaDoor - Employer</title> 
      </Helmet>
      <div
        className={`sidebar bg-primary text-white ${isSidebarVisible ? 'slide-in' : 'slide-out'} d-lg-block`}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          width: '250px',
          overflowY: 'auto',
          zIndex: 1000,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Sidebar />
      </div>

      <main className="flex-grow-1 p-3" style={{ marginLeft: isSidebarVisible || window.innerWidth >= 992 ? '250px' : '0' }}>
        <Header />
        <section>
          <h3>Employer Dashboard</h3>
          <div className="row g-4 mt-4">
            <div className="col-lg-6 col-md-12">
              <ChartPlaceholder1 />
            </div>
            <div className="col-lg-6 col-md-12">
              <ChartPlaceholder2 />
            </div>
            <div className="col-lg-6 col-md-12">
              <ChartPlaceholder3 />
            </div>
            <div className="col-lg-6 col-md-12">
              <ChartPlaceholder4 />
            </div>
          </div>
        </section>
      </main>
      <button
        className="btn btn-primary d-lg-none position-fixed"
        style={{ top: '15px', left: '15px', zIndex: 999 }}
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <style jsx>{`
        .slide-in {
          transform: translateX(0);
        }
        .slide-out {
          transform: translateX(-100%);
        }
      `}</style>
    </div>
  );
};

export default EmployerDashboard;
