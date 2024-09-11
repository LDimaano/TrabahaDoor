import React from 'react';
import ContactItem from './contactitem';

const ApplicantCard = () => (
  <aside className="bg-white p-4 border rounded">
    <header className="d-flex align-items-center mb-3">
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/3abeed5f2de2d8df2f096ae96cc50be8ac71d626c31b3c38ffa0141113466826?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" alt="Jerome Bell" className="me-3" style={{ width: '100px', borderRadius: '50%' }} />
      <div>
        <h2 className="mb-0">Jerome Bell</h2>
        <p className="text-muted">Elementary Teacher</p>
      </div>
    </header>
    <hr />
    <section>
      <h3>Contact</h3>
      <ContactItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/ab6f587dcea2feb8ba196239d2dbe8089ac193e55c6dbdc38125a77d9ca35531?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" label="Email" value="jeromeBell45@email.com" />
      <ContactItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8a17b7430f0018cf8821e9bdc668301aa5af2da139f8bfe7a795d7573d9f0082?placeholderIfAbsent=true&apiKey=1081a2635faf4c6ab261e216f55348ae" label="Phone" value="+63 956 812 4293" />
    </section>
  </aside>
);

export default ApplicantCard;
