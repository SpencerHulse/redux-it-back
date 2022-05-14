import React from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { removeItemFromCart, updateQuantity } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import { connect } from "react-redux";

const CartItem = ({ item, remove, update }) => {
  const removeFromCart = (item) => {
    remove(item._id);

    idbPromise("cart", "delete", { ...item });
  };

  const onChange = (e) => {
    const value = e.target.value;

    if (value === "0") {
      remove(item._id);

      idbPromise("cart", "delete", { ...item });
    } else {
      update(item._id, parseInt(value));

      idbPromise("cart", "put", {
        ...item,
        purchaseQuantity: parseInt(value),
      });
    }
  };

  return (
    <div className="flex-row">
      <div>
        <img src={`/images/${item.image}`} alt="" />
      </div>
      <div>
        <div>
          {item.name}, ${item.price}
        </div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    remove: (id) => dispatch(removeItemFromCart(id)),
    update: (id, quantity) => dispatch(updateQuantity(id, quantity)),
  };
};

export default connect(null, mapDispatchToProps)(CartItem);
