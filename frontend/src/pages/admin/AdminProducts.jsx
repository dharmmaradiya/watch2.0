import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminProducts = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    specifications: {
      caseMaterial: '',
      strapMaterial: '',
      dialColor: '',
      movement: '',
      waterResistance: '',
      warranty: '',
      caseSize: '',
    },
    featured: false,
    trending: false,
    bestseller: false,
    newArrival: false,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || '',
        category: product.category?._id || '',
        stock: product.stock,
        specifications: product.specifications || {},
        featured: product.featured || false,
        trending: product.trending || false,
        bestseller: product.bestseller || false,
        newArrival: product.newArrival || false,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        description: '',
        price: '',
        discountPrice: '',
        category: '',
        stock: '',
        specifications: {
          caseMaterial: '',
          strapMaterial: '',
          dialColor: '',
          movement: '',
          waterResistance: '',
          warranty: '',
          caseSize: '',
        },
        featured: false,
        trending: false,
        bestseller: false,
        newArrival: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('brand', formData.brand);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('discountPrice', formData.discountPrice);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('specifications', JSON.stringify(formData.specifications));
    data.append('featured', formData.featured);
    data.append('trending', formData.trending);
    data.append('bestseller', formData.bestseller);
    data.append('newArrival', formData.newArrival);

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }}>Manage Products</h1>
        <Button variant="dark" className="btn-primary" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-lg me-2"></i>
          Add Product
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">No products found</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/50x50'}
                          alt={product.name}
                          width={50}
                          height={50}
                          style={{ objectFit: 'cover' }}
                          className="rounded"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td className="fw-bold">
                        ₹{(product.discountPrice || product.price).toLocaleString()}
                      </td>
                      <td>
                        <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                          {product.stock}
                        </Badge>
                      </td>
                      <td>{product.category?.name || 'N/A'}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {product.featured && <Badge bg="primary">Featured</Badge>}
                          {product.trending && <Badge bg="info">Trending</Badge>}
                          {product.bestseller && <Badge bg="success">Bestseller</Badge>}
                          {product.newArrival && <Badge bg="warning">New</Badge>}
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowModal(product)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                        >
                          <i className="bi bi-trash"></i>
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
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Images (Upload up to 5 images)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
              />
            </Form.Group>

            <h6 className="mt-4 mb-3">Specifications</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Case Material</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.specifications.caseMaterial}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, caseMaterial: e.target.value }
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Strap Material</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.specifications.strapMaterial}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, strapMaterial: e.target.value }
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dial Color</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.specifications.dialColor}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, dialColor: e.target.value }
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Movement</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.specifications.movement}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, movement: e.target.value }
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Water Resistance</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.specifications.waterResistance}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, waterResistance: e.target.value }
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Warranty</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.specifications.warranty}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, warranty: e.target.value }
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Case Size</Form.Label>
              <Form.Control
                type="text"
                value={formData.specifications.caseSize}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, caseSize: e.target.value }
                })}
              />
            </Form.Group>

            <h6 className="mt-4 mb-3">Product Tags</h6>
            <Form.Check
              type="checkbox"
              label="Featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="Trending"
              checked={formData.trending}
              onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="Bestseller"
              checked={formData.bestseller}
              onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="New Arrival"
              checked={formData.newArrival}
              onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
            />

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="dark" className="btn-primary">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
              <Button variant="outline-dark" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminProducts;
