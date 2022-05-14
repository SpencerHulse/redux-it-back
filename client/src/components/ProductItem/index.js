import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers";
import { idbPromise } from "../../utils/helpers";

import { connect } from "react-redux";
import { updateCartQuantity, itemToCart } from "../../utils/actions";

function ProductItem(item, { cart = [], cartQuantity, addItemToCart }) {
  const { image, name, _id, price, quantity } = item;

  const addToCart = () => {
    // Find any cart items with matching IDs
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);

    // If there is a match, update instead of adding...
    if (itemInCart) {
      cartQuantity(_id, itemInCart);

      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      addItemToCart(item);

      idbPromise("cart", "put", { ...item, purchaseQuantity: 1 });
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img alt={name} src={`/images/${image}`} />
        <p>{name}</p>
      </Link>
      <div>
        <div>
          {quantity} {pluralize("item", quantity)} in stock
        </div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { cart } = state;
  return { cart };
};

const mapDispatchToProps = (dispatch) => {
  return {
    cartQuantity: (_id, itemInCart) =>
      dispatch(updateCartQuantity(_id, itemInCart)),
    addItemToCart: (item) => dispatch(itemToCart(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem);
