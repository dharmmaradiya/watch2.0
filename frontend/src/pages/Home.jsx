import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [newArr, best, trend] = await Promise.all([
        api.get('/products/new-arrivals'),
        api.get('/products/bestsellers'),
        api.get('/products/trending'),
      ]);
      setNewArrivals(newArr.data);
      setBestSellers(best.data);
      setTrending(trend.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Automatic Watches', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400' },
    { name: 'Chronograph Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400' },
    { name: 'Men\'s Watches', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400' },
    { name: 'Women\'s Watches', image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400' },
    { name: 'Smart Watches', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400' },
    { name: 'Premium Watches', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400' },
  ];

  const brands = [
    { name: 'AUREL' },
    { name: 'CHRONOVA' },
    { name: 'VELORA' },
    { name: 'NEXUS' },
    { name: 'ORION' },
    { name: 'ELITE' },
  ];

  const reviews = [
    { name: 'Rahul Sharma', rating: 5, review: 'Absolutely stunning watch! The craftsmanship is exceptional.', product: 'Royal Chronograph' },
    { name: 'Priya Patel', rating: 5, review: 'Beautiful timepiece. Worth every penny. Highly recommended!', product: 'Elegant Automatic' },
    { name: 'Amit Kumar', rating: 4, review: 'Great quality and fast delivery. Very satisfied with my purchase.', product: 'Sport Pro' },
  ];

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Carousel className="hero-section">
        <Carousel.Item>
          <Container className="h-100">
            <Row className="align-items-center" style={{ minHeight: '80vh' }}>
              <Col lg={6} className="text-center text-lg-start">
                <h1 className="display-3 fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  TIMEORA
                </h1>
                <h2 className="display-5 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  TIMELESS ELEGANCE
                </h2>
                <p className="lead mb-4 text-muted">
                  Discover watches designed for every moment. Crafted with precision and styled for perfection.
                </p>
                <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                  <Button as={Link} to="/?section=new-arrivals" variant="dark" className="btn-primary">
                    SHOP NOW
                  </Button>
                  <Button as={Link} to="/?section=watches" variant="outline-dark">
                    EXPLORE COLLECTION
                  </Button>
                </div>
              </Col>
              <Col lg={6} className="d-none d-lg-block">
                <img
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600"
                  alt="Luxury Watch"
                  className="img-fluid"
                  style={{ maxHeight: '500px' }}
                />
              </Col>
            </Row>
          </Container>
        </Carousel.Item>
        <Carousel.Item>
          <Container className="h-100">
            <Row className="align-items-center" style={{ minHeight: '80vh' }}>
              <Col lg={6} className="text-center text-lg-start">
                <h1 className="display-3 fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  NEW COLLECTION
                </h1>
                <h2 className="display-5 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  2024 EDITION
                </h2>
                <p className="lead mb-4 text-muted">
                  Experience the latest in luxury watchmaking. Innovation meets tradition.
                </p>
                <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                  <Button as={Link} to="/?section=new-arrivals" variant="dark" className="btn-primary">
                    DISCOVER NOW
                  </Button>
                </div>
              </Col>
              <Col lg={6} className="d-none d-lg-block">
                <img
                  src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"
                  alt="New Collection"
                  className="img-fluid"
                  style={{ maxHeight: '500px' }}
                />
              </Col>
            </Row>
          </Container>
        </Carousel.Item>
        <Carousel.Item>
          <Container className="h-100">
            <Row className="align-items-center" style={{ minHeight: '80vh' }}>
              <Col lg={6} className="text-center text-lg-start">
                <h1 className="display-3 fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  EXCLUSIVE OFFERS
                </h1>
                <h2 className="display-5 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  UP TO 30% OFF
                </h2>
                <p className="lead mb-4 text-muted">
                  Limited time offers on selected luxury timepieces. Don't miss out.
                </p>
                <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                  <Button as={Link} to="/?section=offers" variant="dark" className="btn-primary">
                    SHOP OFFERS
                  </Button>
                </div>
              </Col>
              <Col lg={6} className="d-none d-lg-block">
                <img
                  src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600"
                  alt="Exclusive Offers"
                  className="img-fluid"
                  style={{ maxHeight: '500px' }}
                />
              </Col>
            </Row>
          </Container>
        </Carousel.Item>
      </Carousel>

      <section className="section-padding bg-black text-white">
        <Container>
          <h2 className="text-center mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shop by Category
          </h2>
          <Row className="g-4">
            {categories.map((category, index) => (
              <Col key={index} md={4} sm={6}>
                <Card className="category-card h-100">
                  <Card.Img src={category.image} alt={category.name} style={{ height: '250px', objectFit: 'cover' }} />
                  <div className="category-title">
                    <h5 className="mb-0">{category.name}</h5>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="featured-banner section-padding">
        <Container className="text-center">
          <h1 className="display-4 fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            TIMEORA EXCLUSIVE
          </h1>
          <p className="lead mb-5">Discover our latest collections</p>
          <Row className="g-4 mt-4">
            <Col md={3} sm={6}>
              <Card className="bg-dark text-white border border-secondary h-100">
                <Card.Body className="text-center">
                  <h5 className="gold-text">Automatic</h5>
                  <p className="small text-muted">Self-winding precision</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="bg-dark text-white border border-secondary h-100">
                <Card.Body className="text-center">
                  <h5 className="gold-text">Chronograph</h5>
                  <p className="small text-muted">Precision timing</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="bg-dark text-white border border-secondary h-100">
                <Card.Body className="text-center">
                  <h5 className="gold-text">Classic</h5>
                  <p className="small text-muted">Timeless design</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="bg-dark text-white border border-secondary h-100">
                <Card.Body className="text-center">
                  <h5 className="gold-text">Sport</h5>
                  <p className="small text-muted">Active lifestyle</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }}>New Arrivals</h2>
            <Button as={Link} to="/?section=new-arrivals" variant="outline-dark">
              VIEW ALL
            </Button>
          </div>
          <Row className="g-4">
            {newArrivals.slice(0, 4).map((product) => (
              <Col key={product._id} md={3} sm={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-padding bg-light">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }}>Best Sellers</h2>
            <Button as={Link} to="/?section=bestsellers" variant="outline-dark">
              VIEW ALL
            </Button>
          </div>
          <Row className="g-4">
            {bestSellers.slice(0, 4).map((product) => (
              <Col key={product._id} md={3} sm={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <h2 className="text-center mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
            Trending Now
          </h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="border-0 h-100">
                <Card.Img 
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400" 
                  alt="Luxury Chronographs"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <Card.Body className="text-center">
                  <h5>Luxury Chronographs</h5>
                  <Button as={Link} to="/?section=trending" variant="dark" className="btn-primary mt-2">
                    SHOP NOW
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 h-100">
                <Card.Img 
                  src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400" 
                  alt="Classic Automatic"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <Card.Body className="text-center">
                  <h5>Classic Automatic</h5>
                  <Button as={Link} to="/?section=trending" variant="dark" className="btn-primary mt-2">
                    SHOP NOW
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 h-100">
                <Card.Img 
                  src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400" 
                  alt="Modern Sports"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <Card.Body className="text-center">
                  <h5>Modern Sports</h5>
                  <Button as={Link} to="/?section=trending" variant="dark" className="btn-primary mt-2">
                    SHOP NOW
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-padding bg-black text-white">
        <Container>
          <h2 className="text-center mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our Brands
          </h2>
          <Row className="justify-content-center g-4">
            {brands.map((brand, index) => (
              <Col key={index} md={2} sm={4} xs={6} className="text-center">
                <div className="brand-logo mx-auto mb-2">
                  {brand.name}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h2 className="display-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                TIMEORA COLLECTION
              </h2>
              <p className="lead mb-4 text-muted">
                Discover timeless craftsmanship with our exclusive collection of luxury watches. 
                Each piece is meticulously crafted to perfection, combining traditional artistry 
                with modern innovation.
              </p>
              <Button as={Link} to="/?section=collection" variant="dark" className="btn-primary">
                SHOP COLLECTION
              </Button>
            </Col>
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600"
                alt="Timeora Collection"
                className="img-fluid rounded"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-padding" style={{ background: 'linear-gradient(135deg, #4A3F35 0%, #2D2D2D 100%)' }}>
        <Container className="text-center text-white">
          <h1 className="display-4 fw-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Luxury Meets Performance
          </h1>
          <p className="lead mb-4">Experience the perfect blend of elegance and functionality</p>
          <Button as={Link} to="/?section=watches" variant="light" className="btn-primary">
            SHOP NOW
          </Button>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <h2 className="text-center mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
            Premium Watches from TIMEORA
          </h2>
          <Row className="justify-content-center">
            <Col lg={8}>
              <p className="text-center text-muted lead">
                At TIMEORA, we believe that a luxury watch is more than just a timepiece—it's a statement 
                of style, a symbol of achievement, and a companion for life's most precious moments. 
                Our collection features premium materials including surgical-grade stainless steel, 
                sapphire crystal, and genuine leather straps. Each watch undergoes rigorous quality 
                testing to ensure precision timekeeping and durability. With our comprehensive warranty 
                and secure shopping experience, you can shop with confidence knowing you're getting 
                authentic, high-quality timepieces backed by exceptional customer service.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-padding bg-light">
        <Container>
          <h2 className="text-center mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
            Frequently Asked Questions
          </h2>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>What is the warranty period?</Accordion.Header>
                  <Accordion.Body>
                    All TIMEORA watches come with a 2-year international warranty covering manufacturing defects.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Are all watches authentic?</Accordion.Header>
                  <Accordion.Body>
                    Yes, we guarantee 100% authenticity. All our watches come with original manufacturer warranty and certificates.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Do you offer cash on delivery?</Accordion.Header>
                  <Accordion.Body>
                    Yes, we offer COD on orders above ₹2,000 within India.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>How long does delivery take?</Accordion.Header>
                  <Accordion.Body>
                    Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available for an additional charge.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>Can I return a watch?</Accordion.Header>
                  <Accordion.Body>
                    Yes, we offer a 30-day return policy for unused watches in original packaging.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                  <Accordion.Header>How can I track my order?</Accordion.Header>
                  <Accordion.Body>
                    You'll receive a tracking number via email once your order ships. You can also track it in your account.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <h2 className="text-center mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
            Let Customers Speak For Us
          </h2>
          <Row className="g-4">
            {reviews.map((review, index) => (
              <Col key={index} md={4}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill rating-star" />
                      ))}
                    </div>
                    <p className="mb-3">"{review.review}"</p>
                    <div>
                      <strong>{review.name}</strong>
                      <p className="small text-muted mb-0">Purchased: {review.product}</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
