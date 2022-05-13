import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import Jumbotron from "../components/Jumbotron";
import { ADD_ORDER } from "../utils/mutations";
import { idbPromise } from "../utils/helpers";

function Success() {
  const [addOrder] = useMutation(ADD_ORDER);

  useEffect(() => {
    async function saveOrder() {
      const cart = await idbPromise("cart", "get"); // Get everything in the cart
      const products = cart.map((product) => product._id); // Get an array of product IDs

      if (products.length) {
        const { data } = await addOrder({ variables: { products } }); // add the order and get data from it
        const productData = data.addOrder.products; // separate out the product data

        productData.forEach((item) => {
          idbPromise("cart", "delete", item); // delete each item from indexedDB
        });
      }

      setTimeout(() => {
        window.location.assign("/");
      }, 3000);
    }

    saveOrder();
  }, [addOrder]);

  return (
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>Thank you for your purchase!</h2>
        <h2>You will now be redirected to the homepage</h2>
      </Jumbotron>
    </div>
  );
}

export default Success;
