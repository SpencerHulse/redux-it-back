export const UPDATE_PRODUCTS = "UPDATE_PRODUCTS";
export const UPDATE_CATEGORIES = "UPDATE_CATEGORIES";
export const UPDATE_CURRENT_CATEGORY = "UPDATE_CURRENT_CATEGORY";

// Cart UI
export const ADD_TO_CART = "ADD_TO_CART";
export const ADD_MULTIPLE_TO_CART = "ADD_MULTIPLE_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART_QUANTITY = "UPDATE_CART_QUANTITY";
export const CLEAR_CART = "CLEAR_CART";
export const TOGGLE_CART = "TOGGLE_CART";

// Action functions
export const updateProducts = (products) => {
  return { type: UPDATE_PRODUCTS, payload: { products } };
};

export const itemToCart = (item) => {
  return {
    type: ADD_TO_CART,
    product: { ...item, purchaseQuantity: 1 },
  };
};

export const updateTheCategories = (categories) => {
  return { type: UPDATE_CATEGORIES, categories: categories };
};

export const updateCurrentCategory = (id) => {
  return { type: UPDATE_CURRENT_CATEGORY, currentCategory: id };
};

export const removeItemFromCart = (id) => {
  return { type: REMOVE_FROM_CART, _id: id };
};

export const updateQuantity = (id, quantity) => {
  return { type: UPDATE_CART_QUANTITY, _id: id, purchaseQuantity: quantity };
};

export const toggleTheCart = () => {
  return { type: TOGGLE_CART };
};

export const addMultipleToTheCart = (cart) => {
  return { type: ADD_MULTIPLE_TO_CART, products: cart };
};
