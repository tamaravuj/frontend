export const saveProduct = (products, product) => {
  if (product.id) {
    return products.map((item) =>
      item.id === product.id ? { ...item, ...product, price: Number(product.price) } : item
    );
  }

  const nextId = Math.max(0, ...products.map((item) => item.id)) + 1;

  return [
    ...products,
    {
      ...product,
      id: nextId,
      price: Number(product.price),
      rating: Number(product.rating || 4.5),
      image: product.image || '/images/pocetnasokovi.jpeg',
    },
  ];
};

export const deleteProduct = (products, productId) => products.filter((product) => product.id !== productId);
