import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import "./index.css";
import { App } from "./components/App";
import { QueryClient, QueryClientProvider } from "react-query";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
