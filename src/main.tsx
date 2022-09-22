import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <p>Hello, world!</p>
  </StrictMode>
);
