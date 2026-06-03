export const createReview = ({ product, productId, rating, comment, currentUser }) => ({
  id: Date.now(),
  productId: Number(productId),
  productName: product.name,
  userEmail: currentUser.email,
  userName: currentUser.name || currentUser.email,
  rating: Number(rating),
  comment,
  createdAt: new Date().toISOString(),
});
