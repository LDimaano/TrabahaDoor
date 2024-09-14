import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  const handleSignupClick = () => {
    navigate('/signup'); 
  };

  const navItems = ['Home', 'About Us', 'Services', 'Contact Us'];

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/TrabahaDoor_logo.png`} 
            alt="TrabahaDoor logo" 
            width="30" 
            height="30" 
            className="d-inline-block align-top" 
          />
          <span className="ms-2 fw-bold">TrabahaDoor</span>
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <a className="nav-link" href={`#${item.toLowerCase().replace(' ', '-')}`}>{item}</a>
              </li>
            ))}
          </ul>
          <div className="d-flex">
            <button className="btn btn-outline-primary me-2" onClick={handleLoginClick}>Login</button>
            <button className="btn btn-primary" onClick={handleSignupClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
