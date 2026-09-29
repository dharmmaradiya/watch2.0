import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product._id, 1);
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

  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <Card className="product-card h-100 border-0">
      <Link to={`/product/${product._id}`} className="text-decoration-none">
        <div className="position-relative overflow-hidden">
          <Card.Img 
            variant="top" 
            src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'} 
            alt={product.name}
            style={{ height: '300px', objectFit: 'cover' }}
          />
          <button
            className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
            onClick={handleWishlistToggle}
          >
            <i className="bi bi-heart" style={{ fontSize: '20px' }}></i>
          </button>
          <Button 
            className="quick-view-btn"
            size="sm"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </Link>
      <Card.Body className="p-3">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <small className="text-muted text-uppercase small">{product.brand}</small>
          <Card.Title className="h6 mb-2 text-dark">{product.name}</Card.Title>
          <div className="mb-2">
            {renderStars(product.rating)}
            <small className="text-muted ms-1">({product.reviewCount})</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="price">₹{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="original-price">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
