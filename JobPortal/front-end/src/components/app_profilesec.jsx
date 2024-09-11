import React from 'react';

const ProfileSection = () => (
  <div className="d-flex align-items-center mt-4">
    <img src="profile-photo-url" alt="User profile" className="me-2" style={{ width: '50px', borderRadius: '50%' }} />
    <div>
      <span className="d-block fw-bold">Maria Kelly</span>
      <span className="text-muted">MariaKlly@email.com</span>
    </div>
  </div>
);

export default ProfileSection;