import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from "../assets/spinner.gif";

import Cart from "../components/Cart";
import {
  updateProducts,
  itemToCart,
  updateQuantity,
  removeItemFromCart,
} from "../utils/actions";
import { idbPromise } from "../utils/helpers";
import { connect } from "react-redux";

function Detail({
  products,
  cart = [],
  getProducts,
  addItemToCart,
  update,
  remove,
}) {
  const { id } = useParams();
  // Local is still used here because this is the only place in the app it is needed
  // Saving it would provide no benefit
  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      update(id, parseInt(itemInCart.purchaseQuantity) + 1);

      // If updating quantity, use the existing data
      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      addItemToCart(currentProduct);

      idbPromise("cart", "put", { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCart = () => {
    remove(currentProduct._id);

    idbPromise("cart", "delete", { ...currentProduct });
  };

  useEffect(() => {
    // Checks for data in the global state's products array
    if (products.length) {
      // If there is, it is used to figure out which one to display
      setCurrentProduct(products.find((product) => product._id === id));
      // If there is no global state data, the data from the Query is used
    } else if (data) {
      getProducts(data.products);

      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });
    } else if (!loading) {
      idbPromise("products", "get").then((indexedProducts) => {
        getProducts(indexedProducts);
      });
    }
  }, [products, data, getProducts, id, loading]);

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{" "}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

const mapStateToProps = (state) => {
  console.log(state);
  const { products, cart } = state;
  return { products, cart };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProducts: (products) => dispatch(updateProducts(products)),
    addItemToCart: (item) => dispatch(itemToCart(item)),
    update: (id, quantity) => dispatch(updateQuantity(id, quantity)),
    remove: (id) => dispatch(removeItemFromCart(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
