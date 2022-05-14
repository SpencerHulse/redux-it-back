import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";

import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif";

import { connect } from "react-redux";
import { updateProducts } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";

function ProductList({ products = [], currentCategory = "", getProducts }) {
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // If there's data to be stored, save it in two places
    if (data) {
      // Redux
      getProducts(data.products);

      // IndexedDB
      data.products.forEach((product) => {
        idbPromise("products", "put", product);
      });
      // The else condition to decide whether to use indexedDB data will be whether loading is undefined
      // loading comes from the useQuery above
    } else if (!loading) {
      // Since offline, all the data comes from the indexedDB "products" store
      idbPromise("products", "get").then((products) => {
        // Use the retrieved data to set state for offline browsing
        getProducts(products);
      });
    }
  }, [data, loading, getProducts]);

  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  const { products, currentCategory } = state;
  return { products, currentCategory };
};

const mapDispatchToProps = (dispatch) => {
  return { getProducts: (products) => dispatch(updateProducts(products)) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
