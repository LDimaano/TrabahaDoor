import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function AdminNavbar({ toggleSidebar }) {
  return (
    <Navbar bg="light" expand="lg" className="d-lg-none">
      <Button variant="outline-primary" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
    </Navbar>
  );
}

export default AdminNavbar;
