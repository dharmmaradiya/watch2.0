import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
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

  if (wishlist.length === 0) {
    return (
      <Container className="py-5 text-center">
        <i className="bi bi-heart text-muted mb-3" style={{ fontSize: '80px' }}></i>
        <h2>Your wishlist is empty</h2>
        <p className="text-muted mb-4">Save your favorite watches for later!</p>
        <Link to="/" className="btn btn-primary">
          Browse Watches
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>My Wishlist</h1>
      <p className="text-muted mb-4">{wishlist.length} items</p>
      <Row className="g-4">
        {wishlist.map((product) => (
          <Col key={product._id} md={4} sm={6}>
            <div className="card h-100 border-0 shadow-sm product-card">
              <div className="position-relative">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/400x400'}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <button
                  className="wishlist-btn active"
                  onClick={() => handleRemove(product._id)}
                >
                  <i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                </button>
              </div>
              <div className="card-body p-3">
                <Link to={`/product/${product._id}`} className="text-decoration-none">
                  <small className="text-muted text-uppercase small">{product.brand}</small>
                  <h5 className="card-title h6 mb-2 text-dark">{product.name}</h5>
                  <div className="mb-2">
                    {renderStars(product.rating)}
                    <small className="text-muted ms-1">({product.reviewCount})</small>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="price">
                      ₹{(product.discountPrice || product.price).toLocaleString()}
                    </span>
                    {product.discountPrice && (
                      <span className="original-price">
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="dark"
                    className="btn-primary w-100"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    <i className="bi bi-bag me-2"></i>
                    Add to Cart
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Wishlist;
