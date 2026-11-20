import api from "./api";

export const signUp = (data) => api.post("/auth/signup", data);
export const signIn = (data) => api.post("/auth/signin", data);
export const forgotPassword = (email) => api.post("/auth/forgotPasswords", { email });
export const verifyResetCode = (resetCode) => api.post("/auth/verifyResetCode", { resetCode });
export const resetPassword = (data) => api.put("/auth/resetPassword", data);
export const changePassword = (data) => api.put("/users/changeMyPassword", data);

export const getProducts = (params) => api.get("/products", { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get("/categories");
export const getCategory = (id) => api.get(`/categories/${id}`);
export const getBrands = () => api.get("/brands");
export const getBrand = (id) => api.get(`/brands/${id}`);

export const getCart = () => api.get("/cart");
export const addToCart = (productId) => api.post("/cart", { productId });
export const updateCartItem = (id, count) => api.put(`/cart/${id}`, { count });
export const removeCartItem = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete("/cart");

export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = (productId) => api.post("/wishlist", { productId });
export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}`);

export const createCashOrder = (cartId, shippingAddress) =>
  api.post(`/orders/${cartId}`, { shippingAddress });
export const createCheckoutSession = (cartId, shippingAddress) =>
  api.post(`/orders/checkout-session/${cartId}?url=${window.location.origin}`, { shippingAddress });
export const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);
