import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Form, Badge, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="announcement-bar bg-black text-white text-center py-2 small">
        FREE SHIPPING ON ORDERS ABOVE ₹5,000
      </div>

      <Navbar 
        expand="lg" 
        sticky="top" 
        className={`bg-white ${scrolled ? 'navbar-scrolled shadow-sm' : ''}`}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>
            TIMEORA
          </Navbar.Brand>

          <Navbar.Toggle onClick={() => setShowOffcanvas(true)} />

          <Navbar.Offcanvas 
            show={showOffcanvas} 
            onHide={() => setShowOffcanvas(false)}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/?section=new-arrivals" onClick={() => setShowOffcanvas(false)}>
                  New Arrivals
                </Nav.Link>
                <Nav.Link as={Link} to="/?section=watches" onClick={() => setShowOffcanvas(false)}>
                  Watches
                </Nav.Link>
                <NavDropdown title="Collections" id="collections-dropdown">
                  <NavDropdown.Item as={Link} to="/?collection=automatic" onClick={() => setShowOffcanvas(false)}>
                    Automatic
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/?collection=chronograph" onClick={() => setShowOffcanvas(false)}>
                    Chronograph
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/?collection=classic" onClick={() => setShowOffcanvas(false)}>
                    Classic
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/?collection=sport" onClick={() => setShowOffcanvas(false)}>
                    Sport
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/?section=brands" onClick={() => setShowOffcanvas(false)}>
                  Brands
                </Nav.Link>
                <Nav.Link as={Link} to="/?section=offers" onClick={() => setShowOffcanvas(false)}>
                  Offers
                </Nav.Link>
              </Nav>

              <Form className="d-flex me-3" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Search..."
                  className="me-2"
                  style={{ width: '200px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-outline-dark">
                  <i className="bi bi-search"></i>
                </button>
              </Form>

              <Nav className="align-items-center">
                <Nav.Link as={Link} to={isAuthenticated ? '/profile' : '/login'} className="position-relative">
                  <i className="bi bi-person" style={{ fontSize: '24px' }}></i>
                </Nav.Link>

                <Nav.Link as={Link} to="/wishlist" className="position-relative mx-2">
                  <i className="bi bi-heart" style={{ fontSize: '24px' }}></i>
                  {getWishlistCount > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {getWishlistCount}
                    </Badge>
                  )}
                </Nav.Link>

                <Nav.Link as={Link} to="/cart" className="position-relative">
                  <i className="bi bi-bag" style={{ fontSize: '24px' }}></i>
                  {getCartCount > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {getCartCount}
                    </Badge>
                  )}
                </Nav.Link>

                {isAuthenticated && user?.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" className="ms-2">
                    Admin
                  </Nav.Link>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
