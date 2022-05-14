import React, { useEffect } from "react";
import CartItem from "../CartItems";
import Auth from "../../utils/auth";
import "./style.css";
import { toggleTheCart, addMultipleToTheCart } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers"; // Persistence
// Stripe
import { loadStripe } from "@stripe/stripe-js";
import { useLazyQuery } from "@apollo/client"; // Lazy hooks only occur when called, not upon render
import { QUERY_CHECKOUT } from "../../utils/queries";
import { connect } from "react-redux";
// API Key (Currently the TEST key)
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const Cart = ({ cart, cartOpen, toggle, addMultiple }) => {
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT); // Only occurs when called

  function toggleCart() {
    toggle();
  }

  function calculateTotal() {
    let sum = 0;
    cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];

    cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds },
    });
  }

  // useEffect hook targeted at the data needed for stripe
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise("cart", "get");
      addMultiple([...cart]);
    }

    if (!cart.length) {
      getCart();
    }
  }, [cart.length, addMultiple]);

  if (!cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        {/* You should always wrap emojis (like the shopping cart icon) in a <span> element
        that includes role and aria-label attributes. Doing so will help screen readers 
        understand the context of the emoji. */}
        <span role="img" aria-label="trash">
          🛒
        </span>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {cart.length ? (
        <div>
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>
            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { cart, cartOpen } = state;
  return { cart, cartOpen };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggle: () => dispatch(toggleTheCart()),
    addMultiple: (cart) => dispatch(addMultipleToTheCart(cart)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
