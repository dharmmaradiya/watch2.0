import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Image, Form, Card } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchCart();
    }
  }, [isAuthenticated]);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(cartItemId, newQuantity);
  };

  const handleRemove = async (cartItemId) => {
    await removeFromCart(cartItemId);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 5000 ? 0 : 199;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your cart is empty</h2>
        <p className="text-muted mb-4">Add some luxury watches to your cart!</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Shopping Cart</h1>
      <Row>
        <Col lg={8}>
          <Table responsive className="align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <Image
                        src={item.product?.images?.[0] || 'https://via.placeholder.com/80x80'}
                        alt={item.product?.name}
                        width={80}
                        height={80}
                        className="rounded me-3"
                        style={{ objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="mb-0">{item.product?.name}</h6>
                        <small className="text-muted">{item.product?.brand}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    ₹{(item.product?.discountPrice || item.product?.price || item.price).toLocaleString()}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      >
                        <i className="bi bi-dash"></i>
                      </Button>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="mx-2 text-center"
                        style={{ width: '50px' }}
                      />
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </Button>
                    </div>
                  </td>
                  <td className="fw-bold">
                    ₹{((item.product?.discountPrice || item.product?.price || item.price) * item.quantity).toLocaleString()}
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(item._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span className="fw-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span className="fw-bold">
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5">₹{total.toLocaleString()}</span>
              </div>
              {subtotal < 5000 && (
                <p className="small text-muted mb-3">
                  Add ₹{(5000 - subtotal).toLocaleString()} more for FREE shipping!
                </p>
              )}
              <Button
                variant="dark"
                className="btn-primary w-100"
                as={Link}
                to="/checkout"
              >
                PROCEED TO CHECKOUT
              </Button>
              <Button
                variant="outline-dark"
                className="w-100 mt-2"
                as={Link}
                to="/"
              >
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
