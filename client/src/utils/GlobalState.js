// createContext creates the context container to hold the global state data and functionality
// useContext is a hook that lets you to use the state created by createContext
import React, { createContext, useContext } from "react";
import { useProductReducer } from "./reducers";

const StoreContext = createContext();
// All context objects have two components - Provider and Consumer
// Provider: Wraps the application to make state data available to all other components
// Consumer: Grabbing and using state from the Provider
const { Provider } = StoreContext;

// Instantiate the global state using useProductReducer
// Because it (useProductReducer) wraps around the useReducer Hook from React, running it returns two things:
// state: most up-to-date version of the global state object
// dispatch: method to update state. Looks for an action object passed in as an argument.
// The props are any additional props needed, which can add flexibility
const StoreProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useProductReducer({
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: "",
  });
  return <Provider value={[state, dispatch]} {...props} />;
};

// Used by components that need the data provided by the <StoreProvider>
const useStoreContext = () => {
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
