import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { theme } from "./theme/index.ts";
import InternetConnectionProvider from "./provider/internetConnectionProvider.tsx";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <InternetConnectionProvider>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
    ,
  </InternetConnectionProvider>,
);
