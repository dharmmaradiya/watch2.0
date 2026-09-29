import { Container, Row, Col, Form, Nav } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer py-5">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <h3 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>TIMEORA</h3>
            <p className="text-secondary mb-4">
              Discover timeless elegance with our premium collection of luxury watches. 
              Crafted for those who appreciate the finer things in life.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="social-icon text-white">
                <i className="bi bi-instagram" style={{ fontSize: '20px' }}></i>
              </a>
              <a href="#" className="social-icon text-white">
                <i className="bi bi-facebook" style={{ fontSize: '20px' }}></i>
              </a>
              <a href="#" className="social-icon text-white">
                <i className="bi bi-youtube" style={{ fontSize: '20px' }}></i>
              </a>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <h5 className="mb-3 gold-text">Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link href="/" className="text-secondary mb-2 ps-0">Home</Nav.Link>
              <Nav.Link href="/?section=new-arrivals" className="text-secondary mb-2 ps-0">New Arrivals</Nav.Link>
              <Nav.Link href="/?section=bestsellers" className="text-secondary mb-2 ps-0">Best Sellers</Nav.Link>
              <Nav.Link href="/?section=brands" className="text-secondary mb-2 ps-0">Brands</Nav.Link>
              <Nav.Link href="/?section=offers" className="text-secondary mb-2 ps-0">Offers</Nav.Link>
            </Nav>
          </Col>

          <Col lg={2} md={6}>
            <h5 className="mb-3 gold-text">Customer Care</h5>
            <Nav className="flex-column">
              <Nav.Link href="#" className="text-secondary mb-2 ps-0">Contact Us</Nav.Link>
              <Nav.Link href="#" className="text-secondary mb-2 ps-0">FAQ</Nav.Link>
              <Nav.Link href="#" className="text-secondary mb-2 ps-0">Shipping & Returns</Nav.Link>
              <Nav.Link href="#" className="text-secondary mb-2 ps-0">Privacy Policy</Nav.Link>
              <Nav.Link href="#" className="text-secondary mb-2 ps-0">Terms & Conditions</Nav.Link>
            </Nav>
          </Col>

          <Col lg={4} md={6}>
            <h5 className="mb-3 gold-text">Newsletter</h5>
            <p className="text-secondary mb-3">Subscribe to our newsletter for exclusive offers and updates.</p>
            <Form className="d-flex gap-2">
              <Form.Control
                type="email"
                placeholder="Your email"
                className="bg-dark text-white border-secondary"
              />
              <button className="btn btn-primary">Subscribe</button>
            </Form>
            
            <div className="mt-4">
              <h6 className="gold-text mb-2">Contact Info</h6>
              <p className="text-secondary small mb-1">
                <i className="bi bi-envelope me-2"></i>
                support@timeora.com
              </p>
              <p className="text-secondary small mb-1">
                <i className="bi bi-telephone me-2"></i>
                +91 98765 43210
              </p>
              <p className="text-secondary small">
                <i className="bi bi-geo-alt me-2"></i>
                Mumbai, India
              </p>
            </div>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        <Row>
          <Col className="text-center text-secondary small">
            <p className="mb-0">&copy; 2024 TIMEORA. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
