import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_CATEGORIES } from "../../utils/queries";
import { useStoreContext } from "../../utils/GlobalState";
import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";

function CategoryMenu() {
  // Retrieves the current state and dispatch method immediately
  const [state, dispatch] = useStoreContext();
  // Retrieves the categories variable from the current state
  // Was previously: const categories = categoryData.?categories || [];
  const { categories } = state;
  // Get the categories stored in the database
  // Loading is used to test for online status for indexedDB load
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  // Use useEffect to track changes in categoryData and run dispatch when there is finally data
  // Must use useEffect because if dispatch is called immediately, categoryData will be undefined
  useEffect(() => {
    // If categoryData exists or has changed from the response of useQuery, run dispatch
    if (categoryData) {
      // Execute dispatch function with the action object indicating...
      // the type of action and the data to set the state for categories
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories,
      });

      // IndexedDB
      categoryData.categories.forEach((category) => {
        idbPromise("categories", "put", category);
      });
    } else if (!loading) {
      idbPromise("categories", "get").then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id,
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
