import { useState } from 'react';
import { Row, Col, Table, Button, Form } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from '../slices/productsApiSlice';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../slices/ordersApiSlice';

const emptyProductForm = {
    name: '',
    category: 'detoks',
    price: '',
    image: '/images/pocetnasokovi.jpeg',
    description: '',
    nutrition: '',
};

const AdminScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [productForm, setProductForm] = useState(emptyProductForm);
    const [editId, setEditId] = useState(null);

    const { data: products, isLoading: loadingProducts, error: errorProducts } = useGetProductsQuery();
    const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetAllOrdersQuery();

    const [createProduct, { isLoading: creating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();

    if (!userInfo?.isAdmin) {
        navigate('/');
        return null;
    }

    const updateField = (field, value) => {
        setProductForm((current) => ({ ...current, [field]: value }));
    };

    const submitProduct = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateProduct({ ...productForm, _id: editId }).unwrap();
                toast.success('Proizvod izmenjen');
            } else {
                await createProduct(productForm).unwrap();
                toast.success('Proizvod dodat');
            }
            setProductForm(emptyProductForm);
            setEditId(null);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const editProduct = (product) => {
        setProductForm({
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            description: product.description,
            nutrition: product.nutrition || '',
        });
        setEditId(product._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Obrisati proizvod?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Proizvod obrisan');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const updateStatusHandler = async (orderId, status) => {
        try {
            await updateOrderStatus({ orderId, status }).unwrap();
            toast.success('Status porudzbine azuriran');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <h1>Admin panel</h1>
            <Row>
                <Col md={4}>
                    <h2>{editId ? 'Izmena proizvoda' : 'Novi proizvod'}</h2>
                    <Form onSubmit={submitProduct}>
                        <Form.Group className="my-2">
                            <Form.Label>Naziv</Form.Label>
                            <Form.Control type="text" value={productForm.name} required onChange={(e) => updateField('name', e.target.value)} />
                        </Form.Group>
                        <Form.Group className="my-2">
                            <Form.Label>Kategorija</Form.Label>
                            <Form.Control type="text" value={productForm.category} required onChange={(e) => updateField('category', e.target.value)} />
                        </Form.Group>
                        <Form.Group className="my-2">
                            <Form.Label>Cena</Form.Label>
                            <Form.Control type="number" min="1" value={productForm.price} required onChange={(e) => updateField('price', e.target.value)} />
                        </Form.Group>
                        <Form.Group className="my-2">
                            <Form.Label>Slika (URL)</Form.Label>
                            <Form.Control type="text" value={productForm.image} required onChange={(e) => updateField('image', e.target.value)} />
                        </Form.Group>
                        <Form.Group className="my-2">
                            <Form.Label>Opis</Form.Label>
                            <Form.Control as="textarea" rows={3} value={productForm.description} required onChange={(e) => updateField('description', e.target.value)} />
                        </Form.Group>
                        <Form.Group className="my-2">
                            <Form.Label>Nutritivne vrednosti</Form.Label>
                            <Form.Control type="text" value={productForm.nutrition} onChange={(e) => updateField('nutrition', e.target.value)} />
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={creating || updating}>
                            Sacuvaj
                        </Button>
                        {editId && (
                            <Button type="button" variant="secondary" className="ms-2"
                                onClick={() => { setProductForm(emptyProductForm); setEditId(null); }}>
                                Odustani
                            </Button>
                        )}
                    </Form>
                </Col>
                <Col md={8}>
                    <h2>Proizvodi</h2>
                    {loadingProducts ? <Loader /> : errorProducts ? (
                        <Message variant="danger">{errorProducts?.data?.message}</Message>
                    ) : (
                        <Table striped hover responsive className="table-sm">
                            <thead>
                                <tr><th>Naziv</th><th>Kategorija</th><th>Cena</th><th></th></tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.price} RSD</td>
                                        <td>
                                            <Button variant="light" className="btn-sm me-2" onClick={() => editProduct(product)}><FaEdit /></Button>
                                            <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}><FaTrash /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    <h2 className="mt-4">Porudzbine</h2>
                    {loadingOrders ? <Loader /> : errorOrders ? (
                        <Message variant="danger">{errorOrders?.data?.message}</Message>
                    ) : (
                        <Table striped hover responsive className="table-sm">
                            <thead>
                                <tr><th>ID</th><th>Korisnik</th><th>Ukupno</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.user?.name || order.user}</td>
                                        <td>{order.totalPrice} RSD</td>
                                        <td>
                                            <Form.Select size="sm" value={order.status || 'U obradi'}
                                                onChange={(e) => updateStatusHandler(order._id, e.target.value)}>
                                                <option>U obradi</option>
                                                <option>Odobrena</option>
                                                <option>Poslata</option>
                                                <option>Isporucena</option>
                                                <option>Otkazana</option>
                                            </Form.Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default AdminScreen;