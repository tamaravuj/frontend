import { useState } from 'react';
import { categories } from '../data/shopData';
import { formatPrice } from '../utils/cartUtils';

function AdminScreen({ orders, products, users, onDeleteProduct, onSaveProduct, onUpdateOrderStatus }) {
  const emptyProductForm = {
    id: null,
    name: '',
    category: 'detoks',
    price: '',
    rating: 4.5,
    image: '/images/pocetnasokovi.jpeg',
    description: '',
    nutrition: '',
  };
  const [productForm, setProductForm] = useState(emptyProductForm);

  const updateProductField = (field, value) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const submitProduct = (event) => {
    event.preventDefault();
    onSaveProduct(productForm);
    setProductForm(emptyProductForm);
  };

  const editProduct = (product) => {
    setProductForm(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="section admin-section" aria-labelledby="admin-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 id="admin-title">Upravljanje prodavnicom</h1>
        </div>
      </div>

      <div className="admin-grid">
        <form className="admin-panel checkout-form" onSubmit={submitProduct}>
          <h2>{productForm.id ? 'Izmena proizvoda' : 'Novi proizvod'}</h2>
          <label>
            Naziv
            <input
              onChange={(event) => updateProductField('name', event.target.value)}
              required
              type="text"
              value={productForm.name}
            />
          </label>
          <label>
            Kategorija
            <select onChange={(event) => updateProductField('category', event.target.value)} value={productForm.category}>
              {categories
                .filter((category) => category !== 'sve')
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Cena
            <input
              min="1"
              onChange={(event) => updateProductField('price', event.target.value)}
              required
              type="number"
              value={productForm.price}
            />
          </label>
          <label>
            Slika
            <input
              onChange={(event) => updateProductField('image', event.target.value)}
              required
              type="text"
              value={productForm.image}
            />
          </label>
          <label>
            Sastav
            <textarea
              onChange={(event) => updateProductField('description', event.target.value)}
              required
              rows="3"
              value={productForm.description}
            />
          </label>
          <label>
            Nutritivne vrednosti
            <input
              onChange={(event) => updateProductField('nutrition', event.target.value)}
              required
              type="text"
              value={productForm.nutrition}
            />
          </label>
          <button className="auth-submit" type="submit">
            Sacuvaj proizvod
          </button>
          {productForm.id && (
            <button className="secondary-action" type="button" onClick={() => setProductForm(emptyProductForm)}>
              Odustani od izmene
            </button>
          )}
        </form>

        <section className="admin-panel">
          <h2>Proizvodi</h2>
          <div className="admin-list">
            {products.map((product) => (
              <article key={product.id}>
                <div>
                  <h3>{product.name}</h3>
                  <p>
                    {product.category} | {formatPrice(product.price)}
                  </p>
                </div>
                <div className="admin-actions">
                  <button className="secondary-action" type="button" onClick={() => editProduct(product)}>
                    Izmeni
                  </button>
                  <button className="remove-button" type="button" onClick={() => onDeleteProduct(product.id)}>
                    Obrisi
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-grid wide">
        <section className="admin-panel">
          <h2>Porudzbine</h2>
          <div className="admin-list">
            {orders.length === 0 ? (
              <p className="muted-text">Nema pristiglih porudzbina.</p>
            ) : (
              orders.map((order) => (
                <article key={order.id}>
                  <div>
                    <h3>{order.id}</h3>
                    <p>
                      {order.userName} | {formatPrice(order.totals.totalPrice)}
                    </p>
                  </div>
                  <select value={order.status} onChange={(event) => onUpdateOrderStatus(order.id, event.target.value)}>
                    <option>U obradi</option>
                    <option>Odobrena</option>
                    <option>Poslata</option>
                    <option>Isporucena</option>
                    <option>Otkazana</option>
                  </select>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="admin-panel">
          <h2>Korisnici</h2>
          <div className="admin-list">
            {users.map((user) => (
              <article key={user.email}>
                <div>
                  <h3>{user.name || user.email}</h3>
                  <p>{user.email}</p>
                </div>
                <span className="status-pill">{user.role || 'user'}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default AdminScreen;
