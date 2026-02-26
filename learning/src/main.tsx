import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Stopwatch from "./tasks/Stopwatch";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Stopwatch />
  </StrictMode>,
);
