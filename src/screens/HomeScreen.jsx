import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';

const HomeScreen = () => {
    const { data: products, isLoading, error } = useGetProductsQuery();
    const [selectedCategory, setSelectedCategory] = useState('Sve');
    const dispatch = useDispatch();

    const sokovi = products ? products.filter((p) => !p.isPackage) : [];
    const paketi = products ? products.filter((p) => p.isPackage) : [];

    const categories = sokovi.length
        ? ['Sve', ...new Set(sokovi.map((p) => p.category))]
        : ['Sve'];

    const filtered = selectedCategory === 'Sve'
        ? sokovi
        : sokovi.filter((p) => p.category === selectedCategory);

    const addPackageToCart = (item) => {
        dispatch(addToCart({ ...item, type: 'paket' }));
        toast.success('Paket dodat u korpu');
    };

    return (
        <>
            <Hero />
            {!isLoading && !error && products && (
                <Stats productTotal={sokovi.length} packageTotal={paketi.length} />
            )}

            <section className="section" id="katalog">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">Katalog</p>
                        <h2>Proizvodi</h2>
                    </div>
                    <div className="filters">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={selectedCategory === cat ? 'active' : ''}
                                onClick={() => setSelectedCategory(cat)}
                                type="button"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error?.data?.message || error.error}</Message>
                ) : (
                    <div className="product-grid">
                        {filtered.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {paketi.length > 0 && (
                <section className="section packages-section" id="paketi">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Paketi</p>
                            <h2>Gotove kombinacije</h2>
                        </div>
                    </div>
                    <div className="package-grid">
                        {paketi.map((item) => (
                            <article className="package-card" key={item._id}>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                {item.nutrition && <small>{item.nutrition}</small>}
                                <div className="card-footer">
                                    <strong>{item.price} RSD</strong>
                                </div>
                                <button
                                    className="add-cart-button"
                                    type="button"
                                    onClick={() => addPackageToCart(item)}
                                >
                                    Dodaj u korpu
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
};

export default HomeScreen;