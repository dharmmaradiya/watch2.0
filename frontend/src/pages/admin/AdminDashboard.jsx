import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchStats();
    fetchRecentOrders();
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const [userStats, productResponse, orderStats] = await Promise.all([
        api.get('/users/stats'),
        api.get('/products'),
        api.get('/orders/stats'),
      ]);
      setStats({
        totalUsers: userStats.data.totalUsers,
        totalProducts: productResponse.data.length,
        totalOrders: orderStats.data.totalOrders,
        totalRevenue: orderStats.data.totalRevenue,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await api.get('/orders/all');
      setRecentOrders(response.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Processing: 'warning',
      Shipped: 'info',
      Delivered: 'success',
      Cancelled: 'danger',
    };
    return <span className={`badge bg-${variants[status] || 'secondary'}`}>{status}</span>;
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
      <h1 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Dashboard</h1>
      
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="bi bi-people text-primary" style={{ fontSize: '40px' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <h3 className="mb-0">{stats.totalUsers}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="bi bi-box text-success" style={{ fontSize: '40px' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Products</h6>
                  <h3 className="mb-0">{stats.totalProducts}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="bi bi-bag text-warning" style={{ fontSize: '40px' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Orders</h6>
                  <h3 className="mb-0">{stats.totalOrders}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="bi bi-currency-rupee text-danger" style={{ fontSize: '40px' }}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Revenue</h6>
                  <h3 className="mb-0">₹{(stats.totalRevenue / 1000).toFixed(0)}k</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h5 className="mb-4">Recent Orders</h5>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">No orders yet</td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-8)}</td>
                          <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                          <td className="fw-bold">₹{order.total.toLocaleString()}</td>
                          <td>{getStatusBadge(order.orderStatus)}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              <Button variant="outline-dark" className="mt-3" as="a" href="/admin/orders">
                View All Orders
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="mb-4">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Button variant="dark" as="a" href="/admin/products">
                  Manage Products
                </Button>
                <Button variant="outline-dark" as="a" href="/admin/categories">
                  Manage Categories
                </Button>
                <Button variant="outline-dark" as="a" href="/admin/orders">
                  Manage Orders
                </Button>
                <Button variant="outline-dark" as="a" href="/admin/users">
                  Manage Users
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
