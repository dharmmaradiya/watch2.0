import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import { BiEdit } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusData, setStatusData] = useState({
    orderStatus: '',
    paymentStatus: '',
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/all');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setStatusData({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/orders/${selectedOrder._id}`, statusData);
      fetchOrders();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const getOrderStatusBadge = (status) => {
    const variants = {
      Processing: 'warning',
      Shipped: 'info',
      Delivered: 'success',
      Cancelled: 'danger',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const variants = {
      Pending: 'warning',
      Paid: 'success',
      Failed: 'danger',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
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

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Manage Orders</h1>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Order Status</th>
                  <th>Payment Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8)}</td>
                      <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                      <td>{order.shippingAddress?.email || 'N/A'}</td>
                      <td className="fw-bold">₹{order.total.toLocaleString()}</td>
                      <td>{getOrderStatusBadge(order.orderStatus)}</td>
                      <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => handleShowModal(order)}
                        >
                          <BiEdit />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <h6 className="mb-3">Order Details</h6>
              <Table bordered size="sm" className="mb-4">
                <tbody>
                  <tr>
                    <td><strong>Order ID:</strong></td>
                    <td>#{selectedOrder._id.slice(-8)}</td>
                  </tr>
                  <tr>
                    <td><strong>Customer:</strong></td>
                    <td>{selectedOrder.shippingAddress?.fullName}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{selectedOrder.shippingAddress?.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{selectedOrder.shippingAddress?.phone}</td>
                  </tr>
                  <tr>
                    <td><strong>Address:</strong></td>
                    <td>
                      {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city},{' '}
                      {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Total:</strong></td>
                    <td className="fw-bold">₹{selectedOrder.total.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Method:</strong></td>
                    <td>{selectedOrder.paymentMethod}</td>
                  </tr>
                </tbody>
              </Table>

              <h6 className="mb-3">Products</h6>
              <Table bordered size="sm" className="mb-4">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.brand}</td>
                      <td>₹{item.price.toLocaleString()}</td>
                      <td>{item.quantity}</td>
                      <td className="fw-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Form onSubmit={handleStatusUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Order Status</Form.Label>
                  <Form.Select
                    value={statusData.orderStatus}
                    onChange={(e) => setStatusData({ ...statusData, orderStatus: e.target.value })}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Select
                    value={statusData.paymentStatus}
                    onChange={(e) => setStatusData({ ...statusData, paymentStatus: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="dark" className="btn-primary">
                    Update Status
                  </Button>
                  <Button variant="outline-dark" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminOrders;
