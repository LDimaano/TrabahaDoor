import React, { useState } from 'react';
import SideBar from '../../components/admin_sidepanel';
import GenderDistributionChart from '../../components/genderdistribution';
import LocationDistributionChart from '../../components/jsaddress';
import JsIndustryDistributionChart from '../../components/jsindustry';
import EmpIndustryDistributionChart from '../../components/empindustry';

function Demographics() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="d-flex">
      <div className={`col-auto p-0 ${isSidebarVisible ? 'd-block' : 'd-none'} d-lg-block`}>
        <SideBar />
      </div>
      <main className="flex-grow-1 p-4">
        <section className="py-2">
          <h2 className="text-start fs-4">Admin Dashboard</h2>
        </section>

        <div className="row gx-2 mb-4">
          <div className="col-lg-6 col-md-12 mb-3">
            <div className="bg-white border rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Jobseeker Gender Distribution</h5>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <GenderDistributionChart />
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 mb-3">
            <div className="bg-white border rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Jobseeker Address Distribution</h5>
              <div style={{ height: 'calc(100% - 3rem)', width: '100%' }}>
                <LocationDistributionChart />
              </div>
            </div>
          </div>
        </div>

        <div className="row gx-2 mb-4">
          <div className="col-lg-12 mb-3">
            <div className="bg-white border rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Jobseeker Industry Distribution</h5>
              <div style={{ height: 'calc(100% - 3rem)', width: '100%' }}>
                <JsIndustryDistributionChart/>
              </div>
            </div>
          </div>
        </div>

        <div className="row gx-2 mb-4">
          <div className="col-lg-12 mb-3">
            <div className="bg-white border rounded shadow-sm p-3 h-100">
              <h5 className="mb-3">Employer Industry Distribution</h5>
              <div style={{ height: 'calc(100% - 3rem)', width: '100%' }}>
                <EmpIndustryDistributionChart/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Demographics;
