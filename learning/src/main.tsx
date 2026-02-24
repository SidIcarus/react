import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LiveSearch from "./tasks/LiveSearch";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LiveSearch />
  </StrictMode>,
);
