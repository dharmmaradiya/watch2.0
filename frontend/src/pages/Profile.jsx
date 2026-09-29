import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Tabs, Tab, Form, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
      },
    });
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profileData);
    if (result.success) {
      setEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const variants = {
      Processing: 'warning',
      Shipped: 'info',
      Delivered: 'success',
      Cancelled: 'danger',
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (!user) {
    return null;
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 text-center">
              <div className="mb-3">
                <div
                  className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h4 className="mb-2">{user.name}</h4>
              <p className="text-muted mb-3">{user.email}</p>
              <Badge bg={user.role === 'admin' ? 'primary' : 'secondary'} className="mb-3">
                {user.role === 'admin' ? 'Admin' : 'Customer'}
              </Badge>
              <div className="d-grid gap-2">
                {user.role === 'admin' && (
                  <Button variant="outline-dark" as="a" href="/admin">
                    Admin Dashboard
                  </Button>
                )}
                <Button variant="outline-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Tabs defaultActiveKey="profile" className="mb-4">
                <Tab eventKey="profile" title="Profile">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>My Profile</h5>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => setEditing(!editing)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      {editing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  {editing ? (
                    <Form onSubmit={handleProfileUpdate}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={profileData.address.street}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, street: e.target.value }
                          })}
                        />
                      </Form.Group>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.address.city}
                              onChange={(e) => setProfileData({
                                ...profileData,
                                address: { ...profileData.address, city: e.target.value }
                              })}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileData.address.state}
                              onChange={(e) => setProfileData({
                                ...profileData,
                                address: { ...profileData.address, state: e.target.value }
                              })}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.address.pincode}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            address: { ...profileData.address, pincode: e.target.value }
                          })}
                        />
                      </Form.Group>
                      <Button type="submit" variant="dark" className="btn-primary">
                        Save Changes
                      </Button>
                    </Form>
                  ) : (
                    <div>
                      <Table className="table-borderless">
                        <tbody>
                          <tr>
                            <td className="fw-bold" style={{ width: '150px' }}>Name:</td>
                            <td>{user.name}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Email:</td>
                            <td>{user.email}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Phone:</td>
                            <td>{user.phone || 'Not provided'}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Address:</td>
                            <td>
                              {user.address?.street && (
                                <>
                                  {user.address.street}<br />
                                  {user.address.city}, {user.address.state}<br />
                                  {user.address.pincode}
                                </>
                              ) || 'Not provided'}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab>

                <Tab eventKey="orders" title="My Orders">
                  <h5 className="mb-4">Order History</h5>
                  {loading ? (
                    <p>Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-muted">No orders yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id}>
                              <td>#{order._id.slice(-8)}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="fw-bold">₹{order.total.toLocaleString()}</td>
                              <td>{getStatusBadge(order.orderStatus)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab>

                <Tab eventKey="quick-links" title="Quick Links">
                  <div className="d-grid gap-3">
                    <Button variant="outline-dark" as="a" href="/cart">
                      <i className="bi bi-box-seam me-2"></i>
                      View Cart
                    </Button>
                    <Button variant="outline-dark" as="a" href="/wishlist">
                      <i className="bi bi-heart me-2"></i>
                      View Wishlist
                    </Button>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
