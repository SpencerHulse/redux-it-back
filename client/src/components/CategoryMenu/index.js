import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_CATEGORIES } from "../../utils/queries";
import {
  updateTheCategories,
  updateCurrentCategory,
} from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import { connect } from "react-redux";

function CategoryMenu({ updateCategories, updateCategory, categories }) {
  // Get the categories stored in the database
  // Loading is used to test for online status for indexedDB load
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    // If categoryData exists or has changed from the response of useQuery, run dispatch
    if (categoryData) {
      updateCategories(categoryData.categories);

      // IndexedDB
      categoryData.categories.forEach((category) => {
        idbPromise("categories", "put", category);
      });
    } else if (!loading) {
      idbPromise("categories", "get").then((categories) => {
        updateCategories(categories);
      });
    }
  }, [categoryData, loading, updateCategories]);

  const handleClick = (id) => {
    updateCategory(id);
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

const mapStateToProps = (state) => {
  const { categories } = state;
  return { categories };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCategories: (categories) => dispatch(updateTheCategories(categories)),
    updateCategory: (id) => dispatch(updateCurrentCategory(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryMenu);
