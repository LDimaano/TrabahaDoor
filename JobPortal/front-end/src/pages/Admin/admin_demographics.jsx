import React, { useState } from 'react';
import SideBar from '../../components/admin_sidepanel';

function Demographics() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`col-auto p-0 ${isSidebarVisible ? 'd-block' : 'd-none'} d-lg-block`}>
        <SideBar />
      </div>

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <section className="py-2">
          <h2 className="text-start fs-4">New Dashboard Overview</h2>
        </section>

        {/* Layout for New Charts */}
        <div className="row gx-2 mb-4">
          <div className="col-lg-6 col-md-12 mb-3">
            <div className="bg-white border rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Chart 1 Title</h5>
              {/* Insert Chart Component or Content Here */}
              <div className="chart-placeholder" style={{ height: '300px', backgroundColor: '#f0f0f0' }}>
                Chart 1 Placeholder
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 mb-3">
            <div className="bg-white border rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Chart 2 Title</h5>
              {/* Insert Chart Component or Content Here */}
              <div className="chart-placeholder" style={{ height: '300px', backgroundColor: '#f0f0f0' }}>
                Chart 2 Placeholder
              </div>
            </div>
          </div>
        </div>

        <div className="row gx-2 mb-4">
          <div className="col-lg-12 mb-3">
            <div className="bg-white border rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Demographics Overview</h5>
              {/* Insert Chart Component or Content Here */}
              <div className="chart-placeholder" style={{ height: '400px', backgroundColor: '#f0f0f0' }}>
                Demographics Chart Placeholder
              </div>
            </div>
          </div>
        </div>

        {/* Add more containers as needed */}
        <div className="row gx-2 mb-4">
          <div className="col-lg-6 col-md-12 mb-3">
            <div className="bg-white border rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Additional Chart 3</h5>
              <div className="chart-placeholder" style={{ height: '300px', backgroundColor: '#f0f0f0' }}>
                Chart 3 Placeholder
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 mb-3">
            <div className="bg-white border rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Additional Chart 4</h5>
              <div className="chart-placeholder" style={{ height: '300px', backgroundColor: '#f0f0f0' }}>
                Chart 4 Placeholder
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Demographics;
