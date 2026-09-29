import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Tab, Tabs, Card, Badge } from 'react-bootstrap';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/product/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist(id)) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(id, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(id, quantity);
    window.location.href = '/checkout';
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="bi bi-star-fill rating-star" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<i key={i} className="bi bi-star-half rating-star" />);
      } else {
        stars.push(<i key={i} className="bi bi-star text-muted" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
      </Container>
    );
  }

  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discount = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <Container className="py-5">
      <Row className="g-5">
        <Col lg={6}>
          <div className="mb-3">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x600'}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <Row className="g-2">
              {product.images.map((image, index) => (
                <Col key={index} xs={3}>
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`img-fluid rounded cursor-pointer ${selectedImage === index ? 'border border-3 border-dark' : ''}`}
                    style={{ cursor: 'pointer', height: '80px', objectFit: 'cover' }}
                    onClick={() => setSelectedImage(index)}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Col>

        <Col lg={6}>
          <small className="text-muted text-uppercase">{product.brand}</small>
          <h1 className="display-5 fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            {product.name}
          </h1>
          
          <div className="mb-3">
            {renderStars(product.rating)}
            <span className="ms-2 text-muted">({product.reviewCount} reviews)</span>
          </div>

          <div className="mb-4">
            <div className="d-flex align-items-center gap-3">
              <span className="display-6 fw-bold price">₹{price.toLocaleString()}</span>
              {originalPrice && (
                <>
                  <span className="original-price fs-5">₹{originalPrice.toLocaleString()}</span>
                  <Badge bg="danger">{discount}% OFF</Badge>
                </>
              )}
            </div>
          </div>

          <p className="text-muted mb-4">{product.description}</p>

          <div className="mb-4">
            <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </Badge>
          </div>

          <div className="d-flex gap-3 mb-4">
            <Form.Control
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value)), product.stock))}
              style={{ width: '80px' }}
            />
            <Button
              variant="dark"
              className="btn-primary flex-grow-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <i className="bi bi-bag me-2"></i>
              Add to Cart
            </Button>
            <Button
              variant="outline-dark"
              onClick={handleWishlistToggle}
              className={isInWishlist(id) ? 'active' : ''}
            >
              <i className="bi bi-heart" style={{ fontSize: '20px' }}></i>
            </Button>
          </div>

          <Button 
            variant="dark" 
            className="btn-primary w-100 mb-4"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
          >
            BUY NOW
          </Button>

          <Tabs defaultActiveKey="description" className="mb-4">
            <Tab eventKey="description" title="Description">
              <p className="pt-3">{product.description}</p>
            </Tab>
            <Tab eventKey="specifications" title="Specifications">
              <div className="pt-3">
                {product.specifications && (
                  <table className="table">
                    <tbody>
                      {product.specifications.caseMaterial && (
                        <tr>
                          <td><strong>Case Material:</strong></td>
                          <td>{product.specifications.caseMaterial}</td>
                        </tr>
                      )}
                      {product.specifications.strapMaterial && (
                        <tr>
                          <td><strong>Strap Material:</strong></td>
                          <td>{product.specifications.strapMaterial}</td>
                        </tr>
                      )}
                      {product.specifications.dialColor && (
                        <tr>
                          <td><strong>Dial Color:</strong></td>
                          <td>{product.specifications.dialColor}</td>
                        </tr>
                      )}
                      {product.specifications.movement && (
                        <tr>
                          <td><strong>Movement:</strong></td>
                          <td>{product.specifications.movement}</td>
                        </tr>
                      )}
                      {product.specifications.waterResistance && (
                        <tr>
                          <td><strong>Water Resistance:</strong></td>
                          <td>{product.specifications.waterResistance}</td>
                        </tr>
                      )}
                      {product.specifications.warranty && (
                        <tr>
                          <td><strong>Warranty:</strong></td>
                          <td>{product.specifications.warranty}</td>
                        </tr>
                      )}
                      {product.specifications.caseSize && (
                        <tr>
                          <td><strong>Case Size:</strong></td>
                          <td>{product.specifications.caseSize}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      <section className="mt-5">
        <h3 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Customer Reviews</h3>
        {reviews.length > 0 ? (
          <Row className="g-4">
            {reviews.map((review) => (
              <Col key={review._id} md={6}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <strong>{review.user?.name || 'Anonymous'}</strong>
                        <div className="mb-2">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <h6 className="mb-2">{review.title}</h6>
                    <p className="mb-0 text-muted">{review.comment}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted">No reviews yet. Be the first to review this product!</p>
        )}
      </section>
    </Container>
  );
};

export default ProductDetails;
