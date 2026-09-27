import React from "react";
import App from "./App";
import configureStore from "./store";
import { subscribeToAuthState } from "./store/authSession";
import { fetchCurrentUser } from "./store/usersReducer";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import { getLocalStorageSearchCredentials } from "./store/utils";
import { SkeletonTheme } from "react-loading-skeleton";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

const localStorageData = getLocalStorageSearchCredentials();

let initialState = {
  searchFilter: {
    ...localStorageData,
  },
};

const store = configureStore(initialState);

store.dispatch(fetchCurrentUser()).catch((error) => {
  // Keep the app usable when a stale or expired Supabase session is present.
  console.error("Unable to restore Supabase session", error);
});
subscribeToAuthState(store.dispatch);

root.render(
  <React.StrictMode>
    <ChakraBaseProvider>
      <React.StrictMode>
        <Provider store={store}>
          <BrowserRouter>
              <App />
          </BrowserRouter>
        </Provider>
      </React.StrictMode>
    </ChakraBaseProvider>
  </React.StrictMode>
);

